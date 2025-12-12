#!/usr/bin/env python3
import time
import logging
import datetime
import pandas as pd
import psycopg2
import soccerdata as sd
from requests.exceptions import HTTPError

# -------------------------
# CONFIG
# -------------------------
DB_HOST = "localhost"
DB_PORT = 5432
DB_USER = "fantasy"
DB_PASS = "fantasy123"
DB_NAME = "fantasydb"

LEAGUE = "ESP-La Liga"
SEASON = 2025

RETRY_ATTEMPTS = 5
RETRY_DELAY = 5
PER_REQUEST_DELAY = 2

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger("ETL")


# -------------------------
# DB helpers
# -------------------------
def get_db_conn():
    dsn = f"host={DB_HOST} port={DB_PORT} user={DB_USER} password={DB_PASS} dbname={DB_NAME}"
    return psycopg2.connect(dsn)


def get_existing_fbref_game_ids(conn):
    cur = conn.cursor()
    cur.execute("SELECT fbref_id FROM matches;")
    rows = cur.fetchall()
    cur.close()
    return {r[0] for r in rows if r[0]}


def get_team_id(conn, team_name):
    cur = conn.cursor()
    cur.execute("SELECT id FROM teams WHERE name=%s LIMIT 1;", (team_name,))
    r = cur.fetchone()
    if r:
        cur.close()
        return r[0]
    else:
        # Insertar equipo nuevo
        cur.execute("INSERT INTO teams (name) VALUES (%s) RETURNING id;", (team_name,))
        team_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        return team_id


# -------------------------
# Crear player_name desde índice
# -------------------------
def extract_player_name(df: pd.DataFrame) -> pd.DataFrame:
    # Flatten MultiIndex columns
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = ["_".join([str(i) for i in col if i]) for col in df.columns]

    # Extraer nombre del jugador desde índice
    if "player_name" not in df.columns:
        if "player" in df.index.names:
            df = df.reset_index()
            df.rename(columns={"player": "player_name"}, inplace=True)
        else:
            raise ValueError(
                "No se puede identificar al jugador: 'player' no en índice"
            )
    return df


# -------------------------
# Parsear edad FBref
# -------------------------
def parse_age(age_str):
    """
    Convierte edad FBref '29-305' a años como float
    """
    if not age_str:
        return 25.0  # valor por defecto
    try:
        years, days = age_str.split("-")
        return int(years) + int(days) / 365
    except:
        return 25.0


# -------------------------
# Inserción y upsert
# -------------------------
def upsert_match(conn, match_row):
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO matches (external_id, season, competition, date, home_team_id, away_team_id, home_goals, away_goals, fbref_id, last_updated)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        ON CONFLICT (external_id)
        DO UPDATE SET last_updated = EXCLUDED.last_updated,
                      home_goals = EXCLUDED.home_goals,
                      away_goals = EXCLUDED.away_goals;
    """,
        (
            match_row.get("external_id"),
            match_row.get("season"),
            match_row.get("competition"),
            match_row.get("date"),
            match_row.get("home_team_id"),
            match_row.get("away_team_id"),
            match_row.get("home_goals"),
            match_row.get("away_goals"),
            match_row.get("fbref_id"),
            datetime.datetime.now(datetime.UTC),
        ),
    )
    conn.commit()
    cur.close()


def upsert_player(conn, player_row):
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO players (external_id, name, position, team_id, market_value, updated_at)
        VALUES (%s,%s,%s,%s,%s,%s)
        ON CONFLICT (external_id)
        DO UPDATE SET name = EXCLUDED.name,
                      position = EXCLUDED.position,
                      team_id = EXCLUDED.team_id,
                      updated_at = EXCLUDED.updated_at;
    """,
        (
            player_row.get("external_id"),
            player_row.get("name"),
            player_row.get("position"),
            player_row.get("team_id"),
            player_row.get("market_value", 0),
            datetime.datetime.now(datetime.UTC),
        ),
    )
    conn.commit()
    cur.close()


