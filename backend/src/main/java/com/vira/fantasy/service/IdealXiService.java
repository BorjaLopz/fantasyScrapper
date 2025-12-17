package com.vira.fantasy.service;

import com.vira.fantasy.engine.PlayerPoints;
import com.vira.fantasy.entity.IdealXiEntity;
import com.vira.fantasy.entity.PlayerEntity;
import com.vira.fantasy.repository.IdealXiRepository;
import com.vira.fantasy.repository.PlayerRepository;
import com.vira.fantasy.repository.PointHistoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class IdealXiService {

        private final PointHistoryRepository pointHistoryRepository;
        private final IdealXiRepository idealRepository;
        private final PlayerRepository playerRepository;

        /**
         * Calcula el 11 ideal con formación 1-4-3-3
         */
        @Transactional
        public void calculateForMatchday(int matchday, String season) {

                // Limpieza por si es recalculo
                idealRepository.deleteBySeasonAndMatchday(season, matchday);

                List<PlayerPoints> all = pointHistoryRepository.findPointsBySeasonAndMatchday(season, matchday);

                if (all.isEmpty()) {
                        log.warn("No hay puntos para 11 ideal en {} jornada {}", season, matchday);
                        return;
                }

                saveTop(all, "GK", 1, season, matchday);
                saveTop(all, "DEF", 4, season, matchday);
                saveTop(all, "MID", 3, season, matchday);
                saveTop(all, "FWD", 3, season, matchday);

                log.info("11 ideal calculado para {} jornada {}", season, matchday);
        }

        private void saveTop(
                        List<PlayerPoints> all,
                        String position,
                        int limit,
                        String season,
                        int matchday) {
                all.stream()
                                .filter(p -> position.equals(p.getPosition()))
                                .sorted(Comparator.comparing(PlayerPoints::getPoints).reversed())
                                .limit(limit)
                                .forEach(p -> {
                                        PlayerEntity player = playerRepository.findById(p.getPlayerId())
                                                        .orElseThrow(() -> new RuntimeException(
                                                                        "Jugador no encontrado: " + p.getPlayerId()));
                                        idealRepository.save(IdealXiEntity.of(
                                                        season, matchday, player, p.getPoints().intValue()));
                                });
        }
}
