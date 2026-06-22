package com.reserveme.repository;

import com.reserveme.model.MovimentoCassa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MovimentoCassaRepository extends JpaRepository<MovimentoCassa, Long> {

    List<MovimentoCassa> findByCassaIdAndDataBetweenOrderByDataDesc(Long cassaId, LocalDateTime start, LocalDateTime end);

    List<MovimentoCassa> findByCassaIdOrderByDataDesc(Long cassaId);
}
