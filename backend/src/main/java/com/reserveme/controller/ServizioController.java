package com.reserveme.controller;

import com.reserveme.dto.request.ServizioRequest;
import com.reserveme.dto.response.GenericResponse;
import com.reserveme.model.Servizio;
import com.reserveme.service.ServizioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/servizi")
@RequiredArgsConstructor
public class ServizioController {

    private final ServizioService servizioService;

    @GetMapping
    public ResponseEntity<GenericResponse<List<Servizio>>> getServiziAttivi() {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Servizi recuperati con successo",
                servizioService.getServiziAttivi(),
                LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/tutti")
    public ResponseEntity<GenericResponse<List<Servizio>>> getTuttiServizi() {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Tutti i servizi recuperati con successo",
                servizioService.getTuttiServizi(),
                LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GenericResponse<Servizio>> getServizio(@PathVariable Long id) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Servizio recuperato con successo",
                servizioService.getServizio(id),
                LocalDateTime.now().toString()
        ));
    }

    @PostMapping
    public ResponseEntity<GenericResponse<Servizio>> creaServizio(@Valid @RequestBody ServizioRequest request) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Servizio creato con successo",
                servizioService.creaServizio(request),
                LocalDateTime.now().toString()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GenericResponse<Servizio>> aggiornaServizio(@PathVariable Long id, @Valid @RequestBody ServizioRequest request) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Servizio aggiornato con successo",
                servizioService.aggiornaServizio(id, request),
                LocalDateTime.now().toString()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GenericResponse<String>> disattivaServizio(@PathVariable Long id) {
        servizioService.disattivaServizio(id);
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Servizio disattivato con successo",
                "OK",
                LocalDateTime.now().toString()
        ));
    }
}
