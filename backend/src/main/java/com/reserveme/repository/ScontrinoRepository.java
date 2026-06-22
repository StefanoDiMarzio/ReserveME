package com.reserveme.repository;

import com.reserveme.model.Scontrino;
import com.reserveme.model.enums.TipoDocumento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScontrinoRepository extends JpaRepository<Scontrino, Long> {

    List<Scontrino> findByNegozioIdAndDataEmissioneBetween(Long negozioId, LocalDateTime start, LocalDateTime end);
    
    Page<Scontrino> findByNegozioId(Long negozioId, Pageable pageable);

    List<Scontrino> findByNegozioIdAndTipoDocumento(Long negozioId, TipoDocumento tipo);

    @Query("SELECT COALESCE(SUM(s.totale), 0) FROM Scontrino s " +
           "WHERE s.negozio.id = :negozioId AND s.stato = 'EMESSO' " +
           "AND s.dataEmissione BETWEEN :start AND :end")
    BigDecimal sumIncassi(@Param("negozioId") Long negozioId,
                          @Param("start") LocalDateTime start,
                          @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(s) FROM Scontrino s " +
           "WHERE s.negozio.id = :negozioId AND s.stato = 'EMESSO' " +
           "AND s.tipoDocumento = :tipo " +
           "AND s.dataEmissione BETWEEN :start AND :end")
    long countByTipoAndPeriodo(@Param("negozioId") Long negozioId,
                               @Param("tipo") TipoDocumento tipo,
                               @Param("start") LocalDateTime start,
                               @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(MAX(CAST(s.numeroDocumento AS int)), 0) FROM Scontrino s " +
           "WHERE s.negozio.id = :negozioId")
    int findMaxNumeroDocumento(@Param("negozioId") Long negozioId);
}
