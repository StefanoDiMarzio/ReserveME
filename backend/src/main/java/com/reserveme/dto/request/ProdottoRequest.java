package com.reserveme.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProdottoRequest {

    @NotBlank(message = "Il nome del prodotto è obbligatorio")
    private String nome;

    private String descrizione;

    @NotNull(message = "La quantità è obbligatoria")
    @Min(value = 0, message = "La quantità non può essere negativa")
    private Integer quantita;

    @NotNull(message = "Il prezzo di acquisto è obbligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "Il prezzo di acquisto deve essere maggiore o uguale a zero")
    private BigDecimal prezzoAcquisto;

    @NotNull(message = "Il prezzo di vendita è obbligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "Il prezzo di vendita deve essere maggiore o uguale a zero")
    private BigDecimal prezzoVendita;

    @Min(value = 0, message = "La soglia minima non può essere negativa")
    private Integer sogliaMinima;
}