def insert_stat_and_points(conn, match_id, player_id, stat_row, points):
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO stats (match_id, player_id, minutes, goals, assists, xg, xa, yellow, red, dribbles_completed, crosses_into_box, recoveries, clearances, losses, updated_at)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        ON CONFLICT DO NOTHING;
    """,
        (
            match_id,
            player_id,
            stat_row.get("minutes", 0),
            stat_row.get("goals", 0),
            stat_row.get("assists", 0),
            stat_row.get("xg", 0),
            stat_row.get("xa", 0),
            stat_row.get("yellow", 0),
            stat_row.get("red", 0),
            stat_row.get("dribbles_completed", 0),
            stat_row.get("crosses_into_box", 0),
            stat_row.get("recoveries", 0),
            stat_row.get("clearances", 0),
            stat_row.get("losses", 0),
            datetime.datetime.now(datetime.UTC),
        ),
    )
    cur.execute(
        """
        INSERT INTO points_history (player_id, match_id, points, calculated_at)
        VALUES (%s,%s,%s,%s)
    """,
        (player_id, match_id, points, datetime.datetime.now(datetime.UTC)),
    )
    conn.commit()
    cur.close()


def insert_market_history(conn, player_id, market_value):
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO market_history (player_id, market_value, calculated_at)
        VALUES (%s,%s,%s)
    """,
        (player_id, market_value, datetime.datetime.now(datetime.UTC)),
    )
    conn.commit()
    cur.close()


# -------------------------
# Cálculo puntos y mercado
# -------------------------
POSITION_FACTORS = {
    "DEF": {"goal": 6, "assist": 3, "xg": 1, "xa": 1, "yellow": -1, "red": -3},
    "MID": {"goal": 5, "assist": 3, "xg": 1, "xa": 1, "yellow": -1, "red": -3},
    "FWD": {"goal": 4, "assist": 3, "xg": 1, "xa": 1, "yellow": -1, "red": -3},
    "GK": {
        "goal": 6,
        "assist": 3,
        "xg": 0,
        "xa": 0,
        "yellow": -1,
        "red": -3,
        "clean_sheet": 5,
    },
}


def calc_points_from_row(row):
    pos = row.get("position", "MID")
    f = POSITION_FACTORS.get(pos, POSITION_FACTORS["MID"])
    points = 0
    points += row.get("goals", 0) * f.get("goal", 0)
    points += row.get("assists", 0) * f.get("assist", 0)
    points += row.get("xg", 0) * f.get("xg", 0)
    points += row.get("xa", 0) * f.get("xa", 0)
    points -= row.get("yellow", 0) * 1  # menos agresivo
    points -= row.get("red", 0) * 3
    if pos == "FWD" and row.get("goals", 0) >= 3:
        points += 3
    if pos == "MID" and row.get("assists", 0) >= 2:
        points += 2
    # Penalización por pérdidas más realista
    points -= row.get("losses", 0) * 0.05
    points += row.get("dribbles_completed", 0) * 0.2
    points += row.get("crosses_into_box", 0) * (0.3 if pos in ["DEF", "MID"] else 0.1)
    points += row.get("recoveries", 0) * 0.1
    points += row.get("clearances", 0) * (0.2 if pos in ["DEF", "GK"] else 0.05)
    minutes = row.get("minutes", 90)
    points *= min(1, minutes / 90)
    return round(max(points, 0), 2)  # no dejar puntos negativos


def calc_market_value(player_hist_points: list, minutes_avg: float, age_years: float):
    last5 = player_hist_points[-5:] if player_hist_points else []
    last5_avg = sum(last5) / len(last5) if last5 else 0
    import math

    std = (
        (sum((p - last5_avg) ** 2 for p in last5) / len(last5)) ** 0.5
        if len(last5) > 1
        else 0
    )
    consistency = 1 / (std + 1)
    age_factor = 1.2 if age_years <= 25 else (1.0 if age_years <= 30 else 0.9)
    base = 500_000
    val = base * (1 + 0.5 * (last5_avg / 10)) * (1 + 0.2 * consistency) * age_factor
    return int(round(val / 1000) * 1000)


