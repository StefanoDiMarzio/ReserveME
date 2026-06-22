package com.reserveme.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class VoceScontrinoRequest {

    private Long servizioId;

    private Long prodottoId;

    private String descrizione;

    private Integer quantita = 1;

    private BigDecimal prezzoUnitario;
}
