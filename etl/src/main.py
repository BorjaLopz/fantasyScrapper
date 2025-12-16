import difflib
import logging
import warnings
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

# 1️⃣ Silenciar warnings de Python (UserWarning, FutureWarning, etc.)
warnings.filterwarnings("ignore")

# 2️⃣ Silenciar completamente logs de soccerdata
logging.getLogger("soccerdata").setLevel(logging.CRITICAL)

# 3️⃣ Silenciar logs de requests/urllib3 (muy común en soccerdata)
logging.getLogger("urllib3").setLevel(logging.CRITICAL)
logging.getLogger("requests").setLevel(logging.CRITICAL)

# 4️⃣ Configurar solo TUS logs
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)


# =========================
# DB
# =========================
def get_conn():
    return psycopg2.connect(**DB_CONFIG)


# =========================
# HELPERS
# =========================
def scalar(val):
    """
    Convierte valores de pandas (Series / NaN) a tipos Python puros.
    """
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
    df.columns = [
        f"{a}_{b}".strip("_")
        for a, b in df.columns
    ]
    return df

def normalize_team_name(name: str) -> str:
    """
    Normaliza nombres para comparaciones: quita prefijos y sufijos, 
    pero no se guarda en la DB.
    """
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
    """
    Devuelve el team_id de la DB. Si no existe, intenta match aproximado y si no, lo crea.
    El nombre guardado en la DB será el nombre completo oficial de FBref.
    """
    normalized_name = normalize_team_name(fbref_name)

    # 1️⃣ Buscar match exacto en DB
    cur.execute("SELECT id, name FROM teams")
    teams = cur.fetchall()
    
    for team_id, db_name in teams:
        if normalized_name.lower() == normalize_team_name(db_name).lower():
            return team_id

    # 2️⃣ Match aproximado (fuzzy)
    db_names = [db_name for _, db_name in teams]
    match = difflib.get_close_matches(normalized_name, db_names, n=1, cutoff=0.8)
    if match:
        matched_name = match[0]
        for team_id, db_name in teams:
            if db_name == matched_name:
                return team_id

    # 3️⃣ Si no existe, crear nuevo con el nombre completo oficial
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

        home_team = str(m["home_team"])
        away_team = str(m["away_team"])

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
        # df = fb.read_player_match_stats(match_id=fbref_match_id, stat_type="summary")
        # print(f"   ▶ Stats jugadores: {len(df)} registros")

        # if df.empty:
        #     print(f"⚠ Sin stats partido {fbref_match_id}")
        #     continue

        # df = pd.concat(dfs, axis=1)
        # df = df.loc[:, ~df.columns.duplicated()]
        # df = df.reset_index()

        dfs = []

        d = fb.read_player_match_stats(match_id=fbref_match_id, stat_type="summary")
        dfs.append(flatten_columns(d))

        if not dfs:
            continue

        df = pd.concat(dfs, axis=1)
        df = df.loc[:, ~df.columns.duplicated()]
        df = df.reset_index()

        for _, s in df.iterrows():
            if isinstance(s["team"], pd.Series):
                team_name = s["team"].iloc[0]
            else:
                team_name = s["team"]

            team_name = str(team_name).strip()

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
            # print(f"    - Procesando jugador: {player} (Edad: {age})")
            player_id = get_or_create_player(
                cur,
                external_id,  # external_id
                player,  # nombre real
                scalar(s["pos"]),  # posición
                age.split("-")[0],
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
                    # SUMMARY
                    get_stat(s, "Performance_Gls"),
                    get_stat(s, "Performance_Ast"),
                    get_stat(s, "Performance_PK"),
                    get_stat(s, "Performance_PKatt"),
                    get_stat(s, "Performance_Sh"),
                    get_stat(s, "Performance_SoT"),
                    # MISC
                    get_stat(s, "Performance_CrdY"),
                    get_stat(s, "Performance_CrdR"),
                    # POSSESSION / DEFENSE
                    get_stat(s, "Performance_Touches"),
                    get_stat(s, "Performance_Tkl"),
                    get_stat(s, "Performance_Int"),
                    get_stat(s, "Performance_Blocks"),
                    # EXPECTED
                    get_stat(s, "Expected_xG"),
                    get_stat(s, "Expected_npxG"),
                    get_stat(s, "Expected_xAG"),
                    # SCA
                    get_stat(s, "SCA_SCA"),
                    get_stat(s, "SCA_GCA"),
                    # PASSING
                    get_stat(s, "Passes_Cmp"),
                    get_stat(s, "Passes_Att"),
                    get_stat(s, "Passes_Cmp%"),
                    get_stat(s, "Passes_PrgP"),
                    # CARRYING
                    get_stat(s, "Carries_Carries"),
                    get_stat(s, "Carries_PrgC"),
                    # TAKE-ONS
                    get_stat(s, "Take-Ons_Att"),
                    get_stat(s, "Take-Ons_Succ"),
                ),
            )

        conn.commit()

    cur.close()
    conn.close()
    print("✅ ETL LaLiga finalizado correctamente")


if __name__ == "__main__":
    etl_laliga()
