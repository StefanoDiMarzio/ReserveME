package com.reserveme.controller;

import com.reserveme.dto.request.LoginRequest;
import com.reserveme.dto.request.RegistrazioneRequest;
import com.reserveme.dto.response.GenericResponse;
import com.reserveme.dto.response.LoginResponse;
import com.reserveme.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<GenericResponse<LoginResponse>> register(@Valid @RequestBody RegistrazioneRequest request) {
        LoginResponse response = authService.registra(request);
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Registrazione completata con successo",
                response,
                LocalDateTime.now().toString()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<GenericResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Login effettuato con successo",
                response,
                LocalDateTime.now().toString()
        ));
    }
}
