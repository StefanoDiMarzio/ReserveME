package com.reserveme.controller;

import com.reserveme.dto.request.AppuntamentoRequest;
import com.reserveme.dto.response.GenericResponse;
import com.reserveme.model.Appuntamento;
import com.reserveme.model.enums.StatoAppuntamento;
import com.reserveme.service.AppuntamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appuntamenti")
@RequiredArgsConstructor
public class AppuntamentoController {

    private final AppuntamentoService appuntamentoService;

    @GetMapping
    public ResponseEntity<GenericResponse<List<Appuntamento>>> getAppuntamentiPerPeriodo(
            @RequestParam String start,
            @RequestParam String end) {
        LocalDateTime startTime = LocalDateTime.parse(start);
        LocalDateTime endTime = LocalDateTime.parse(end);
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Appuntamenti recuperati",
                appuntamentoService.getAppuntamentiPerPeriodo(startTime, endTime),
                LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/tutti")
    public ResponseEntity<GenericResponse<Page<Appuntamento>>> getTuttiAppuntamenti(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Tutti gli appuntamenti recuperati",
                appuntamentoService.getTuttiAppuntamenti(PageRequest.of(page, size)),
                LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GenericResponse<Appuntamento>> getAppuntamento(@PathVariable Long id) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Appuntamento recuperato",
                appuntamentoService.getAppuntamento(id),
                LocalDateTime.now().toString()
        ));
    }

    @PostMapping
    public ResponseEntity<GenericResponse<Appuntamento>> creaAppuntamento(@Valid @RequestBody AppuntamentoRequest request) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Appuntamento creato",
                appuntamentoService.creaAppuntamento(request),
                LocalDateTime.now().toString()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GenericResponse<Appuntamento>> aggiornaAppuntamento(@PathVariable Long id, @Valid @RequestBody AppuntamentoRequest request) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Appuntamento aggiornato",
                appuntamentoService.aggiornaAppuntamento(id, request),
                LocalDateTime.now().toString()
        ));
    }

    @PatchMapping("/{id}/stato")
    public ResponseEntity<GenericResponse<Appuntamento>> cambiaStato(@PathVariable Long id, @RequestParam StatoAppuntamento nuovoStato) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Stato appuntamento aggiornato",
                appuntamentoService.cambiaStato(id, nuovoStato),
                LocalDateTime.now().toString()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GenericResponse<String>> eliminaAppuntamento(@PathVariable Long id) {
        appuntamentoService.eliminaAppuntamento(id);
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Appuntamento annullato",
                "OK",
                LocalDateTime.now().toString()
        ));
    }
}
