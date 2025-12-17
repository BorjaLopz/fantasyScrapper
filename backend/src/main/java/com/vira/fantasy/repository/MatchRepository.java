package com.vira.fantasy.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vira.fantasy.entity.MatchEntity;

@Repository
public interface MatchRepository extends JpaRepository<MatchEntity, UUID> {

    @Query("""
                SELECT MAX(m.matchday)
                FROM MatchEntity m
                WHERE m.season = :season
            """)
    Integer findLastMatchday(String season);

    @Query("SELECT MAX(m.matchday) FROM MatchEntity m WHERE m.season = :season")
    Optional<Integer> findMaxMatchdayBySeason(@Param("season") String season);

    @Query("SELECT DISTINCT m.matchday FROM MatchEntity m WHERE m.season = :season ORDER BY m.matchday ASC")
    List<Integer> findAllMatchdaysBySeason(@Param("season") String season);
}
