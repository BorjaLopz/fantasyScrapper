package com.vira.fantasy.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vira.fantasy.engine.PlayerStatsView;
import com.vira.fantasy.entity.StatEntity;

@Repository
public interface StatRepository extends JpaRepository<StatEntity, UUID> {

  @Query("""
        SELECT
          s.player.id as playerId,
          s.match.id as matchId,
          m.season as season,
          m.matchday as matchday,
          p.position as position,
          s.minutes as minutes,
          s.gls as gls,
          s.ast as ast,
          s.sh as sh,
          s.sot as sot,
          s.crdy as crdy,
          s.crdr as crdr,
          s.tkl as tkl,
          s.interceptions as interceptions,
          s.blocks as blocks,
          s.passesCmp as passesCmp,
          s.passesCmpPct as passesCmpPct,
          s.prgp as prgp,
          s.prgc as prgc,
          s.takeonsSucc as takeonsSucc,
          s.xg as xg,
          s.npxg as npxg,
          s.xag as xag,
          s.sca as sca,
          s.gca as gca
        FROM StatEntity s
        JOIN s.player p
        JOIN s.match m
        WHERE m.season = :season
          AND m.matchday = :matchday
      """)
  List<PlayerStatsView> findAllForMatchday(
      String season, int matchday);

  /**
   * Devuelve todas las stats de jugadores para una temporada y jornada concreta
   */
  @Query("SELECT s FROM StatEntity s WHERE s.match.season = :season AND s.match.matchday = :matchday")
  List<StatEntity> findAllBySeasonAndMatchday(
      @Param("season") String season,
      @Param("matchday") Integer matchday);
}