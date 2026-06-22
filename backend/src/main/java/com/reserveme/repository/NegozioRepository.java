package com.reserveme.repository;

import com.reserveme.model.Negozio;
import com.reserveme.model.enums.TipoNegozio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NegozioRepository extends JpaRepository<Negozio, Long> {

    Optional<Negozio> findByAmministratoreId(UUID adminId);

    boolean existsByPartitaIva(String partitaIva);

    @Query("SELECT DISTINCT n FROM Negozio n LEFT JOIN n.servizi s WHERE " +
           "(:testo = '' OR " +
           " LOWER(n.nome) LIKE LOWER(CONCAT('%', :testo, '%')) OR " +
           " LOWER(n.citta) LIKE LOWER(CONCAT('%', :testo, '%')) OR " +
           " LOWER(n.indirizzo) LIKE LOWER(CONCAT('%', :testo, '%')) OR " +
           " LOWER(s.nomeTrattamento) LIKE LOWER(CONCAT('%', :testo, '%'))) " +
           "AND (:tipo IS NULL OR n.tipo = :tipo)")
    List<Negozio> searchPubblico(@Param("testo") String testo, @Param("tipo") TipoNegozio tipo);
}
