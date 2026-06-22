package com.reserveme.dto.response;

import com.reserveme.model.enums.TipoNegozio;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NegozioPubblicoResponse {
    private Long id;
    private String nome;
    private TipoNegozio tipo;
    private String indirizzo;
    private String citta;
    private String cap;
    private String telefono;
    private BigDecimal latitudine;
    private BigDecimal longitudine;
    private Double distanzaKm;
    private List<ServizioPubblicoResponse> servizi;
}
