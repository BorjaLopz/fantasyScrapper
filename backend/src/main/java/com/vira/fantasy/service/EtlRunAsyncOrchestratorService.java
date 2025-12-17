package com.vira.fantasy.service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.vira.fantasy.engine.EtlProgressTracker;
import com.vira.fantasy.entity.EtlRunEntity;
import com.vira.fantasy.repository.EtlRunRepository;
import com.vira.fantasy.repository.MatchRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EtlRunAsyncOrchestratorService {

    private final EtlRunAsyncService etlService;
    private final PointsCalculatorService pointsService;
    private final EtlRunRepository etlRunRepo;
    private final EtlProgressTracker progressTracker;
    private final MatchRepository matchRepo;

    /**
     * Ejecuta todo el pipeline ETL + cálculo de puntos de forma asíncrona
     * @param season temporada
     * @param calculateAll si es true calcula todas las jornadas (cálculo inicial)
     */
    @Async
    public CompletableFuture<Void> runFullPipeline(String season, boolean calculateAll) {

        // 🔒 Evitar doble ejecución
        if (etlRunRepo.existsRunning()) {
            UUID dummyId = UUID.randomUUID();
            progressTracker.setProgress(dummyId, "ETL ya está en ejecución, se cancela nueva ejecución");
            log.info("ETL ya en ejecución, se cancela nueva ejecución");
            return CompletableFuture.completedFuture(null);
        }

        // 1️⃣ Crear registro de ejecución
        EtlRunEntity run = EtlRunEntity.running();
        run = etlRunRepo.save(run);
        final EtlRunEntity finalRun = run;
        final UUID runId = finalRun.getId();

        log.info("Iniciando pipeline ETL para runId={}", runId);
        progressTracker.setProgress(runId, "Pipeline iniciado");

        return CompletableFuture.runAsync(() -> {
            try {
                // 2️⃣ Ejecutar ETL Python
                progressTracker.setProgress(runId, "Ejecutando ETL Python...");
                log.info("Ejecutando ETL Python para runId={}", runId);

                CompletableFuture<Void> etlFuture = etlService.runEtlAsyncWithProgress(finalRun);
                etlFuture.join(); // espera a que el ETL termine

                // 3️⃣ Comprobar resultado ETL
                EtlRunEntity currentRun = etlRunRepo.findById(runId).orElse(finalRun);
                if (currentRun.isFailed()) {
                    progressTracker.setProgress(runId, "ETL falló: " + currentRun.getMessage());
                    log.error("ETL falló para runId={}: {}", runId, currentRun.getMessage());
                    return;
                }

                // 4️⃣ Calcular puntos
                if (calculateAll) {
                    progressTracker.setProgress(runId, "ETL completado, calculando puntos de todas las jornadas...");
                    log.info("Calculando puntos de todas las jornadas para runId={}", runId);
                    List<Integer> allMatchdays = matchRepo.findAllMatchdaysBySeason(season);
                    for (Integer md : allMatchdays) {
                        // pointsService.calculatePointsForMatchday(md, season);
                        pointsService.recalculateAll();
                        progressTracker.setProgress(runId, "Puntos calculados para jornada " + md);
                    }
                } else {
                    progressTracker.setProgress(runId, "ETL completado, calculando puntos de la última jornada...");
                    log.info("Calculando puntos de la última jornada para runId={}", runId);
                    int lastMatchday = matchRepo.findMaxMatchdayBySeason(season).orElse(0);
                    pointsService.calculatePointsForMatchday(lastMatchday, season);
                    progressTracker.setProgress(runId, "Puntos calculados para última jornada " + lastMatchday);
                }

                currentRun.markSuccess();
                etlRunRepo.save(currentRun);
                progressTracker.setProgress(runId, "Pipeline completo");
                log.info("Pipeline completo para runId={}", runId);

            } catch (Exception e) {
                EtlRunEntity currentRun = etlRunRepo.findById(runId).orElse(finalRun);
                currentRun.markFailed(e.getMessage());
                etlRunRepo.save(currentRun);
                progressTracker.setProgress(runId, "Error en pipeline: " + e.getMessage());
                log.error("Error en pipeline para runId={}", runId, e);
            }
        });
    }
}
