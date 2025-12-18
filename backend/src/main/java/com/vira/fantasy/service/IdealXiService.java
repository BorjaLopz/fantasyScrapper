package com.vira.fantasy.service;

import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import com.vira.fantasy.engine.PlayerPoints;
import com.vira.fantasy.entity.IdealXiEntity;
import com.vira.fantasy.entity.PlayerEntity;
import com.vira.fantasy.repository.IdealXiRepository;
import com.vira.fantasy.repository.PlayerRepository;
import com.vira.fantasy.repository.PointHistoryRepository;
import com.vira.fantasy.repository.StatRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class IdealXiService {
        private final PointHistoryRepository pointHistoryRepository;
        private final IdealXiRepository idealRepository;
        private final PlayerRepository playerRepository;
        private final StatRepository statRepository;
        private final TransactionTemplate txTemplate;

        // Prioridad de posición para desempate (si quieres mantener un orden
        // determinístico)
        private static final Map<String, Integer> POSITION_PRIORITY = Map.of(
                        "GK", 1,
                        "DEF", 2,
                        "MID", 3,
                        "FWD", 4);

        /**
         * Calcula el 11 ideal para toda la temporada
         */
        public void calculateForSeason(String season) {
                List<Integer> matchdays = statRepository.findDistinctMatchdaysBySeason(season);

                if (matchdays.isEmpty()) {
                        log.warn("No hay jornadas para la temporada {}", season);
                        return;
                }

                // Cada jornada se calcula en su propia transacción
                matchdays.stream()
                                .sorted()
                                .forEach(md -> {
                                        try {
                                                calculateForMatchday(md, season);
                                        } catch (Exception e) {
                                                log.error("Error calculando 11 ideal {} jornada {}", season, md, e);
                                        }
                                });
        }

        /**
         * Calcula el 11 ideal para una jornada específica
         */
        public void calculateForMatchday(int matchday, String season) {
                txTemplate.execute(status -> {
                        calculateForMatchdayInternal(season, matchday);
                        return null;
                });
        }

        /**
         * Lógica interna para calcular una jornada, asegurando un único jugador por
         * posición
         */
        private void calculateForMatchdayInternal(String season, int matchday) {
                idealRepository.deleteBySeasonAndMatchday(season, matchday);
                idealRepository.flush();

                List<PlayerPoints> all = pointHistoryRepository.findPointsBySeasonAndMatchday(season, matchday);
                if (all.isEmpty()) {
                        log.warn("No hay puntos para 11 ideal {} jornada {}", season, matchday);
                        return;
                }

                Map<String, List<PlayerPoints>> byPosition = all.stream()
                                .collect(Collectors.groupingBy(PlayerPoints::getPosition));

                // Set para evitar duplicados
                Set<UUID> addedPlayers = new HashSet<>();

                saveTopUnique(byPosition, "GK", 1, season, matchday, addedPlayers);
                saveTopUnique(byPosition, "DEF", 4, season, matchday, addedPlayers);
                saveTopUnique(byPosition, "MID", 3, season, matchday, addedPlayers);
                saveTopUnique(byPosition, "FWD", 3, season, matchday, addedPlayers);

                log.info("✅ 11 ideal calculado para {} jornada {}", season, matchday);
        }

        /**
         * Selecciona los mejores jugadores por posición, evitando duplicados
         */
        private void saveTopUnique(Map<String, List<PlayerPoints>> byPosition,
                        String position,
                        int limit,
                        String season,
                        int matchday,
                        Set<UUID> addedPlayers) {
                List<PlayerPoints> players = byPosition.getOrDefault(position, Collections.emptyList());

                players.stream()
                                .sorted(Comparator
                                                .comparing(PlayerPoints::getPoints).reversed()
                                                .thenComparing(p -> POSITION_PRIORITY.getOrDefault(p.getPosition(), 99))
                                                .thenComparing(PlayerPoints::getPlayerId))
                                .filter(p -> !addedPlayers.contains(p.getPlayerId())) // ⚡ ignorar si ya fue agregado
                                .limit(limit)
                                .forEach(p -> {
                                        PlayerEntity player = playerRepository.findById(p.getPlayerId())
                                                        .orElseThrow(() -> new RuntimeException(
                                                                        "Jugador no encontrado: " + p.getPlayerId()));

                                        idealRepository.save(IdealXiEntity.of(season, matchday, player,
                                                        p.getPoints().intValue()));
                                        addedPlayers.add(p.getPlayerId()); // marcar como agregado
                                });
        }
}