package com.vira.fantasy.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.vira.fantasy.service.EtlRunAsyncOrchestratorService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class PythonStartupRunner {

    @Value("${fantasy.etl.auto-start:true}")
    private boolean autoStartEtl;
    @Value("${fantasy.etl.auto-start-season:2025-2026}")
    private String autoStartSeason;
    @Value("${fantasy.etl.calculate-all:true}")
    private boolean autoStartCalculateAll;

    private final EtlRunAsyncOrchestratorService etlRunAsyncOrchestratorService;

    /**
     * Se ejecuta cuando la aplicación Spring Boot está lista
     * Arranca el ETL automáticamente si no hay otra ejecución en curso
     */
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        if (!autoStartEtl) {
            log.info("Arranque automático de ETL deshabilitado por configuración");
            return;
        }
        log.info("Arrancando ETL automático al iniciar la aplicación...");

        // Lanzar async
        // etlService.runEtlAsyncWithProgress(run);
        etlRunAsyncOrchestratorService.runFullPipeline(autoStartSeason, autoStartCalculateAll);
    }
}
