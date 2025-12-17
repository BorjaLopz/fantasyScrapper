package com.vira.fantasy.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vira.fantasy.entity.PointHistoryEntity;

import jakarta.transaction.Transactional;

@Repository
public interface PointHistoryRepository
                extends JpaRepository<PointHistoryEntity, UUID> {

        /*
         * =========================
         * BATCH / CÁLCULO JORNADA
         * =========================
         */

        /**
         * Borra los puntos de una jornada concreta (recalcular seguro)
         */
        @Modifying
        @Transactional
        @Query("""
                            DELETE FROM PointHistoryEntity ph
                            WHERE ph.match.id IN (
                                SELECT m.id
                                FROM MatchEntity m
                                WHERE m.season = :season
                                  AND m.matchday = :matchday
                            )
                        """)
        void deleteForMatchday(
                        @Param("season") String season,
                        @Param("matchday") int matchday);

        /**
         * Comprueba si una jornada ya tiene puntos calculados
         */
        @Query("""
                            SELECT COUNT(ph) > 0
                            FROM PointHistoryEntity ph
                            WHERE ph.match.id IN (
                                SELECT m.id
                                FROM MatchEntity m
                                WHERE m.season = :season
                                  AND m.matchday = :matchday
                            )
                        """)
        boolean existsForMatchday(
                        @Param("season") String season,
                        @Param("matchday") int matchday);

        /*
         * =========================
         * CONSULTAS DE USO FRECUENTE
         * =========================
         */

        /**
         * Puntos de un jugador en una temporada
         */
        @Query("""
                            SELECT COALESCE(SUM(ph.points), 0)
                            FROM PointHistoryEntity ph
                            WHERE ph.player.id = :playerId
                              AND ph.match.season = :season
                        """)
        BigDecimal sumPointsForPlayerSeason(
                        @Param("playerId") Long playerId,
                        @Param("season") String season);

        /**
         * Puntos de un jugador en una jornada
         */
        @Query("""
                            SELECT ph.points
                            FROM PointHistoryEntity ph
                            WHERE ph.player.id = :playerId
                              AND ph.match.season = :season
                              AND ph.match.matchday = :matchday
                        """)
        Optional<BigDecimal> findPlayerPointsForMatchday(
                        @Param("playerId") Long playerId,
                        @Param("season") String season,
                        @Param("matchday") int matchday);

        /**
         * Ranking fantasy por temporada
         */
        @Query("""
                            SELECT ph.player.id, SUM(ph.points)
                            FROM PointHistoryEntity ph
                            WHERE ph.match.season = :season
                            GROUP BY ph.player.id
                            ORDER BY SUM(ph.points) DESC
                        """)
        List<Object[]> rankingForSeason(
                        @Param("season") String season);

        /**
         * Ranking fantasy por jornada
         */
        @Query("""
                            SELECT ph.player.id, ph.points
                            FROM PointHistoryEntity ph
                            WHERE ph.match.season = :season
                              AND ph.match.matchday = :matchday
                            ORDER BY ph.points DESC
                        """)
        List<Object[]> rankingForMatchday(
                        @Param("season") String season,
                        @Param("matchday") int matchday);

        @Query("SELECT COUNT(ph) FROM PointHistoryEntity ph")
        long countAll();

        @Modifying
        @Query("""
                            DELETE FROM PointHistoryEntity ph
                            WHERE ph.match.id IN (
                                SELECT m.id FROM MatchEntity m
                                WHERE m.season = :season AND m.matchday = :matchday
                            )
                        """)
        void deleteBySeasonAndMatchday(
                        @Param("season") String season,
                        @Param("matchday") int matchday);
}
