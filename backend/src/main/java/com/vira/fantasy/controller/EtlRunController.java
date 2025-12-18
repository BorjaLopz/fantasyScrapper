package com.vira.fantasy.controller;

import lombok.RequiredArgsConstructor;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.vira.fantasy.dto.EtlRunResponseDto;
import com.vira.fantasy.engine.EtlProgressTracker;
import com.vira.fantasy.entity.EtlRunEntity;
import com.vira.fantasy.mapper.EtlRunMapper;
import com.vira.fantasy.service.EtlRunAsyncOrchestratorService;
import com.vira.fantasy.service.EtlRunService;

@RestController
@RequestMapping("/api/management/etl")
@RequiredArgsConstructor
public class EtlRunController {

    private final EtlRunMapper etlRunMapper;
    private final EtlRunAsyncOrchestratorService orchestratorService;
    private final EtlRunService etlRunService;
    private final EtlProgressTracker progressTracker;

    /**
     * Endpoint para forzar la ejecución del pipeline completo
     */
    @PostMapping("/run")
    public ResponseEntity<String> runEtlManually(@RequestParam String season) {
        // 🔒 Evita doble ejecución
        if (etlRunService.existsRunning()) {
            return ResponseEntity
                    .badRequest()
                    .body("ETL ya está en ejecución");
        }

        orchestratorService.runFullPipeline(season, false);
        return ResponseEntity.ok("ETL y cálculo de puntos lanzados correctamente");
    }

    /**
     * Endpoint para consultar el estado del último ETL
     */
    @GetMapping("/status")
    public ResponseEntity<EtlRunResponseDto> getLastEtlStatus() {
        EtlRunEntity lastRun = etlRunService.findLast();
        if (lastRun == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(etlRunMapper.toDto(lastRun));
    }

    @GetMapping("/progress")
    public SseEmitter getProgress() {
        SseEmitter emitter = new SseEmitter(0L); // sin timeout
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    EtlRunEntity lastRun = etlRunService.findLast();
                    if (lastRun == null) {
                        emitter.send(SseEmitter.event().name("progress").data("No hay ETL en ejecución"));
                        emitter.complete();
                        return;
                    }

                    UUID runId = lastRun.getId();
                    String status;

                    while (lastRun.isRunning()) {
                        status = progressTracker.getProgress(runId);
                        emitter.send(SseEmitter.event().name("progress").data(status));
                        Thread.sleep(2000); // cada 2 segundos
                        lastRun = etlRunService.findById(runId);
                        if (lastRun == null)
                            break;
                    }

                    // último mensaje
                    status = progressTracker.getProgress(runId);
                    emitter.send(SseEmitter.event().name("progress").data(status));
                    emitter.complete();

                } catch (Exception e) {
                    emitter.completeWithError(e);
                }
            }
        }).start();

        return emitter;
    }
}
