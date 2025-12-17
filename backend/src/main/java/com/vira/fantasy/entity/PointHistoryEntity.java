package com.vira.fantasy.entity;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "points_history",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_points_player_match",
            columnNames = {"player_id", "match_id"}
        )
    },
    indexes = {
        @Index(name = "idx_points_player_id", columnList = "player_id"),
        @Index(name = "idx_points_match_id", columnList = "match_id")
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PointHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id")
    private PlayerEntity player;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id")
    private MatchEntity match;

    private BigDecimal points;

    @Column(name = "calculated_at")
    private Instant calculatedAt = Instant.now();

    public static PointHistoryEntity of(
        UUID playerId, UUID matchId, BigDecimal points
    ) {
        PointHistoryEntity p = new PointHistoryEntity();
        p.player = new PlayerEntity();
        p.player.setId(playerId);
        p.match = new MatchEntity();
        p.match.setId(matchId);
        p.points = points;
        return p;
    }
}

