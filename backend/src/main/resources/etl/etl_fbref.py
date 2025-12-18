import asyncio
import random
import time
import re
import logging
import warnings
from pathlib import Path

import pandas as pd
import psycopg2
from soccerdata import FBref
from tenacity import retry, stop_after_attempt, wait_exponential_jitter

# =====================================================
# CONFIG
# =====================================================
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

MAX_WORKERS = 2  # 🔥 no subir >3 (anti-ban)
CACHE_DIR = Path("./fbref_cache")
CACHE_DIR.mkdir(exist_ok=True)

warnings.filterwarnings("ignore")
logging.getLogger("soccerdata").setLevel(logging.CRITICAL)


# =====================================================
# DB
# =====================================================
def get_conn():
    return psycopg2.connect(**DB_CONFIG)


# =====================================================
# HELPERS
# =====================================================
def scalar(v):
    if isinstance(v, pd.Series):
        v = v.iloc[0] if len(v) else None
    return None if v is None or pd.isna(v) else str(v).strip()


def get_stat(s, col, default=0):
    if col not in s or pd.isna(s[col]):
        return default
    return s[col]


def flatten_columns(df):
    df.columns = [f"{a}_{b}".strip("_") for a, b in df.columns]
    return df


def parse_matchday(v):
    if not v or pd.isna(v):
        return None
    m = re.search(r"\d+", str(v))
    return int(m.group()) if m else None


def smart_sleep():
    time.sleep(random.uniform(6, 18))


# =====================================================
# FBREF SESSION
# =====================================================
def get_fbref():
    fb = FBref(leagues=["ESP-La Liga"], seasons=[SEASON])
    fb._session.headers.update(
        {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
            "Referer": "https://fbref.com/",
            "DNT": "1",
            "Connection": "keep-alive",
        }
    )
    return fb


# =====================================================
# CACHE
# =====================================================
def cache_path(match_id):
    return CACHE_DIR / f"{match_id}.parquet"


def load_cache(match_id):
    f = cache_path(match_id)
    return pd.read_parquet(f) if f.exists() else None


def save_cache(match_id, df):
    df.to_parquet(cache_path(match_id))


# =====================================================
# RETRY SAFE FETCH
# =====================================================
@retry(
    stop=stop_after_attempt(4),
    wait=wait_exponential_jitter(initial=5, max=90),
)
def fetch_stats(fb, match_id):
    return fb.read_player_match_stats(match_id=match_id, stat_type="summary")


# =====================================================
# DB UPSERT HELPERS
# =====================================================
def normalize_team(name):
    if not name:
        return ""
    for p in ["Real ", "Club ", "Atlético "]:
        if name.startswith(p):
            name = name[len(p) :]
    for s in [" CF", " FC", " SC"]:
        if name.endswith(s):
            name = name[: -len(s)]
    return name.strip()


def get_or_create_team(cur, name):
    cur.execute("SELECT id, name FROM teams")
    for i, n in cur.fetchall():
        if normalize_team(n).lower() == normalize_team(name).lower():
            return i
    cur.execute(
        "INSERT INTO teams (name, league) VALUES (%s,%s) RETURNING id", (name, LEAGUE)
    )
    return cur.fetchone()[0]


def get_or_create_player(cur, ext_id, name, pos, age, team_id):
    cur.execute("SELECT id FROM players WHERE external_id=%s", (ext_id,))
    r = cur.fetchone()
    if r:
        cur.execute(
            """
            UPDATE players
            SET name=%s, position=%s, age=%s, team_id=%s, updated_at=NOW()
            WHERE id=%s
        """,
            (name, pos, age, team_id, r[0]),
        )
        return r[0]
    cur.execute(
        """
        INSERT INTO players (external_id,name,position,age,team_id)
        VALUES (%s,%s,%s,%s,%s)
        RETURNING id
    """,
        (ext_id, name, pos, age, team_id),
    )
    return cur.fetchone()[0]


# =====================================================
# ASYNC WORKER
# =====================================================
async def match_worker(queue, fb):
    conn = get_conn()
    cur = conn.cursor()

    while True:
        m = await queue.get()
        if m is None:
            break

        try:
            fbref_id = m["game_id"]

            cur.execute("SELECT 1 FROM matches WHERE external_id=%s", (fbref_id,))
            if cur.fetchone():
                queue.task_done()
                continue

            home, away = m["home_team"], m["away_team"]
            home_id = get_or_create_team(cur, home)
            away_id = get_or_create_team(cur, away)

            matchday = parse_matchday(
                next(
                    (
                        m[c]
                        for c in ["round", "week", "matchweek"]
                        if c in m and not pd.isna(m[c])
                    ),
                    None,
                )
            )

            hg, ag = map(int, m["score"].split("–"))

            cur.execute(
                """
                INSERT INTO matches (
                    external_id, fbref_id, season, competition,
                    date, matchday,
                    home_team_id, away_team_id,
                    home_goals, away_goals
                )
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                RETURNING id
            """,
                (
                    fbref_id,
                    fbref_id,
                    SEASON,
                    COMPETITION,
                    m["date"],
                    matchday,
                    home_id,
                    away_id,
                    hg,
                    ag,
                ),
            )

            match_id = cur.fetchone()[0]
            print(f"⚽ {home} vs {away}")

            df = load_cache(fbref_id)
            if df is None:
                df = fetch_stats(fb, fbref_id)
                df = flatten_columns(df).reset_index()
                save_cache(fbref_id, df)

            for _, s in df.iterrows():
                team_name = str(s["team"]).strip()
                team_name_lower = team_name.lower()
                if home.lower() in team_name_lower or team_name_lower in home.lower():
                    team_id = home_id
                elif away.lower() in team_name_lower or team_name_lower in away.lower():
                    team_id = away_id
                else:
                    continue

                ext_id = f"{s['player']}_{team_name}".lower().replace(" ", "_")
                age = scalar(s.get("age"))

                player_id = get_or_create_player(
                    cur,
                    ext_id,
                    scalar(s["player"]),
                    scalar(s["pos"]),
                    age.split("-")[0] if age else None,
                    team_id,
                )

                # ===== INSERT TODOS LOS STATS =====
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
            smart_sleep()

        except Exception as e:
            conn.rollback()
            print(f"❌ Error partido {m['game_id']}: {e}")

        queue.task_done()

    cur.close()
    conn.close()


# =====================================================
# MAIN
# =====================================================
async def etl_laliga_async():
    print("🚀 ETL LaLiga Async iniciado")

    fb = get_fbref()
    schedule = fb.read_schedule()
    played = schedule[schedule["match_report"].notna()]

    queue = asyncio.Queue()

    for _, m in played.iterrows():
        await queue.put(m)

    workers = [asyncio.create_task(match_worker(queue, fb)) for _ in range(MAX_WORKERS)]

    await queue.join()

    for _ in workers:
        await queue.put(None)

    await asyncio.gather(*workers)
    print("✅ ETL Async finalizado sin bloqueos")


# =====================================================
# ENTRYPOINT
# =====================================================
if __name__ == "__main__":
    asyncio.run(etl_laliga_async())