# -------------------------
# ETL incremental LaLiga
# -------------------------
def main():
    conn = get_db_conn()
    existing_ids = get_existing_fbref_game_ids(conn)
    logger.info(f"{len(existing_ids)} partidos ya en BD")

    fbref = sd.FBref(leagues=[LEAGUE], seasons=[SEASON], no_cache=True)

    # Descargar fixtures con retry
    for attempt in range(RETRY_ATTEMPTS):
        try:
            schedule_df = fbref.read_schedule(force_cache=True)
            break
        except HTTPError as e:
            logger.warning(f"Intento {attempt+1} fallido: {e}")
            time.sleep(RETRY_DELAY)
    else:
        logger.error("No se pudo descargar el calendario")
        return

    schedule_df.rename(
        columns={"id": "game_id"} if "id" in schedule_df.columns else {}, inplace=True
    )
    schedule_df["is_new"] = ~schedule_df["game_id"].isin(existing_ids)
    new_games = schedule_df[schedule_df["is_new"]]
    logger.info(f"Total partidos: {len(schedule_df)}, nuevos: {len(new_games)}")

    # Procesar solo partidos no en BD
    for _, g in new_games.iterrows():
        game_id = g["game_id"]
        logger.info(f"[NEW] Procesando partido {game_id}")

        # Retry para stats
        for attempt in range(RETRY_ATTEMPTS):
            try:
                player_stats = fbref.read_player_match_stats(
                    stat_type="summary", match_id=game_id
                )
                player_stats = extract_player_name(player_stats)
                break
            except HTTPError as e:
                logger.warning(f"Intento {attempt+1} para {game_id} fallido: {e}")
                time.sleep(RETRY_DELAY)
        else:
            logger.warning(f"Se salta partido {game_id} por fallo repetido")
            continue

        partes_hora = g.get("time").split(":")
        hora = int(partes_hora[0])
        minuto = int(partes_hora[1])
        nueva_fecha_desde_str = g.get(
            "date", datetime.datetime.now(datetime.UTC)
        ).replace(hour=hora, minute=minuto, second=0)
        goals = str(g.get("score")).split("–")
        # Insertar match
        match_row = {
            "external_id": game_id,
            "season": SEASON,
            "competition": LEAGUE,
            "date": g.get("date", nueva_fecha_desde_str),
            "home_team_id": get_team_id(conn, g.get("home_team", "unknown")),
            "away_team_id": get_team_id(conn, g.get("away_team", "unknown")),
            "home_goals": goals[0],
            "away_goals": goals[1],
            "fbref_id": game_id,
        }
        upsert_match(conn, match_row)

        # Insertar players, stats y calcular puntos/market
        for _, prow in player_stats.iterrows():
            team_id = get_team_id(conn, prow.get("team", "unknown"))
            age_years = parse_age(prow.get("age", "25-0"))
            player_row = {
                "external_id": prow["player_name"],
                "name": prow["player_name"],
                "position": prow.get("pos", "MID"),
                "team_id": team_id,
                "market_value": 0,
            }
            upsert_player(conn, player_row)

            cur = conn.cursor()
            cur.execute(
                "SELECT id FROM players WHERE external_id=%s LIMIT 1;",
                (prow["player_name"],),
            )
            r = cur.fetchone()
            player_id = r[0] if r else None
            cur.execute(
                "SELECT id FROM matches WHERE external_id=%s LIMIT 1;", (game_id,)
            )
            r2 = cur.fetchone()
            match_id = r2[0] if r2 else None
            cur.close()
            if not player_id or not match_id:
                logger.warning(
                    f"Faltan IDs para jugador {prow['player_name']} o partido {game_id}"
                )
                continue

            stat_row = {
                "minutes": prow.get("min", 0),
                "goals": prow.get("Performance_Gls", 0),
                "assists": prow.get("Performance_Ast", 0),
                "xg": prow.get("Expected_xG", 0),
                "xa": prow.get("Expected_xAG", 0),
                "yellow": prow.get("Performance_CrdY", 0),
                "red": prow.get("Performance_CrdR", 0),
                "dribbles_completed": prow.get("Take-Ons_Succ", 0),
                "crosses_into_box": prow.get("SCA_GCA", 0),
                "recoveries": prow.get("Performance_Int", 0),
                "clearances": prow.get("Performance_Blocks", 0),
                "losses": max(
                    0,
                    (prow.get("Passes_Att", 0) - prow.get("Passes_Cmp", 0))
                    + (prow.get("Take-Ons_Att", 0) - prow.get("Take-Ons_Succ", 0)),
                ),
                "position": prow.get("pos", "MID"),
            }

            points = calc_points_from_row(stat_row)
            insert_stat_and_points(conn, match_id, player_id, stat_row, points)
            insert_market_history(
                conn,
                player_id,
                calc_market_value([points], stat_row["minutes"], age_years),
            )

        time.sleep(PER_REQUEST_DELAY)

    cur = conn.cursor()
    cur.execute("REFRESH MATERIALIZED VIEW mv_player_points;")
    cur.execute("REFRESH MATERIALIZED VIEW mv_market_values;")
    conn.commit()
    cur.close()
    conn.close()

    logger.info("ETL FBref finalizado")

if __name__ == "__main__":
    main()
