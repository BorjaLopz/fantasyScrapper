package com.vira.fantasy.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "mvp_matchday",
    uniqueConstraints = @UniqueConstraint(columnNames = {
        "season", "matchday", "player_id"
    })
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MvpMatchdayEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String season;

    @Column(nullable = false)
    private Integer matchday;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private PlayerEntity player;

    @Column(nullable = false)
    private String position;

    @Column(nullable = false)
    private Integer points;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public static MvpMatchdayEntity of(
            String season,
            int matchday,
            PlayerEntity player,
            int points
    ) {
        return MvpMatchdayEntity.builder()
                .season(season)
                .matchday(matchday)
                .player(player)
                .position(player.getPosition())
                .points(points)
                .build();
    }
}
