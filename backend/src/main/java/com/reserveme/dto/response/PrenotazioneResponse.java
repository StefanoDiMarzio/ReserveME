package com.reserveme.dto.response;

import com.reserveme.model.enums.StatoAppuntamento;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrenotazioneResponse {
    private Long id;
    private Long negozioId;
    private String nomeNegozio;
    private String nomeServizio;
    private BigDecimal prezzo;
    private LocalDateTime dataOraInizio;
    private LocalDateTime dataOraFine;
    private StatoAppuntamento stato;
    private String note;
}
