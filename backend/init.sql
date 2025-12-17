CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE,
    league TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT UNIQUE,
    name TEXT,
    position TEXT,
    age TEXT,
    team_id UUID REFERENCES teams(id),
    market_value NUMERIC DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT UNIQUE,
    season TEXT,
    competition TEXT,
    date TIMESTAMP,
    home_team_id UUID REFERENCES teams(id),
    away_team_id UUID REFERENCES teams(id),
    home_goals INT,
    away_goals INT,
    fbref_id TEXT,
    last_updated TIMESTAMP DEFAULT NOW(),
    matchday INT
);

CREATE TABLE stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id),
    player_id UUID REFERENCES players(id),
    minutes INT,
    gls INT,
    ast INT,
    pk INT,
    pkatt INT,
    sh INT,
    sot INT,
    crdy INT,
    crdr INT,
    touches INT,
    tkl INT,
    interceptions INT,
    blocks INT,
    xg NUMERIC,
    npxg NUMERIC,
    xag NUMERIC,
    sca INT,
    gca INT,
    passes_cmp INT,
    passes_att INT,
    passes_cmp_pct NUMERIC,
    prgp INT,
    carries INT,
    prgc INT,
    takeons_att INT,
    takeons_succ INT,
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(player_id, match_id)
);

CREATE TABLE points_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id),
    match_id UUID REFERENCES matches(id),
    points NUMERIC,
    calculated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(player_id, match_id)
);

CREATE TABLE app_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    display_name TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE etl_run (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMP,
    status TEXT NOT NULL,
    message TEXT
);

CREATE TABLE mvp_matchday (
    id UUID PRIMARY KEY,
    season TEXT NOT NULL,
    matchday INT NOT NULL,
    player_id UUID REFERENCES players(id),
    position TEXT,
    points INT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(season, matchday, player_id)
);

CREATE TABLE ideal_xi (
    id UUID PRIMARY KEY,
    season TEXT NOT NULL,
    matchday INT NOT NULL,
    player_id UUID REFERENCES players(id),
    position TEXT,
    points INT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(season, matchday, player_id)
);