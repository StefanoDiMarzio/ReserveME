package com.reserveme.controller;

import com.reserveme.dto.request.UtenteLoginRequest;
import com.reserveme.dto.request.UtenteRegistrazioneRequest;
import com.reserveme.dto.response.GenericResponse;
import com.reserveme.dto.response.UtenteLoginResponse;
import com.reserveme.service.UtenteAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/app/auth")
@RequiredArgsConstructor
public class UtenteAuthController {

    private final UtenteAuthService utenteAuthService;

    @PostMapping("/register")
    public ResponseEntity<GenericResponse<UtenteLoginResponse>> registra(@Valid @RequestBody UtenteRegistrazioneRequest request) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Registrazione completata",
                utenteAuthService.registra(request),
                LocalDateTime.now().toString()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<GenericResponse<UtenteLoginResponse>> login(@Valid @RequestBody UtenteLoginRequest request) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Login effettuato",
                utenteAuthService.login(request),
                LocalDateTime.now().toString()
        ));
    }
}
