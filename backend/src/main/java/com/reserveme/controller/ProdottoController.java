package com.reserveme.controller;

import com.reserveme.dto.request.ProdottoRequest;
import com.reserveme.dto.response.GenericResponse;
import com.reserveme.model.Prodotto;
import com.reserveme.service.ProdottoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/prodotti")
@RequiredArgsConstructor
public class ProdottoController {

    private final ProdottoService prodottoService;

    @GetMapping
    public ResponseEntity<GenericResponse<Page<Prodotto>>> getInventario(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Inventario recuperato",
                prodottoService.getInventario(PageRequest.of(page, size)),
                LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/sotto-soglia")
    public ResponseEntity<GenericResponse<List<Prodotto>>> getProdottiSottoSoglia() {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Prodotti in esaurimento recuperati",
                prodottoService.getProdottiSottoSoglia(),
                LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GenericResponse<Prodotto>> getProdotto(@PathVariable Long id) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Prodotto recuperato",
                prodottoService.getProdotto(id),
                LocalDateTime.now().toString()
        ));
    }

    @PostMapping
    public ResponseEntity<GenericResponse<Prodotto>> creaProdotto(@Valid @RequestBody ProdottoRequest request) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Prodotto creato",
                prodottoService.creaProdotto(request),
                LocalDateTime.now().toString()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GenericResponse<Prodotto>> aggiornaProdotto(@PathVariable Long id, @Valid @RequestBody ProdottoRequest request) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Prodotto aggiornato",
                prodottoService.aggiornaProdotto(id, request),
                LocalDateTime.now().toString()
        ));
    }

    @PatchMapping("/{id}/carico")
    public ResponseEntity<GenericResponse<Prodotto>> aggiungiCarico(@PathVariable Long id, @RequestParam int quantita) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Carico merce effettuato",
                prodottoService.aggiungiCarico(id, quantita),
                LocalDateTime.now().toString()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GenericResponse<String>> eliminaProdotto(@PathVariable Long id) {
        prodottoService.eliminaProdotto(id);
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Prodotto eliminato",
                "OK",
                LocalDateTime.now().toString()
        ));
    }
}
