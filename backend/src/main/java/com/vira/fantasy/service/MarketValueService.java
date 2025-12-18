package com.vira.fantasy.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.vira.fantasy.entity.MarketHistoryEntity;
import com.vira.fantasy.entity.PlayerEntity;
import com.vira.fantasy.repository.MarketHistoryRepository;
import com.vira.fantasy.repository.PlayerRepository;
import com.vira.fantasy.repository.PointHistoryRepository;
import com.vira.fantasy.repository.StatRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MarketValueService {

    private final PlayerRepository playerRepo;
    private final PointHistoryRepository pointsRepo;
    private final StatRepository statRepo;
    private final MarketHistoryRepository marketRepo;

    private static final int DEFAULT_LAST_N_MATCHDAYS = 5;

    /**
     * Calcula el valor de mercado de todos los jugadores
     */
    @Transactional
    public void calculateMarketValues() {
        calculateMarketValues(DEFAULT_LAST_N_MATCHDAYS);
    }

    /**
     * Calcula el valor de mercado usando las últimas N jornadas
     */
    @Transactional
    public void calculateMarketValues(int lastNMatchdays) {
        List<PlayerEntity> players = playerRepo.findAll();
        List<MarketHistoryEntity> updates = new ArrayList<>();

        for (PlayerEntity player : players) {
            BigDecimal marketValue = calculatePlayerValue(player, lastNMatchdays);

            MarketHistoryEntity mh = new MarketHistoryEntity();
            mh.setId(UUID.randomUUID());
            mh.setPlayer(player);
            mh.setMarketValue(marketValue);
            mh.setCalculatedAt(LocalDateTime.now());
            updates.add(mh);
        }

        marketRepo.saveAll(updates);
    }

    /**
     * Calcula el valor de un jugador individual
     */
    private BigDecimal calculatePlayerValue(PlayerEntity player, int lastNMatchdays) {
        // Base según posición
        BigDecimal base = switch (player.getPosition()) {
            case "GK" -> BigDecimal.valueOf(5_000_000);
            case "DEF" -> BigDecimal.valueOf(6_000_000);
            case "MID" -> BigDecimal.valueOf(7_000_000);
            case "FWD" -> BigDecimal.valueOf(8_000_000);
            default -> BigDecimal.valueOf(5_000_000);
        };

        // Puntos últimas N jornadas
        int lastPoints = pointsRepo.sumPointsLastNMatchdays(player.getId(), lastNMatchdays);

        // Goles y asistencias últimas N jornadas
        int lastGoals = statRepo.sumGoalsLastNMatchdays(player.getId(), lastNMatchdays);
        int lastAssists = statRepo.sumAssistsLastNMatchdays(player.getId(), lastNMatchdays);

        BigDecimal pointsFactor = BigDecimal.valueOf(lastPoints * 200_000L);
        BigDecimal statsFactor = BigDecimal.valueOf(lastGoals * 500_000L + lastAssists * 300_000L);

        // Edad: penaliza mayores de 30
        int age = parseAge(player.getAge());
        BigDecimal agePenalty = age > 30 ? BigDecimal.valueOf((age - 30) * 100_000L) : BigDecimal.ZERO;

        return base.add(pointsFactor).add(statsFactor).subtract(agePenalty);
    }

    private int parseAge(String age) {
        try {
            return Integer.parseInt(age);
        } catch (Exception e) {
            return 25; // valor por defecto si no hay edad
        }
    }
}