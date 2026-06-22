package com.reserveme.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AggiornaProfiloRequest {

    @NotBlank(message = "Il nome è obbligatorio")
    private String nome;

    @NotBlank(message = "Il cognome è obbligatorio")
    private String cognome;

    private String telefono;
}
