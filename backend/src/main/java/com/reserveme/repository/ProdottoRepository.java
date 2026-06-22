package com.reserveme.repository;

import com.reserveme.model.Prodotto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdottoRepository extends JpaRepository<Prodotto, Long> {

    List<Prodotto> findByNegozioId(Long negozioId);

    Page<Prodotto> findByNegozioId(Long negozioId, Pageable pageable);

    @Query("SELECT p FROM Prodotto p WHERE p.negozio.id = :negozioId AND p.quantita <= p.sogliaMinima")
    List<Prodotto> findSottoSoglia(@Param("negozioId") Long negozioId);
}
