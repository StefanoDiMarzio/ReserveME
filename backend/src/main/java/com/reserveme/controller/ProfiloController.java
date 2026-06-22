package com.reserveme.controller;

import com.reserveme.dto.request.AggiornaProfiloRequest;
import com.reserveme.dto.request.CambioPasswordRequest;
import com.reserveme.dto.response.GenericResponse;
import com.reserveme.dto.response.ProfiloResponse;
import com.reserveme.service.UtenteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/app/profilo")
@RequiredArgsConstructor
public class ProfiloController {

    private final UtenteService utenteService;

    @GetMapping
    public ResponseEntity<GenericResponse<ProfiloResponse>> getProfilo() {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Profilo recuperato",
                utenteService.getProfilo(),
                LocalDateTime.now().toString()
        ));
    }

    @PutMapping
    public ResponseEntity<GenericResponse<ProfiloResponse>> aggiornaProfilo(@Valid @RequestBody AggiornaProfiloRequest request) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Profilo aggiornato",
                utenteService.aggiornaProfilo(request),
                LocalDateTime.now().toString()
        ));
    }

    @PutMapping("/password")
    public ResponseEntity<GenericResponse<String>> cambiaPassword(@Valid @RequestBody CambioPasswordRequest request) {
        utenteService.cambiaPassword(request);
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Password aggiornata",
                "OK",
                LocalDateTime.now().toString()
        ));
    }
}
