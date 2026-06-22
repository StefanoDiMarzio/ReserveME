package com.reserveme.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServizioPubblicoResponse {
    private Long id;
    private String nomeTrattamento;
    private BigDecimal costo;
    private Integer durataMinuti;
    private String descrizione;
}
