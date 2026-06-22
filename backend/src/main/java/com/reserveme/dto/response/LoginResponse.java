package com.reserveme.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String token;
    private String codiceUnivoco;
    private String nome;
    private String cognome;
    private String email;
    private Long negozioId;
    private String nomeNegozio;
}
