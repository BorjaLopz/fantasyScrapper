package com.vira.fantasy.engine;

import java.util.UUID;

public interface PlayerStatsView {

    UUID getPlayerId();
    UUID getMatchId();
    String getSeason();
    Integer getMatchday();

    String getPosition();
    Integer getMinutes();

    Integer getGls();
    Integer getAst();
    Integer getSh();
    Integer getSot();

    Integer getCrdy();
    Integer getCrdr();

    Integer getTkl();
    Integer getInterceptions();
    Integer getBlocks();

    Integer getPassesCmp();
    Double getPassesCmpPct();
    Integer getPrgp();

    Integer getPrgc();
    Integer getTakeonsSucc();

    Double getXg();
    Double getNpxg();
    Double getXag();

    Integer getSca();
    Integer getGca();
}
