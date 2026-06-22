package com.reserveme.repository;

import com.reserveme.model.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Page<Cliente> findByNegozioId(Long negozioId, Pageable pageable);

    List<Cliente> findByNegozioId(Long negozioId);

    List<Cliente> findByNegozioIdAndCognomeContainingIgnoreCase(Long negozioId, String cognome);

    Optional<Cliente> findByNegozioIdAndUtenteId(Long negozioId, UUID utenteId);
}
