package com.vira.fantasy.repository;

import com.vira.fantasy.entity.MvpMatchdayEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MvpMatchdayRepository extends JpaRepository<MvpMatchdayEntity, UUID> {

    boolean existsBySeasonAndMatchday(String season, Integer matchday);

    List<MvpMatchdayEntity> findBySeasonAndMatchday(String season, Integer matchday);

    void deleteBySeasonAndMatchday(String season, Integer matchday);
}
