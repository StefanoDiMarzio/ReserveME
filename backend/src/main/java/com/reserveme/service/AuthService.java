package com.reserveme.service;

import com.reserveme.dto.request.LoginRequest;
import com.reserveme.dto.request.RegistrazioneRequest;
import com.reserveme.dto.response.LoginResponse;
import com.reserveme.exception.UnauthorizedException;
import com.reserveme.model.Amministratore;
import com.reserveme.model.Cassa;
import com.reserveme.model.Negozio;
import com.reserveme.repository.AmministratoreRepository;
import com.reserveme.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AmministratoreRepository amministratoreRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final GeocodingService geocodingService;

    @Transactional
    public LoginResponse registra(RegistrazioneRequest request) {
        if (amministratoreRepository.existsByEmail(request.getEmailAdmin())) {
            throw new IllegalArgumentException("Email già in uso");
        }

        // Genera codice univoco (es. UUID short o stringa casuale). Qui usiamo i primi 8 char dell'UUID
        String codiceUnivoco = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        while(amministratoreRepository.existsByCodiceUnivoco(codiceUnivoco)) {
            codiceUnivoco = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }

        Amministratore admin = Amministratore.builder()
                .codiceUnivoco(codiceUnivoco)
                .password(passwordEncoder.encode(request.getPassword()))
                .nome(request.getNomeAdmin())
                .cognome(request.getCognomeAdmin())
                .email(request.getEmailAdmin())
                .telefono(request.getTelefonoAdmin())
                .build();

        Negozio negozio = Negozio.builder()
                .amministratore(admin)
                .nome(request.getNomeNegozio())
                .tipo(request.getTipoNegozio())
                .indirizzo(request.getIndirizzoNegozio())
                .citta(request.getCittaNegozio())
                .cap(request.getCapNegozio())
                .telefono(request.getTelefonoNegozio())
                .partitaIva(request.getPartitaIva())
                .build();

        geocodingService.geocodeIndirizzo(negozio.getIndirizzo(), negozio.getCitta(), negozio.getCap())
                .ifPresent(coord -> {
                    negozio.setLatitudine(coord.lat());
                    negozio.setLongitudine(coord.lng());
                });

        admin.setNegozio(negozio);

        Cassa cassa = Cassa.builder()
                .negozio(negozio)
                .build();
        
        negozio.setCassa(cassa);

        Amministratore savedAdmin = amministratoreRepository.save(admin);

        String token = jwtUtil.generateToken(savedAdmin.getId(), savedAdmin.getCodiceUnivoco());

        return LoginResponse.builder()
                .token(token)
                .codiceUnivoco(savedAdmin.getCodiceUnivoco())
                .nome(savedAdmin.getNome())
                .cognome(savedAdmin.getCognome())
                .email(savedAdmin.getEmail())
                .negozioId(savedAdmin.getNegozio().getId())
                .nomeNegozio(savedAdmin.getNegozio().getNome())
                .build();
    }

    public LoginResponse login(LoginRequest request) {
        Amministratore admin = amministratoreRepository.findByCodiceUnivoco(request.getCodiceUnivoco())
                .orElseThrow(() -> new UnauthorizedException("Credenziali non valide"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new UnauthorizedException("Credenziali non valide");
        }

        String token = jwtUtil.generateToken(admin.getId(), admin.getCodiceUnivoco());

        return LoginResponse.builder()
                .token(token)
                .codiceUnivoco(admin.getCodiceUnivoco())
                .nome(admin.getNome())
                .cognome(admin.getCognome())
                .email(admin.getEmail())
                .negozioId(admin.getNegozio().getId())
                .nomeNegozio(admin.getNegozio().getNome())
                .build();
    }
}
