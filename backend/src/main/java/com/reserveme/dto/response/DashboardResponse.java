package com.reserveme.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DashboardResponse {
    private long totaleClienti;
    private long clientiUltimoMese;
    private long clientiUltimaSettimana;
    private long clientiUltimoAnno;

    private long totaleScontrini;
    private long totaleFatture;

    private BigDecimal incassiTotali;
    private BigDecimal incassiUltimoMese;
    private BigDecimal incassiUltimaSettimana;
}
