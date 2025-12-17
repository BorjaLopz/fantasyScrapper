package com.vira.fantasy.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.vira.fantasy.entity.MatchEntity;
import com.vira.fantasy.entity.PointHistoryEntity;
import com.vira.fantasy.entity.StatEntity;
import com.vira.fantasy.repository.PointHistoryRepository;
import com.vira.fantasy.repository.StatRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PointsCalculatorService {

    private final StatRepository statRepo;
    private final PointHistoryRepository pointsRepo;

    @Transactional
    public void calculatePointsForMatchday(int matchday, String season) {
        // 1️⃣ Obtener todas las stats de la jornada
        List<StatEntity> stats = statRepo.findAllBySeasonAndMatchday(season, matchday);
        List<PointHistoryEntity> batch = new ArrayList<>();

        for (StatEntity s : stats) {
            double points = calculatePointsForStat(s);
            batch.add(PointHistoryEntity.of(s.getPlayer().getId(), s.getMatch().getId(), BigDecimal.valueOf(points)));
        }

        // 2️⃣ Guardar batch
        pointsRepo.saveAll(batch);
    }

    private double calculatePointsForStat(StatEntity s) {
        String pos = s.getPlayer().getPosition();
        double points = 0;

        // Gol
        points += s.getGls() * getGoalWeight(pos);

        // Asistencia
        points += s.getAst() * 3;

        // Penalti
        points += s.getPk() * 5;
        points -= (s.getPkatt() - s.getPk()) * 2; // fallos

        // Disciplina
        points -= s.getCrdy() * 1;
        points -= s.getCrdr() * 3;

        // Minutos
        points += (s.getMinutes() >= 90 ? 1 : 0.5);

        // Defensa / Clean sheet
        if ("GK".equals(pos) || "DEF".equals(pos)) {
            points += s.getTkl() * 0.2 + s.getInterceptions() * 0.2 + s.getBlocks() * 0.2;
            points += hasCleanSheet(s) ? 4 : 0;
        }

        // Regate / Pases / Creación de ocasiones
        points += s.getTakeonsSucc() * getTakeonWeight(pos);
        points += s.getPrgp() * getProgressPassWeight(pos);
        points += s.getSca() * getSCAWeight(pos);
        points += s.getGca() * getGCAWeight(pos);

        // Redondear a 1 decimal
        points = Math.round(points * 10.0) / 10.0;
        return points;
    }

    private int getGoalWeight(String pos) {
        return switch (pos) {
            case "GK", "DEF" -> 6;
            case "MID" -> 5;
            case "FWD" -> 4;
            default -> 4;
        };
    }

    private double getTakeonWeight(String pos) {
        return switch (pos) {
            case "GK", "DEF" -> 0.1;
            case "MID" -> 0.2;
            case "FWD" -> 0.3;
            default -> 0.1;
        };
    }

    private double getProgressPassWeight(String pos) {
        return switch (pos) {
            case "GK", "DEF" -> 0.1;
            case "MID" -> 0.2;
            case "FWD" -> 0.2;
            default -> 0.1;
        };
    }

    private double getSCAWeight(String pos) {
        return switch (pos) {
            case "GK", "DEF" -> 0.1;
            case "MID" -> 0.2;
            case "FWD" -> 0.3;
            default -> 0.1;
        };
    }

    private double getGCAWeight(String pos) {
        return switch (pos) {
            case "GK", "DEF" -> 0.2;
            case "MID" -> 0.3;
            case "FWD" -> 0.4;
            default -> 0.2;
        };
    }

    private boolean hasCleanSheet(StatEntity s) {
        MatchEntity match = s.getMatch();
        String pos = s.getPlayer().getPosition();
        if ("GK".equals(pos)) {
            return match.getHomeGoals() == 0 && match.getAwayTeam().getId().equals(s.getPlayer().getTeam().getId())
                    || match.getAwayGoals() == 0 && match.getHomeTeam().getId().equals(s.getPlayer().getTeam().getId());
        }
        if ("DEF".equals(pos)) {
            return match.getHomeGoals() == 0 && match.getAwayTeam().getId().equals(s.getPlayer().getTeam().getId())
                    || match.getAwayGoals() == 0 && match.getHomeTeam().getId().equals(s.getPlayer().getTeam().getId());
        }
        return false;
    }
}

