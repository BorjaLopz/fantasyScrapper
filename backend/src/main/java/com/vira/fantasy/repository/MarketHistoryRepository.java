package com.vira.fantasy.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vira.fantasy.entity.MarketHistoryEntity;

@Repository
public interface MarketHistoryRepository extends JpaRepository<MarketHistoryEntity, UUID> {
}