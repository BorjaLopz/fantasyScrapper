package com.vira.fantasy.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.vira.fantasy.engine.PlayerPoints;
import com.vira.fantasy.entity.MvpMatchdayEntity;
import com.vira.fantasy.entity.PlayerEntity;
import com.vira.fantasy.repository.MvpMatchdayRepository;
import com.vira.fantasy.repository.PlayerRepository;
import com.vira.fantasy.repository.PointHistoryRepository;
import com.vira.fantasy.repository.StatRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MvpMatchdayService {

        private final PointHistoryRepository pointHistoryRepository;
        private final MvpMatchdayRepository mvpRepository;
        private final PlayerRepository playerRepository;
        private final StatRepository statRepository;

        private final Map<String, Integer> POSITION_PRIORITY = Map.of(
                        "GK", 1,
                        "DEF", 2,
                        "MID", 3,
                        "FWD", 4);

        /**
         * Calcula MVP global + MVP por posición
         */
        @Transactional(propagation = Propagation.REQUIRES_NEW)
        public void calculateForMatchday(int matchday, String season) {
                mvpRepository.deleteBySeasonAndMatchday(season, matchday);

                List<PlayerPoints> all = pointHistoryRepository.findPointsBySeasonAndMatchday(season, matchday);

                if (all.isEmpty()) {
                        log.warn("No hay datos para MVP {} jornada {}", season, matchday);
                        return;
                }

                PlayerPoints winner = all.stream()
                                .sorted(
                                                Comparator
                                                                // 1️⃣ Más puntos
                                                                .comparing(PlayerPoints::getPoints).reversed()

                                                                // 2️⃣ Prioridad por posición
                                                                .thenComparing(p -> POSITION_PRIORITY
                                                                                .getOrDefault(p.getPosition(), 99))

                                                                // 3️⃣ UUID para desempate determinístico
                                                                .thenComparing(PlayerPoints::getPlayerId))
                                .findFirst()
                                .orElseThrow();

                PlayerEntity player = playerRepository.findById(winner.getPlayerId())
                                .orElseThrow(() -> new IllegalStateException(
                                                "Jugador no encontrado: " + winner.getPlayerId()));

                mvpRepository.save(
                                MvpMatchdayEntity.of(
                                                season,
                                                matchday,
                                                player,
                                                winner.getPosition(),
                                                winner.getPoints().intValue()));

                log.info("🏆 MVP {} J{} → {} ({} pts)",
                                season, matchday, winner.getPlayerName(), winner.getPoints());
        }

        public void calculateForSeason(String season) {
                List<Integer> matchdays = statRepository.findDistinctMatchdaysBySeason(season);

                if (matchdays.isEmpty()) {
                        log.warn("No hay jornadas para la temporada {}", season);
                        return;
                }

                matchdays.stream()
                                .sorted()
                                .forEach(matchday -> {
                                        try {
                                                calculateForMatchday(matchday, season);
                                        } catch (Exception e) {
                                                log.error("Error en jornada {}, se continúa", matchday, e);
                                        }
                                });
        }
}
