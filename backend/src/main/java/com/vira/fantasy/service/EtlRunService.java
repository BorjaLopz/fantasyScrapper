package com.vira.fantasy.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.vira.fantasy.entity.EtlRunEntity;
import com.vira.fantasy.repository.EtlRunRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EtlRunService {

    private final EtlRunRepository etlRunRepository;

    public Boolean existsRunning() {
        return etlRunRepository.existsRunning();
    }

    public EtlRunEntity findLast() {
        return etlRunRepository.findLast();
    }

    public EtlRunEntity findById(UUID id) {
        return etlRunRepository.findById(id).orElseThrow(() -> new EntityNotFoundException());
    }
}
