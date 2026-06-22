package com.reserveme.controller;

import com.reserveme.dto.request.ChiusuraCassaRequest;
import com.reserveme.dto.response.GenericResponse;
import com.reserveme.model.Cassa;
import com.reserveme.model.ChiusuraCassa;
import com.reserveme.model.MovimentoCassa;
import com.reserveme.service.CassaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/cassa")
@RequiredArgsConstructor
public class CassaController {

    private final CassaService cassaService;

    @GetMapping
    public ResponseEntity<GenericResponse<Cassa>> getCassa() {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Stato cassa recuperato",
                cassaService.getCassaAttuale(),
                LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/movimenti")
    public ResponseEntity<GenericResponse<List<MovimentoCassa>>> getMovimenti() {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Movimenti cassa recuperati",
                cassaService.getStoricoMovimenti(),
                LocalDateTime.now().toString()
        ));
    }

    @PostMapping("/chiusura")
    public ResponseEntity<GenericResponse<ChiusuraCassa>> effettuaChiusura(@Valid @RequestBody ChiusuraCassaRequest request) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Chiusura cassa effettuata con successo",
                cassaService.effettuaChiusura(request),
                LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/chiusure")
    public ResponseEntity<GenericResponse<List<ChiusuraCassa>>> getChiusure() {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Storico chiusure cassa recuperato",
                cassaService.getStoricoChiusure(),
                LocalDateTime.now().toString()
        ));
    }
}
