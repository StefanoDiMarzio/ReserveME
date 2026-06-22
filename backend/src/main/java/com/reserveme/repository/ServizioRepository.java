package com.reserveme.repository;

import com.reserveme.model.Servizio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServizioRepository extends JpaRepository<Servizio, Long> {

    List<Servizio> findByNegozioIdAndAttivoTrue(Long negozioId);

    List<Servizio> findByNegozioId(Long negozioId);
}
