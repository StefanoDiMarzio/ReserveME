package com.reserveme.controller;

import com.reserveme.dto.request.ScontrinoRequest;
import com.reserveme.dto.response.GenericResponse;
import com.reserveme.model.Scontrino;
import com.reserveme.service.ScontrinoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;


@RestController
@RequestMapping("/api/scontrini")
@RequiredArgsConstructor
public class ScontrinoController {

    private final ScontrinoService scontrinoService;

    @GetMapping
    public ResponseEntity<GenericResponse<Page<Scontrino>>> getScontrini(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Scontrini/Fatture recuperati",
                scontrinoService.getScontrini(PageRequest.of(page, size)),
                LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GenericResponse<Scontrino>> getScontrino(@PathVariable Long id) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Documento recuperato",
                scontrinoService.getScontrino(id),
                LocalDateTime.now().toString()
        ));
    }

    @PostMapping
    public ResponseEntity<GenericResponse<Scontrino>> emettiScontrino(@Valid @RequestBody ScontrinoRequest request) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Documento emesso con successo",
                scontrinoService.emettiScontrino(request),
                LocalDateTime.now().toString()
        ));
    }

    @PatchMapping("/{id}/annulla")
    public ResponseEntity<GenericResponse<Scontrino>> annullaScontrino(@PathVariable Long id) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Documento annullato",
                scontrinoService.annullaScontrino(id),
                LocalDateTime.now().toString()
        ));
    }
}
