package com.reserveme.controller;

import com.reserveme.dto.request.PrenotazioneRequest;
import com.reserveme.dto.response.GenericResponse;
import com.reserveme.dto.response.PrenotazioneResponse;
import com.reserveme.dto.response.SlotDisponibileResponse;
import com.reserveme.service.PrenotazioneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/app/prenotazioni")
@RequiredArgsConstructor
public class PrenotazioneController {

    private final PrenotazioneService prenotazioneService;

    @GetMapping("/slot")
    public ResponseEntity<GenericResponse<List<SlotDisponibileResponse>>> getSlotDisponibili(
            @RequestParam Long negozioId,
            @RequestParam Long servizioId,
            @RequestParam String data) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Slot disponibili recuperati",
                prenotazioneService.getSlotDisponibili(negozioId, servizioId, LocalDate.parse(data)),
                LocalDateTime.now().toString()
        ));
    }

    @PostMapping
    public ResponseEntity<GenericResponse<PrenotazioneResponse>> creaPrenotazione(@Valid @RequestBody PrenotazioneRequest request) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Prenotazione creata",
                prenotazioneService.creaPrenotazione(request),
                LocalDateTime.now().toString()
        ));
    }

    @GetMapping
    public ResponseEntity<GenericResponse<List<PrenotazioneResponse>>> getMiePrenotazioni() {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Prenotazioni recuperate",
                prenotazioneService.getMiePrenotazioni(),
                LocalDateTime.now().toString()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GenericResponse<String>> cancellaPrenotazione(@PathVariable Long id) {
        prenotazioneService.cancellaPrenotazione(id);
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Prenotazione annullata",
                "OK",
                LocalDateTime.now().toString()
        ));
    }
}
