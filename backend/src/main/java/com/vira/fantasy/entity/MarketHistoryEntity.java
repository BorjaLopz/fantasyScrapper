package com.vira.fantasy.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "market_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketHistoryEntity {
    @Id
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "player_id")
    private PlayerEntity player;

    private BigDecimal marketValue;

    private LocalDateTime calculatedAt;
}
