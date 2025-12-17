package com.vira.fantasy.engine;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerPoints {

    private UUID playerId;
    private String playerName;
    private String position;
    private BigDecimal points;
}