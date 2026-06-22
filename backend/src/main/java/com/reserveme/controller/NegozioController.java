package com.reserveme.controller;

import com.reserveme.dto.response.GenericResponse;
import com.reserveme.model.Negozio;
import com.reserveme.service.NegozioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/negozio")
@RequiredArgsConstructor
public class NegozioController {

    private final NegozioService negozioService;

    @GetMapping
    public ResponseEntity<GenericResponse<Negozio>> getNegozio() {
        Negozio negozio = negozioService.getNegozioAttuale();
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Dati negozio recuperati con successo",
                negozio,
                LocalDateTime.now().toString()
        ));
    }
}
