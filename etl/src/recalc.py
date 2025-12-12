import psycopg2
from datetime import datetime

DB_HOST = "localhost"
DB_PORT = 5432
DB_USER = "fantasy"
DB_PASS = "fantasy123"
DB_NAME = "fantasydb"

POSITION_FACTORS = {
    'DEF': {'goal': 6, 'assist': 3, 'yellow': -1, 'red': -3},
    'MID': {'goal': 5, 'assist': 3, 'yellow': -1, 'red': -3},
    'FWD': {'goal': 4, 'assist': 3, 'yellow': -1, 'red': -3},
    'GK':  {'goal': 6, 'assist': 3, 'yellow': -1, 'red': -3, 'clean_sheet': 5}
}

def calc_points(s, pos):
    """Calcula puntos usando SOLO las columnas reales de stats."""
    f = POSITION_FACTORS.get(pos, POSITION_FACTORS['MID'])
    points = 0

    # Acciones ofensivas
    points += s["goals"] * f["goal"]
    points += s["assists"] * f["assist"]

    # Expulsiones
    points += s["yellow"] * f["yellow"]
    points += s["red"] * f["red"]

    # Bonus
    if pos == "FWD" and s["goals"] >= 3:
        points += 3
    if pos == "MID" and s["assists"] >= 2:
        points += 2

    # Métricas avanzadas reales desde ETL
    points += s["dribbles_completed"] * 0.2
    points += s["crosses_into_box"] * 0.3
    points += s["recoveries"] * 0.1
    points += s["clearances"] * (0.2 if pos in ["DEF", "GK"] else 0.05)

    # Pérdidas de posesión ya calculadas en ETL
    points -= s["losses"] * 0.05

    # Penalización por minutos jugados
    minutes = s["minutes"]
    points *= min(1, minutes / 90)

    return round(max(points, 0), 2)


def calc_market_value(points_list, age):
    """Algoritmo de valor de mercado estable y proporcional al rendimiento."""
    last5 = points_list[-5:] if len(points_list) >= 5 else points_list
    avg_last5 = sum(last5) / len(last5) if last5 else 0

    # Edad "AA-DDD"
    try:
        yrs, days = age.split("-")
        age_years = int(yrs) + int(days) / 365
    except:
        age_years = 27

    age_factor = 1.2 if age_years <= 25 else (1.0 if age_years <= 30 else 0.9)

    base = 500_000
    value = base * (1 + avg_last5 / 10) * age_factor

    return int(round(value / 1000) * 1000)


def main():
    conn = psycopg2.connect(
        host=DB_HOST, port=DB_PORT, user=DB_USER, password=DB_PASS, dbname=DB_NAME
    )
    cur = conn.cursor()

    # 1️⃣ Extraer stats + datos de jugador
    cur.execute("""
        SELECT 
            s.id, s.player_id, s.match_id, s.minutes, s.goals, s.assists, 
            s.xg, s.xa, s.yellow, s.red, 
            s.dribbles_completed, s.crosses_into_box,
            s.recoveries, s.clearances, s.losses,
            p.position, p.age
        FROM stats s
        JOIN players p ON s.player_id = p.id;
    """)
    rows = cur.fetchall()

    points_by_player = {}

    # 2️⃣ Recalcular puntos e insertar en histórico
    for (sid, player_id, match_id, minutes, goals, assists, xg, xa, yellow, red,
         drib, cross, rec, clear, losses, position, age) in rows:

        stat = {
            "minutes": minutes,
            "goals": goals,
            "assists": assists,
            "yellow": yellow,
            "red": red,
            "dribbles_completed": drib,
            "crosses_into_box": cross,
            "recoveries": rec,
            "clearances": clear,
            "losses": losses
        }

        pts = calc_points(stat, position)

        if player_id not in points_by_player:
            points_by_player[player_id] = []
        points_by_player[player_id].append(pts)

        cur.execute("""
            INSERT INTO points_history (player_id, match_id, points, calculated_at)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (player_id, match_id) DO UPDATE
            SET points = EXCLUDED.points, calculated_at = EXCLUDED.calculated_at;
        """, (player_id, match_id, pts, datetime.utcnow()))

    conn.commit()

    # 3️⃣ Recalcular market value
    for player_id, pts_list in points_by_player.items():

        cur.execute("SELECT age FROM players WHERE id=%s;", (player_id,))
        age = cur.fetchone()[0]

        value = calc_market_value(pts_list, age)

        cur.execute("""
            UPDATE players 
            SET market_value=%s, updated_at=%s
            WHERE id=%s;
        """, (value, datetime.utcnow(), player_id))

        cur.execute("""
            INSERT INTO market_history (player_id, market_value, calculated_at)
            VALUES (%s, %s, %s);
        """, (player_id, value, datetime.utcnow()))

    conn.commit()

    # 4️⃣ Refrescar vistas materializadas
    try:
        cur.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY view_player_points;")
        cur.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY view_market_values;")
    except:
        print("⚠ Las vistas materializadas no son CONCURRENTES. Usando refresh normal.")
        cur.execute("REFRESH MATERIALIZED VIEW view_player_points;")
        cur.execute("REFRESH MATERIALIZED VIEW view_market_values;")

    conn.commit()
    cur.close()
    conn.close()

    print("✔ Recalc completado con éxito.")


if __name__ == "__main__":
    main()
