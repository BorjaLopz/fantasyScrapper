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
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PointsCalculatorService {

    private final StatRepository statRepository;
    private final PointHistoryRepository pointsRepository;

    @Transactional
    public void calculatePointsForMatchday(int matchday, String season) {
        // 1️⃣ Obtener todas las stats de la jornada
        List<StatEntity> stats = statRepository.findAllBySeasonAndMatchday(season, matchday);
        List<PointHistoryEntity> batch = new ArrayList<>();

        for (StatEntity s : stats) {
            double points = calculatePointsForStat(s);
            batch.add(PointHistoryEntity.of(s.getPlayer().getId(), s.getMatch().getId(), BigDecimal.valueOf(points)));
        }

        // 2️⃣ Guardar batch
        pointsRepository.saveAll(batch);
    }

    @Transactional
    public void recalculateMatchday(int matchday, String season) {
        log.info("Recalculando puntos - Temporada {}, Jornada {}", season, matchday);

        List<StatEntity> stats = statRepository.findAllBySeasonAndMatchday(season, matchday);

        if (stats.isEmpty()) {
            log.warn("No hay stats para temporada {} jornada {}", season, matchday);
            return;
        }

        // 1️⃣ Borrar puntos existentes de esa jornada
        pointsRepository.deleteBySeasonAndMatchday(season, matchday);

        // 2️⃣ Recalcular
        List<PointHistoryEntity> batch = new ArrayList<>(stats.size());

        for (StatEntity stat : stats) {
            double points = calculatePointsForStat(stat);

            batch.add(
                    PointHistoryEntity.of(
                            stat.getPlayer().getId(),
                            stat.getMatch().getId(),
                            new BigDecimal(points)));
        }

        // 3️⃣ Guardado batch
        pointsRepository.saveAll(batch);

        log.info("Recalculo completado - {} registros", batch.size());
    }

    @Transactional
    public void recalculateSeason(String season) {
        List<Integer> matchdays = statRepository.findDistinctMatchdaysBySeason(season);

        for (Integer md : matchdays) {
            recalculateMatchday(md, season);
        }
    }

    @Transactional
    public void recalculateAll() {
        List<String> seasons = statRepository.findDistinctSeasons();

        for (String season : seasons) {
            recalculateSeason(season);
        }
    }

    private double calculatePointsForStat(StatEntity s) {
        String pos = s.getPlayer().getPosition();
        double points = 0;

        // ⏱️ MINUTOS (clave)
        if (s.getMinutes() > 0 && s.getMinutes() < 30) {
            points -= 3;
        } else if (s.getMinutes() < 60) {
            points -= 1;
        } else {
            points += 2; // ya no hay punto gratis
        }

        if (s.getMinutes() == 90) {
            points += 1;
        }

        // ⚽ GOLES
        points += s.getGls() * getGoalWeight(pos);

        // 🎯 ASISTENCIAS
        points += s.getAst() * 3;

        // 🥅 PENALES
        points += s.getPk() * 5;
        points -= (s.getPkatt() - s.getPk()) * 4; // más castigo

        // 🟨 DISCIPLINA
        points -= s.getCrdy();
        points -= s.getCrdr() * 4;

        // 🛡️ DEFENSA (más impacto)
        if ("GK".equals(pos) || "DEF".equals(pos)) {
            points += s.getTkl() * 0.6;
            points += s.getInterceptions() * 0.6;
            points += s.getBlocks() * 1.0;
            if (hasCleanSheet(s)) {
                points += 4;
            }
        }

        // 🎯 CREACIÓN / JUEGO (más granular)
        points += s.getTakeonsSucc() * getTakeonWeight(pos);
        points -= (s.getTakeonsAtt() - s.getTakeonsSucc()) * 0.75;

        points += s.getPrgp() * getProgressPassWeight(pos);
        points += s.getSca() * getSCAWeight(pos);
        points += s.getGca() * getGCAWeight(pos);

        // ❌ CASTIGO POR PARTIDO INVISIBLE
        boolean noImpact = s.getGls() == 0 &&
                s.getAst() == 0 &&
                s.getSot() == 0 &&
                s.getSca() < 2 &&
                s.getPrgp() < 3;

        if (noImpact && s.getMinutes() >= 60) {
            points -= 1.5;
        }

        // 🔢 REDONDEO FINAL (ANTI 0/1)
        return (int) Math.floor(points + 0.1);
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
