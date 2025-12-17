package com.vira.fantasy.schedule;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.vira.fantasy.repository.EtlRunRepository;
import com.vira.fantasy.service.EtlRunAsyncOrchestratorService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DailyEtlRunSchedulerService {

    private final EtlRunAsyncOrchestratorService orchestrator;
    private final EtlRunRepository etlRunRepo;

    @Scheduled(cron = "0 0 0 * * *") // todos los días a las 00:00
    public void runDailyEtl() {
        if (etlRunRepo.existsRunning()) {
            return; // ya hay uno en marcha
        }

        orchestrator.runFullPipeline("2025-2026", false);
    }
}
