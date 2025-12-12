CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE,
    league TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    external_id TEXT UNIQUE,
    name TEXT,
    position TEXT,
    age TEXT,
    team_id INT REFERENCES teams(id),
    market_value NUMERIC DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    external_id TEXT UNIQUE,
    season INT,
    competition TEXT,
    date TIMESTAMP,
    home_team_id INT REFERENCES teams(id),
    away_team_id INT REFERENCES teams(id),
    home_goals INT,
    away_goals INT,
    fbref_game_id TEXT,
    last_updated TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stats (
    id SERIAL PRIMARY KEY,
    match_id INT REFERENCES matches(id),
    player_id INT REFERENCES players(id),
    minutes INT,
    goals INT,
    assists INT,
    xg NUMERIC,
    xa NUMERIC,
    yellow INT,
    red INT,
    dribbles_completed INT,
    crosses_into_box INT,
    recoveries INT,
    clearances INT,
    losses INT,
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(match_id, player_id)
);

CREATE TABLE IF NOT EXISTS points_history (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id),
    match_id INT REFERENCES matches(id),
    points NUMERIC,
    calculated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(player_id, match_id)
);

CREATE TABLE IF NOT EXISTS market_history (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id),
    market_value NUMERIC,
    calculated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para acelerar consultas
CREATE INDEX IF NOT EXISTS idx_matches_season ON matches(season);
CREATE INDEX IF NOT EXISTS idx_stats_player_id ON stats(player_id);
CREATE INDEX IF NOT EXISTS idx_stats_match_id ON stats(match_id);
CREATE INDEX IF NOT EXISTS idx_points_player_id ON points_history(player_id);
CREATE INDEX IF NOT EXISTS idx_points_match_id ON points_history(match_id);
CREATE INDEX IF NOT EXISTS idx_market_player_id ON market_history(player_id);
CREATE INDEX IF NOT EXISTS idx_market_calculated_at ON market_history(calculated_at);

-- Vistas materializadas
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_player_points AS
SELECT
    p.id AS player_id,
    p.name AS player_name,
    m.season,
    SUM(ph.points) AS total_points
FROM points_history ph
JOIN players p ON ph.player_id = p.id
JOIN matches m ON ph.match_id = m.id
GROUP BY p.id, p.name, m.season;

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_player_market AS
SELECT
    p.id AS player_id,
    p.name AS player_name,
    mh.market_value,
    mh.calculated_at
FROM market_history mh
JOIN players p ON mh.player_id = p.id
WHERE mh.calculated_at = (
    SELECT MAX(calculated_at) FROM market_history mh2 WHERE mh2.player_id = p.id
);
