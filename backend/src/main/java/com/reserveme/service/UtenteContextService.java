package com.reserveme.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UtenteContextService {

    public UUID getUtenteIdFromContext() {
        String principal = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return UUID.fromString(principal);
    }
}
