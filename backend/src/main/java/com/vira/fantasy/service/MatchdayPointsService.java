package com.vira.fantasy.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.vira.fantasy.engine.FantasyScorer;
import com.vira.fantasy.engine.PlayerStatsView;
import com.vira.fantasy.entity.PointHistoryEntity;
import com.vira.fantasy.repository.StatRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MatchdayPointsService {

    private static final int BATCH_SIZE = 500;

    private final StatRepository statsRepo;
    private final FantasyScorer scorer;

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public void calculateMatchday(
        String season, int matchday
    ) {
        // 1️⃣ Borrar puntos existentes
        em.createQuery("""
            DELETE FROM PointHistoryEntity ph
            WHERE ph.match.id IN (
                SELECT m.id FROM MatchEntity m
                WHERE m.season = :season
                  AND m.matchday = :matchday
            )
        """)
        .setParameter("season", season)
        .setParameter("matchday", matchday)
        .executeUpdate();

        // 2️⃣ Cargar stats
        List<PlayerStatsView> stats =
            statsRepo.findAllForMatchday(season, matchday);

        int i = 0;
        for (PlayerStatsView s : stats) {
            int points = scorer.score(s);

            PointHistoryEntity ph =
                PointHistoryEntity.of(
                    s.getPlayerId(),
                    s.getMatchId(),
                    new BigDecimal(points)
                );

            em.persist(ph);
            i++;

            // 🔥 batch flush controlado
            if (i % BATCH_SIZE == 0) {
                em.flush();
                em.clear();
            }
        }

        em.flush();
        em.clear();
    }
}

