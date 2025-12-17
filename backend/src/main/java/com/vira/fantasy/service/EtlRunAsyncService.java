package com.vira.fantasy.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;

import org.springframework.stereotype.Service;

import com.vira.fantasy.engine.EtlProgressTracker;
import com.vira.fantasy.entity.EtlRunEntity;
import com.vira.fantasy.repository.EtlRunRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EtlRunAsyncService {

    private final EtlRunRepository etlRunRepo;
    private final EtlProgressTracker progressTracker;

    /**
     * Lanza ETL Python async desde resources y reporta progreso.
     */
    public CompletableFuture<Void> runEtlAsyncWithProgress(EtlRunEntity run) {
        Executors.newSingleThreadExecutor().submit(() -> {
            UUID runId = run.getId();
            try {
                progressTracker.setProgress(runId, "Preparando ETL desde resources...");
                log.info("Iniciando ETL Python async para runId={}", runId);

                // 1️⃣ Extraer el script Python a archivo temporal
                File pythonScript = copyResourceToTempFile("/etl/etl_fbref.py", "etl_fbref", ".py");

                // 2️⃣ Extraer requirements.txt a archivo temporal
                File requirementsFile = copyResourceToTempFile("/etl/requirements.txt", "requirements", ".txt");

                // 3️⃣ Instalar dependencias
                progressTracker.setProgress(runId, "Instalando dependencias Python...");
                log.info("Instalando dependencias para runId={}", runId);
                runPipInstall(requirementsFile);

                // 4️⃣ Ejecutar el script Python
                progressTracker.setProgress(runId, "Ejecutando ETL Python...");
                log.info("Ejecutando ETL para runId={}", runId);
                runPythonScript(pythonScript, runId);

                run.markSuccess();
                etlRunRepo.save(run);
                progressTracker.setProgress(runId, "ETL completado correctamente");
                log.info("ETL completado con runId={}", runId);
            } catch (Exception e) {
                run.markFailed(e.getMessage());
                etlRunRepo.save(run);
                progressTracker.setProgress(runId, "ETL falló: " + e.getMessage());
                log.info("ETL falló para runId={}: {}", runId, e.getMessage());
            }
        });

        return CompletableFuture.completedFuture(null);
    }

    // ----------------------------
    // Helper: copiar recurso a archivo temporal
    // ----------------------------
    private File copyResourceToTempFile(String resourcePath, String prefix, String suffix) throws IOException {
        InputStream is = getClass().getResourceAsStream(resourcePath);
        if (is == null) {
            throw new FileNotFoundException("No se encontró el recurso: " + resourcePath);
        }
        Path tempFile = Files.createTempFile(prefix, suffix);
        tempFile.toFile().deleteOnExit();
        try (OutputStream os = new FileOutputStream(tempFile.toFile())) {
            is.transferTo(os);
        }
        return tempFile.toFile();
    }

    // ----------------------------
    // Helper: instalar dependencias con pip
    // ----------------------------
    private void runPipInstall(File requirementsFile) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder(
                "python", "-m", "pip", "install", "-r", requirementsFile.getAbsolutePath()
        );
        pb.redirectErrorStream(true);
        Process process = pb.start();
        logProcessOutput(process, null);
        int exit = process.waitFor();
        if (exit != 0) {
            throw new IllegalStateException("Error instalando dependencias Python");
        }
    }

    // ----------------------------
    // Helper: ejecutar script Python
    // ----------------------------
    private void runPythonScript(File pythonScript, UUID runId) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder("python", pythonScript.getAbsolutePath());
        pb.redirectErrorStream(true);
        Process process = pb.start();
        logProcessOutput(process, runId);
        int exit = process.waitFor();
        if (exit != 0) {
            throw new IllegalStateException("ETL Python falló con exit code " + exit);
        }
    }

    // ----------------------------
    // Helper: log y progreso
    // ----------------------------
    private void logProcessOutput(Process process, UUID runId) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (runId != null) {
                    progressTracker.setProgress(runId, line);
                }
                System.out.println("[Python] " + line);
            }
        }
    }
}
