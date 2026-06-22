package com.reserveme.service;

import com.reserveme.dto.request.AggiornaProfiloRequest;
import com.reserveme.dto.request.CambioPasswordRequest;
import com.reserveme.dto.response.ProfiloResponse;
import com.reserveme.exception.ResourceNotFoundException;
import com.reserveme.exception.UnauthorizedException;
import com.reserveme.model.Utente;
import com.reserveme.repository.UtenteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UtenteService {

    private final UtenteRepository utenteRepository;
    private final UtenteContextService utenteContextService;
    private final PasswordEncoder passwordEncoder;

    public Utente getUtenteAttuale() {
        return utenteRepository.findById(utenteContextService.getUtenteIdFromContext())
                .orElseThrow(() -> new ResourceNotFoundException("Utente non trovato"));
    }

    public ProfiloResponse getProfilo() {
        return mapToDto(getUtenteAttuale());
    }

    public ProfiloResponse aggiornaProfilo(AggiornaProfiloRequest request) {
        Utente utente = getUtenteAttuale();
        utente.setNome(request.getNome());
        utente.setCognome(request.getCognome());
        utente.setTelefono(request.getTelefono());
        return mapToDto(utenteRepository.save(utente));
    }

    public void cambiaPassword(CambioPasswordRequest request) {
        Utente utente = getUtenteAttuale();
        if (!passwordEncoder.matches(request.getVecchiaPassword(), utente.getPassword())) {
            throw new UnauthorizedException("La vecchia password non è corretta");
        }
        utente.setPassword(passwordEncoder.encode(request.getNuovaPassword()));
        utenteRepository.save(utente);
    }

    private ProfiloResponse mapToDto(Utente utente) {
        return ProfiloResponse.builder()
                .id(utente.getId())
                .email(utente.getEmail())
                .nome(utente.getNome())
                .cognome(utente.getCognome())
                .telefono(utente.getTelefono())
                .build();
    }
}
