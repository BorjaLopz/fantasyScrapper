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

CREATE TABLE market_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id),
    market_value NUMERIC,
    calculated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE app_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    display_name TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_team (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES app_user(id) UNIQUE,
    name TEXT NOT NULL,
    formation TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE team_player (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES user_team(id),
    player_id UUID REFERENCES players(id),
    role TEXT,
    position_label TEXT,
    added_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(team_id, player_id)
);

CREATE TABLE market_listing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id) UNIQUE,
    seller_team_id UUID REFERENCES user_team(id),
    reserve_price BIGINT,
    status TEXT DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bid (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES market_listing(id),
    bidder_team_id UUID REFERENCES user_team(id),
    amount BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE etl_run (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMP,
    status TEXT NOT NULL,
    message TEXT
);
