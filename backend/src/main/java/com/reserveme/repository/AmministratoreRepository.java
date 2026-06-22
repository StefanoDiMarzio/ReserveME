package com.reserveme.repository;

import com.reserveme.model.Amministratore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AmministratoreRepository extends JpaRepository<Amministratore, UUID> {

    Optional<Amministratore> findByCodiceUnivoco(String codiceUnivoco);

    Optional<Amministratore> findByEmail(String email);

    boolean existsByCodiceUnivoco(String codiceUnivoco);

    boolean existsByEmail(String email);
}
