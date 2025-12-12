CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

---------------------------------------------------------
-- TEAMS
---------------------------------------------------------
DROP TABLE IF EXISTS teams CASCADE;

CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    fbref_id TEXT UNIQUE,
    name TEXT NOT NULL,
    league TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_teams_fbref ON teams(fbref_id);

---------------------------------------------------------
-- PLAYERS
---------------------------------------------------------
DROP TABLE IF EXISTS players CASCADE;

CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    fbref_id TEXT UNIQUE,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    team_id INT REFERENCES teams(id),
    age TEXT,                          -- formato FBref "29-305"
    market_value BIGINT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_players_team ON players(team_id);
CREATE INDEX idx_players_fbref_id ON players(fbref_id);
CREATE INDEX idx_players_position ON players(position);

---------------------------------------------------------
-- MATCHES
---------------------------------------------------------
DROP TABLE IF EXISTS matches CASCADE;

CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    fbref_id TEXT UNIQUE,
    season TEXT,
    match_date DATE,
    home_team_id INT REFERENCES teams(id),
    away_team_id INT REFERENCES teams(id),
    home_goals INT,
    away_goals INT,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_teams ON matches(home_team_id, away_team_id);

---------------------------------------------------------
-- STATS (una fila por jugador/partido)
---------------------------------------------------------
DROP TABLE IF EXISTS stats CASCADE;

CREATE TABLE stats (
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

    UNIQUE(player_id, match_id)
);

CREATE INDEX idx_stats_match ON stats(match_id);
CREATE INDEX idx_stats_player ON stats(player_id);

---------------------------------------------------------
-- POINTS HISTORY
---------------------------------------------------------
DROP TABLE IF EXISTS points_history CASCADE;

CREATE TABLE points_history (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id),
    match_id INT REFERENCES matches(id),
    points NUMERIC,
    calculated_at TIMESTAMP,

    UNIQUE(player_id, match_id)
);

CREATE INDEX idx_points_player ON points_history(player_id);

---------------------------------------------------------
-- MARKET HISTORY
---------------------------------------------------------
DROP TABLE IF EXISTS market_history CASCADE;

CREATE TABLE market_history (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id),
    market_value BIGINT,
    calculated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_market_player ON market_history(player_id);

---------------------------------------------------------
-- VIEWS
---------------------------------------------------------

-- PUNTOS ACUMULADOS POR JUGADOR
DROP MATERIALIZED VIEW IF EXISTS view_player_points CASCADE;
CREATE MATERIALIZED VIEW view_player_points AS
SELECT 
    p.id AS player_id,
    p.name,
    p.position,
    SUM(ph.points) AS total_points
FROM players p
LEFT JOIN points_history ph ON ph.player_id = p.id
GROUP BY p.id;

CREATE INDEX idx_view_player_points_id ON view_player_points(player_id);

-- VALOR DE MERCADO ACTUAL
DROP MATERIALIZED VIEW IF EXISTS view_market_values CASCADE;
CREATE MATERIALIZED VIEW view_market_values AS
SELECT
    p.id AS player_id,
    p.name,
    p.market_value
FROM players p;

CREATE INDEX idx_view_market_values_id ON view_market_values(player_id);
