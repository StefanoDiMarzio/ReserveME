package com.reserveme.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ServizioRequest {

    @NotBlank(message = "Il nome del trattamento è obbligatorio")
    private String nomeTrattamento;

    @NotNull(message = "Il costo è obbligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "Il costo deve essere maggiore o uguale a zero")
    private BigDecimal costo;

    @Min(value = 1, message = "La durata deve essere di almeno 1 minuto")
    private Integer durataMinuti;

    private String descrizione;

    private String infoAggiuntive;

    private Boolean attivo = true;
}
