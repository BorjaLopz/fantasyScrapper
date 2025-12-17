import difflib
import logging
import re
import warnings
import psycopg2
from soccerdata import FBref
import pandas as pd
import time

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

warnings.filterwarnings("ignore")
logging.getLogger("soccerdata").setLevel(logging.CRITICAL)
logging.getLogger("urllib3").setLevel(logging.CRITICAL)
logging.getLogger("requests").setLevel(logging.CRITICAL)
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# =========================
# DB
# =========================
def get_conn():
    return psycopg2.connect(**DB_CONFIG)

# =========================
# HELPERS
# =========================
def scalar(val):
    if isinstance(val, pd.Series):
        if len(val) == 0:
            return None
        val = val.iloc[0]
    if val is None or pd.isna(val):
        return None
    return str(val).strip()

def get_stat(s, col, default=0):
    return scalar(s[col]) if col in s else default

def flatten_columns(df):
    df.columns = [f"{a}_{b}".strip("_") for a, b in df.columns]
    return df

def normalize_team_name(name: str) -> str:
    if not name:
        return ""
    name = name.strip()
    for prefix in ["Real ", "Club ", "Atlético "]:
        if name.startswith(prefix):
            name = name[len(prefix):]
    for suffix in [" CF", " FC", " SC"]:
        if name.endswith(suffix):
            name = name[:-len(suffix)]
    return name.strip()

def get_or_create_team(cur, fbref_name: str) -> int:
    normalized_name = normalize_team_name(fbref_name)
    cur.execute("SELECT id, name FROM teams")
    teams = cur.fetchall()
    for team_id, db_name in teams:
        if normalized_name.lower() == normalize_team_name(db_name).lower():
            return team_id
    db_names = [db_name for _, db_name in teams]
    match = difflib.get_close_matches(normalized_name, db_names, n=1, cutoff=0.8)
    if match:
        matched_name = match[0]
        for team_id, db_name in teams:
            if db_name == matched_name:
                return team_id
    cur.execute(
        "INSERT INTO teams (name, league) VALUES (%s, %s) RETURNING id",
        (fbref_name, "LaLiga")
    )
    return cur.fetchone()[0]

def get_or_create_player(cur, external_id, name, position, age, team_id):
    cur.execute("SELECT id FROM players WHERE external_id=%s", (external_id,))
    r = cur.fetchone()
    if r:
        cur.execute(
            """
            UPDATE players
            SET name=%s, position=%s, age=%s, team_id=%s, updated_at=NOW()
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

def parse_matchday(round_value):
    if not round_value or pd.isna(round_value):
        return None
    match = re.search(r"\d+", str(round_value))
    return int(match.group()) if match else None

# =========================
# ETL
# =========================
def etl_laliga():
    print("🚀 ETL LaLiga iniciado")

    fb = FBref(leagues=["ESP-La Liga"], seasons=[SEASON])
    fb._session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                      "AppleWebKit/537.36 (KHTML, like Gecko) "
                      "Chrome/117.0.0.0 Safari/537.36"
    })

    conn = get_conn()
    cur = conn.cursor()

    schedule = fb.read_schedule()
    played = schedule[schedule["match_report"].notna()]

    print(f"📅 Partidos jugados detectados: {len(played)}")

    for _, m in played.iterrows():
        fbref_match_id = m["game_id"]

        cur.execute("SELECT id FROM matches WHERE external_id=%s", (fbref_match_id,))
        if cur.fetchone():
            continue

        home_team = str(m["home_team"])
        away_team = str(m["away_team"])
        home_id = get_or_create_team(cur, home_team)
        away_id = get_or_create_team(cur, away_team)

        round_value = None
        for col in ["round", "matchweek", "week"]:
            if col in m and not pd.isna(m[col]):
                round_value = m[col]
                break
        matchday = parse_matchday(round_value)

        try:
            home_goals, away_goals = map(int, m["score"].split("–"))
        except Exception:
            print(f"⚠ Score inválido {m['score']} → skip")
            continue

        cur.execute(
            """
            INSERT INTO matches (
                external_id, fbref_id, season, competition, date, matchday,
                home_team_id, away_team_id, home_goals, away_goals
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id
            """,
            (
                fbref_match_id,
                fbref_match_id,
                SEASON,
                COMPETITION,
                m["date"],
                matchday,
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
        if df.empty:
            print(f"⚠ Sin stats partido {fbref_match_id}")
            continue

        df = flatten_columns(df)
        df = df.reset_index()

        for _, s in df.iterrows():
            team_name = str(s["team"]).strip()
            team_name_lower = team_name.lower()
            home_team_lower = home_team.lower()
            away_team_lower = away_team.lower()

            if team_name_lower in home_team_lower or home_team_lower in team_name_lower:
                team_id = home_id
            elif team_name_lower in away_team_lower or away_team_lower in team_name_lower:
                team_id = away_id
            else:
                print(f"⚠ Equipo no coincide: {team_name} → skip")
                continue

            external_id = f"{s['player']}_{team_name}".replace(" ", "_").lower()
            age = scalar(s.get("age"))
            player = scalar(s["player"])

            player_id = get_or_create_player(
                cur,
                external_id,
                player,
                scalar(s["pos"]),
                age.split("-")[0] if age else None,
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
                    get_stat(s, "min"),
                    get_stat(s, "Performance_Gls"),
                    get_stat(s, "Performance_Ast"),
                    get_stat(s, "Performance_PK"),
                    get_stat(s, "Performance_PKatt"),
                    get_stat(s, "Performance_Sh"),
                    get_stat(s, "Performance_SoT"),
                    get_stat(s, "Performance_CrdY"),
                    get_stat(s, "Performance_CrdR"),
                    get_stat(s, "Performance_Touches"),
                    get_stat(s, "Performance_Tkl"),
                    get_stat(s, "Performance_Int"),
                    get_stat(s, "Performance_Blocks"),
                    get_stat(s, "Expected_xG"),
                    get_stat(s, "Expected_npxG"),
                    get_stat(s, "Expected_xAG"),
                    get_stat(s, "SCA_SCA"),
                    get_stat(s, "SCA_GCA"),
                    get_stat(s, "Passes_Cmp"),
                    get_stat(s, "Passes_Att"),
                    get_stat(s, "Passes_Cmp%"),
                    get_stat(s, "Passes_PrgP"),
                    get_stat(s, "Carries_Carries"),
                    get_stat(s, "Carries_PrgC"),
                    get_stat(s, "Take-Ons_Att"),
                    get_stat(s, "Take-Ons_Succ"),
                ),
            )

        conn.commit()
        # ⏱ Espera 5 segundos entre partidos para evitar 403
        time.sleep(5)

    cur.close()
    conn.close()
    print("✅ ETL LaLiga finalizado correctamente")


if __name__ == "__main__":
    etl_laliga()
