package com.vira.fantasy.dto;

import java.time.Instant;
import java.util.UUID;

public record EtlRunResponseDto(
    UUID id,
    Instant startedAt,
    Instant finishedAt,
    String status,
    String message
) {
}