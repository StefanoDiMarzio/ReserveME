package com.reserveme.service;

import com.reserveme.dto.request.UtenteLoginRequest;
import com.reserveme.dto.request.UtenteRegistrazioneRequest;
import com.reserveme.dto.response.UtenteLoginResponse;
import com.reserveme.exception.UnauthorizedException;
import com.reserveme.model.Utente;
import com.reserveme.repository.UtenteRepository;
import com.reserveme.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UtenteAuthService {

    private final UtenteRepository utenteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public UtenteLoginResponse registra(UtenteRegistrazioneRequest request) {
        if (utenteRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email già in uso");
        }

        Utente utente = Utente.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nome(request.getNome())
                .cognome(request.getCognome())
                .telefono(request.getTelefono())
                .build();

        Utente saved = utenteRepository.save(utente);

        String token = jwtUtil.generateToken(saved.getId(), saved.getEmail(), "CLIENTE");

        return UtenteLoginResponse.builder()
                .token(token)
                .utenteId(saved.getId())
                .email(saved.getEmail())
                .nome(saved.getNome())
                .cognome(saved.getCognome())
                .build();
    }

    public UtenteLoginResponse login(UtenteLoginRequest request) {
        Utente utente = utenteRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Credenziali non valide"));

        if (!passwordEncoder.matches(request.getPassword(), utente.getPassword())) {
            throw new UnauthorizedException("Credenziali non valide");
        }

        String token = jwtUtil.generateToken(utente.getId(), utente.getEmail(), "CLIENTE");

        return UtenteLoginResponse.builder()
                .token(token)
                .utenteId(utente.getId())
                .email(utente.getEmail())
                .nome(utente.getNome())
                .cognome(utente.getCognome())
                .build();
    }
}
