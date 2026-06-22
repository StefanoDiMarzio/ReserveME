package com.reserveme.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PrenotazioneRequest {

    @NotNull(message = "Il negozio è obbligatorio")
    private Long negozioId;

    @NotNull(message = "Il servizio è obbligatorio")
    private Long servizioId;

    @NotNull(message = "La data e ora di inizio sono obbligatorie")
    @FutureOrPresent(message = "L'appuntamento non può essere nel passato")
    private LocalDateTime dataOraInizio;

    private String note;
}
