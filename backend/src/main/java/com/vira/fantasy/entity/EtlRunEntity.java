package com.vira.fantasy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "etl_run")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EtlRunEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "finished_at")
    private Instant finishedAt;

    @Column(nullable = false)
    private String status;
    // RUNNING | SUCCESS | FAILED

    @Column(columnDefinition = "TEXT")
    private String message;

    /* ======================
     *  FACTORY METHODS
     * ====================== */
    public static EtlRunEntity running() {
        EtlRunEntity run = new EtlRunEntity();
        run.startedAt = Instant.now();
        run.status = "RUNNING";
        return run;
    }

    public void markSuccess() {
        this.status = "SUCCESS";
        this.finishedAt = Instant.now();
    }

    public void markFailed(String message) {
        this.status = "FAILED";
        this.finishedAt = Instant.now();
        this.message = message;
    }

    /* ======================
     *  HELPERS
     * ====================== */
    public boolean isRunning() {
        return "RUNNING".equals(this.status);
    }

    public boolean isSuccess() {
        return "SUCCESS".equals(this.status);
    }

    public boolean isFailed() {
        return "FAILED".equals(this.status);
    }
}
