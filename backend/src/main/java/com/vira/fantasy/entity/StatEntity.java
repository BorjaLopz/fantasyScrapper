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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "stats",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"player_id", "match_id"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private MatchEntity match;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private PlayerEntity player;

    // Participación
    private Integer minutes;

    // Rendimiento ofensivo
    private Integer gls;
    private Integer ast;
    private Integer pk;
    private Integer pkatt;
    private Integer sh;
    private Integer sot;

    // Disciplina
    private Integer crdy;
    private Integer crdr;

    // Participación general
    private Integer touches;

    // Defensa
    private Integer tkl;
    private Integer interceptions;
    private Integer blocks;

    // Estadísticas avanzadas
    @Column(precision = 10, scale = 4)
    private BigDecimal xg;

    @Column(precision = 10, scale = 4)
    private BigDecimal npxg;

    @Column(precision = 10, scale = 4)
    private BigDecimal xag;

    // Creación de ocasiones
    private Integer sca;
    private Integer gca;

    // Pase
    private Integer passesCmp;
    private Integer passesAtt;

    @Column(precision = 5, scale = 2)
    private BigDecimal passesCmpPct;

    private Integer prgp;

    // Conducción
    private Integer carries;
    private Integer prgc;

    // Regate
    private Integer takeonsAtt;
    private Integer takeonsSucc;

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    // Constructor útil
    public StatEntity(PlayerEntity player, MatchEntity match) {
        this.player = player;
        this.match = match;
    }
}
