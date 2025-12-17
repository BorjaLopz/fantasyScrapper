package com.vira.fantasy.engine;

import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Component
public class EtlProgressTracker {

    private final ConcurrentMap<UUID, String> progressMap = new ConcurrentHashMap<>();

    public void setProgress(UUID etlRunId, String message) {
        progressMap.put(etlRunId, message);
    }

    public String getProgress(UUID etlRunId) {
        return progressMap.getOrDefault(etlRunId, "No hay progreso");
    }

    public void clear(UUID etlRunId) {
        progressMap.remove(etlRunId);
    }
}
