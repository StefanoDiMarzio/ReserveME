package com.reserveme.repository;

import com.reserveme.model.VoceScontrino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoceScontrinoRepository extends JpaRepository<VoceScontrino, Long> {

    List<VoceScontrino> findByScontrinoId(Long scontrinoId);
}
