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

CREATE TABLE IF NOT EXISTS app_user (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- teams
CREATE TABLE IF NOT EXISTS user_team (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES app_user(id) UNIQUE, -- cada usuario tiene 1 equipo
  name TEXT NOT NULL,
  formation TEXT, -- e.g. "4-3-3"
  created_at TIMESTAMP DEFAULT NOW()
);

-- team_players: jugadores asignados a equipos
CREATE TABLE IF NOT EXISTS team_player (
  id SERIAL PRIMARY KEY,
  team_id INT REFERENCES user_team(id),
  player_id INT REFERENCES players(id), -- players provisto por ETL
  role TEXT,         -- p.e. "starter", "sub"
  position_label TEXT, -- p.e. "GK", "CB", "RM"
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_id, player_id)
);

-- market listings
CREATE TABLE IF NOT EXISTS market_listing (
  id SERIAL PRIMARY KEY,
  player_id INT REFERENCES players(id) UNIQUE, -- un jugador solo puede haber 1 listing activo
  seller_team_id INT REFERENCES user_team(id),
  reserve_price BIGINT,
  status TEXT DEFAULT 'OPEN', -- OPEN, CLOSED, CANCELLED
  created_at TIMESTAMP DEFAULT NOW()
);

-- bids
CREATE TABLE IF NOT EXISTS bid (
  id SERIAL PRIMARY KEY,
  listing_id INT REFERENCES market_listing(id),
  bidder_team_id INT REFERENCES user_team(id),
  amount BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_player_player ON team_player(player_id);
CREATE INDEX IF NOT EXISTS idx_listing_player ON market_listing(player_id);
CREATE INDEX IF NOT EXISTS idx_bids_listing ON bid(listing_id);