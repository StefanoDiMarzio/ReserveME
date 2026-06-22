package com.reserveme.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ProfiloResponse {
    private UUID id;
    private String email;
    private String nome;
    private String cognome;
    private String telefono;
}
