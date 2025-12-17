package com.vira.fantasy.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vira.fantasy.service.IdealXiService;
import com.vira.fantasy.service.MvpMatchdayService;
import com.vira.fantasy.service.PointsCalculatorService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/management/points")
@RequiredArgsConstructor
public class PointsAdminController {

    private final PointsCalculatorService recalculationService;
    private final MvpMatchdayService mvpMatchdayService;
    private final IdealXiService idealXiService;

    @PostMapping("/recalculate/matchday")
    public ResponseEntity<Void> recalculateMatchday(
            @RequestParam String season,
            @RequestParam int matchday) {
        recalculationService.calculatePointsForMatchday(matchday, season);
        mvpMatchdayService.calculateForMatchday(matchday, season);
        idealXiService.calculateForMatchday(matchday, season);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/recalculate/season")
    public ResponseEntity<Void> recalculateSeason(
            @RequestParam String season) {
        recalculationService.recalculateSeason(season);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/recalculate/all")
    public ResponseEntity<Void> recalculateAll() {
        recalculationService.recalculateAll();
        return ResponseEntity.ok().build();
    }
}
