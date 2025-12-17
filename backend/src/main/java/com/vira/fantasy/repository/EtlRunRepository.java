package com.vira.fantasy.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.vira.fantasy.entity.EtlRunEntity;

@Repository
public interface EtlRunRepository extends JpaRepository<EtlRunEntity, UUID> {

    /**
     * Última ejecución del ETL (la más reciente)
     */
    @Query("""
                SELECT e
                FROM EtlRunEntity e
                ORDER BY e.startedAt DESC
                LIMIT 1
            """)
    EtlRunEntity findLast();

    /**
     * Comprueba si hay un ETL en ejecución
     */
    @Query("""
                SELECT COUNT(e) > 0
                FROM EtlRunEntity e
                WHERE e.status = 'RUNNING'
            """)
    boolean existsRunning();

}
