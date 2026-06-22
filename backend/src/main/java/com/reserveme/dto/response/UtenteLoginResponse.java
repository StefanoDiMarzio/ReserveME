package com.reserveme.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class UtenteLoginResponse {
    private String token;
    private UUID utenteId;
    private String email;
    private String nome;
    private String cognome;
}
