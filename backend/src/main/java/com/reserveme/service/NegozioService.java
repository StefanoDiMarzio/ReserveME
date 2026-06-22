package com.reserveme.service;

import com.reserveme.exception.ResourceNotFoundException;
import com.reserveme.model.Negozio;
import com.reserveme.repository.NegozioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NegozioService {

    private final NegozioRepository negozioRepository;

    public UUID getAdminIdFromContext() {
        String principal = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return UUID.fromString(principal);
    }

    public Negozio getNegozioAttuale() {
        UUID adminId = getAdminIdFromContext();
        return negozioRepository.findByAmministratoreId(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Negozio non trovato per l'amministratore corrente"));
    }
}
