package com.reserveme.repository;

import com.reserveme.model.Appuntamento;
import com.reserveme.model.enums.StatoAppuntamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppuntamentoRepository extends JpaRepository<Appuntamento, Long> {

    List<Appuntamento> findByNegozioIdAndDataOraInizioBetween(Long negozioId, LocalDateTime start, LocalDateTime end);

    Page<Appuntamento> findByNegozioId(Long negozioId, Pageable pageable);

    List<Appuntamento> findByClienteId(Long clienteId);

    List<Appuntamento> findByClienteUtenteIdOrderByDataOraInizioDesc(UUID utenteId);

    List<Appuntamento> findByNegozioIdAndStato(Long negozioId, StatoAppuntamento stato);

    @Query("SELECT COUNT(a) > 0 FROM Appuntamento a WHERE a.negozio.id = :negozioId " +
           "AND a.stato <> 'ANNULLATO' " +
           "AND a.dataOraInizio < :fine AND a.dataOraFine > :inizio")
    boolean existsOverlapping(@Param("negozioId") Long negozioId,
                              @Param("inizio") LocalDateTime inizio,
                              @Param("fine") LocalDateTime fine);

    @Query("SELECT COUNT(DISTINCT a.cliente.id) FROM Appuntamento a " +
           "WHERE a.negozio.id = :negozioId AND a.stato = 'COMPLETATO' " +
           "AND a.dataOraInizio BETWEEN :start AND :end")
    long countClientiRicevuti(@Param("negozioId") Long negozioId,
                              @Param("start") LocalDateTime start,
                              @Param("end") LocalDateTime end);
}
