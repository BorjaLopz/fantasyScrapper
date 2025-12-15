import psycopg2
from soccerdata import FBref
import pandas as pd

# =========================
# CONFIG
# =========================
DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "dbname": "fantasydb",
    "user": "fantasy",
    "password": "fantasy123",
}

LEAGUE = "LaLiga"
COMPETITION = "LaLiga"
SEASON = "2025-2026"


# =========================
# DB
# =========================
def get_conn():
    return psycopg2.connect(**DB_CONFIG)


# =========================
# HELPERS
# =========================
def parse_age(age):
    if isinstance(age, pd.Series):
        if len(age) > 0:
            age = age.iloc[0]
        else:
            age = None
    if age is not None and not pd.isna(age):
        age = str(age).strip()

    return age


def get_or_create_team(cur, name):
    cur.execute("SELECT id FROM teams WHERE name=%s", (name,))
    r = cur.fetchone()
    if r:
        return r[0]

    cur.execute(
        """
        INSERT INTO teams (name, league)
        VALUES (%s,%s)
        RETURNING id
        """,
        (name, LEAGUE),
    )
    return cur.fetchone()[0]


def get_or_create_player(cur, external_id, name, position, age, team_id):
    cur.execute("SELECT id FROM players WHERE external_id=%s", (external_id,))
    r = cur.fetchone()

    if r:
        cur.execute(
            """
            UPDATE players
            SET name=%s,
                position=%s,
                age=%s,
                team_id=%s,
                updated_at=NOW()
            WHERE id=%s
            """,
            (name, position, age, team_id, r[0]),
        )
        return r[0]

    cur.execute(
        """
        INSERT INTO players (external_id, name, position, age, team_id)
        VALUES (%s,%s,%s,%s,%s)
        RETURNING id
        """,
        (external_id, name, position, age, team_id),
    )
    return cur.fetchone()[0]


# =========================
# ETL
# =========================
def etl_laliga():
    print("🚀 ETL LaLiga iniciado")

    fb = FBref(leagues=["ESP-La Liga"], seasons=[SEASON])
    conn = get_conn()
    cur = conn.cursor()

    schedule = fb.read_schedule()
    played = schedule[schedule["match_report"].notna()]

    print(f"📅 Partidos jugados detectados: {len(played)}")

    for _, m in played.iterrows():
        fbref_match_id = m["game_id"]

        # Match ya procesado
        cur.execute("SELECT id FROM matches WHERE external_id=%s", (fbref_match_id,))
        r = cur.fetchone()
        if r:
            continue

        home_team = str(m["home_team"]).strip()
        away_team = str(m["away_team"]).strip()

        home_id = get_or_create_team(cur, home_team)
        away_id = get_or_create_team(cur, away_team)

        try:
            home_goals, away_goals = map(int, m["score"].split("–"))
        except Exception:
            print(f"⚠ Score inválido {m['score']} → skip")
            continue

        cur.execute(
            """
            INSERT INTO matches (
                external_id, fbref_id, season, competition, date,
                home_team_id, away_team_id, home_goals, away_goals
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id
            """,
            (
                fbref_match_id,
                fbref_match_id,
                SEASON,
                COMPETITION,
                m["date"],
                home_id,
                away_id,
                home_goals,
                away_goals,
            ),
        )
        match_id = cur.fetchone()[0]

        print(f"⚽ {home_team} vs {away_team}")

        # =========================
        # STATS
        # =========================
        df = fb.read_player_match_stats(match_id=fbref_match_id, stat_type="summary")
        print(f"   ▶ Stats jugadores: {len(df)} registros")

        if df.empty:
            print(f"⚠ Sin stats partido {fbref_match_id}")
            continue

        df = df.reset_index()

        for _, s in df.iterrows():
            # team_name = str(s["team"]).strip()
            if isinstance(s["team"], pd.Series):
                team_name = s["team"].iloc[0]
            else:
                team_name = s["team"]

            team_name = str(team_name).strip()

            if team_name == home_team:
                team_id = home_id
            elif team_name == away_team:
                team_id = away_id
            else:
                print(f"⚠ Equipo no coincide: {team_name} → skip")
                continue

            external_id = f"{s['player']}_{team_name}".replace(" ", "_").lower()
            age = parse_age(s.get("age"))
            print(f"    - Procesando jugador: {s['player']} (Edad: {age})")
            player_id = get_or_create_player(
                cur,
                external_id,  # external_id
                s["player"],  # nombre real
                s["pos"],  # posición
                age,
                team_id,
            )

            cur.execute(
                """
                INSERT INTO stats (
                    match_id, player_id, minutes,
                    gls, ast, pk, pkatt, sh, sot,
                    crdy, crdr, touches, tkl, interceptions, blocks,
                    xg, npxg, xag,
                    sca, gca,
                    passes_cmp, passes_att, passes_cmp_pct, prgp,
                    carries, prgc,
                    takeons_att, takeons_succ
                )
                VALUES (%s,%s,%s,
                        %s,%s,%s,%s,%s,%s,
                        %s,%s,%s,%s,%s,%s,
                        %s,%s,%s,
                        %s,%s,
                        %s,%s,%s,%s,
                        %s,%s,
                        %s,%s)
                ON CONFLICT (player_id, match_id) DO NOTHING
                """,
                (
                    match_id,
                    player_id,
                    s["min"],
                    s["Performance_Gls"],
                    s["Performance_Ast"],
                    s["Performance_PK"],
                    s["Performance_PKatt"],
                    s["Performance_Sh"],
                    s["Performance_SoT"],
                    s["Performance_CrdY"],
                    s["Performance_CrdR"],
                    s["Performance_Touches"],
                    s["Performance_Tkl"],
                    s["Performance_Int"],
                    s["Performance_Blocks"],
                    s["Expected_xG"],
                    s["Expected_npxG"],
                    s["Expected_xAG"],
                    s["SCA_SCA"],
                    s["SCA_GCA"],
                    s["Passes_Cmp"],
                    s["Passes_Att"],
                    s["Passes_Cmp%"],
                    s["Passes_PrgP"],
                    s["Carries_Carries"],
                    s["Carries_PrgC"],
                    s["Take-Ons_Att"],
                    s["Take-Ons_Succ"],
                ),
            )

        conn.commit()

    cur.close()
    conn.close()
    print("✅ ETL LaLiga finalizado correctamente")


if __name__ == "__main__":
    etl_laliga()
