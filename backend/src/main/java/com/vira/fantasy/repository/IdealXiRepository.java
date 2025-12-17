package com.vira.fantasy.repository;

import com.vira.fantasy.entity.IdealXiEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IdealXiRepository extends JpaRepository<IdealXiEntity, UUID> {

    boolean existsBySeasonAndMatchday(String season, Integer matchday);

    List<IdealXiEntity> findBySeasonAndMatchday(String season, Integer matchday);

    void deleteBySeasonAndMatchday(String season, Integer matchday);
}
