package com.reserveme.controller;

import com.reserveme.dto.response.GenericResponse;
import com.reserveme.dto.response.NegozioPubblicoResponse;
import com.reserveme.model.enums.TipoNegozio;
import com.reserveme.service.NegozioPubblicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/public/negozi")
@RequiredArgsConstructor
public class PublicNegozioController {

    private final NegozioPubblicoService negozioPubblicoService;

    @GetMapping("/cerca")
    public ResponseEntity<GenericResponse<Page<NegozioPubblicoResponse>>> cerca(
            @RequestParam(required = false) String testo,
            @RequestParam(required = false) TipoNegozio tipo,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Centri trovati",
                negozioPubblicoService.cerca(testo, tipo, lat, lng, page, size),
                LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GenericResponse<NegozioPubblicoResponse>> getDettaglio(@PathVariable Long id) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Dettaglio centro recuperato",
                negozioPubblicoService.getDettaglio(id),
                LocalDateTime.now().toString()
        ));
    }
}
