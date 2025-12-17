package com.vira.fantasy.service;

import com.vira.fantasy.engine.PlayerPoints;
import com.vira.fantasy.entity.MvpMatchdayEntity;
import com.vira.fantasy.entity.PlayerEntity;
import com.vira.fantasy.repository.MvpMatchdayRepository;
import com.vira.fantasy.repository.PlayerRepository;
import com.vira.fantasy.repository.PointHistoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MvpMatchdayService {

        private final PointHistoryRepository pointHistoryRepository;
        private final MvpMatchdayRepository mvpRepository;
        private final PlayerRepository playerRepository;

        /**
         * Calcula MVP global + MVP por posición
         */
        @Transactional
        public void calculateForMatchday(int matchday, String season) {

                // Limpieza por si es recalculo
                mvpRepository.deleteBySeasonAndMatchday(season, matchday);

                List<PlayerPoints> all = pointHistoryRepository.findPointsBySeasonAndMatchday(season, matchday);

                if (all.isEmpty()) {
                        log.warn("No hay puntos para MVP en {} jornada {}", season, matchday);
                        return;
                }

                // 🏆 MVP GLOBAL
                BigDecimal maxPoints = all.stream()
                                .map(PlayerPoints::getPoints)
                                .max(BigDecimal::compareTo)
                                .orElseThrow();

                all.stream()
                                .filter(p -> p.getPoints().compareTo(maxPoints) == 0)
                                .forEach(p -> {
                                        PlayerEntity player = playerRepository.findById(p.getPlayerId())
                                                        .orElseThrow(() -> new RuntimeException(
                                                                        "Jugador no encontrado: " + p.getPlayerId()));
                                        mvpRepository.save(MvpMatchdayEntity.of(
                                                        season, matchday, player, p.getPoints().intValue()));
                                });

                // 🏅 MVP POR POSICIÓN
                Map<String, Optional<PlayerPoints>> bestByPosition = all.stream()
                                .collect(Collectors.groupingBy(
                                                PlayerPoints::getPosition,
                                                Collectors.maxBy(Comparator.comparing(PlayerPoints::getPoints))));

                bestByPosition.values().stream()
                                .flatMap(Optional::stream)
                                .forEach(p -> {
                                        PlayerEntity player = playerRepository.findById(p.getPlayerId())
                                                        .orElseThrow(() -> new RuntimeException(
                                                                        "Jugador no encontrado: " + p.getPlayerId()));

                                        mvpRepository.save(MvpMatchdayEntity.of(
                                                        season, matchday, player, p.getPoints().intValue()));
                                });

                log.info("MVP calculados para {} jornada {}", season, matchday);
        }
}
