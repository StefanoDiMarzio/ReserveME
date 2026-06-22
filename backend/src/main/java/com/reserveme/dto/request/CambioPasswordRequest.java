package com.reserveme.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CambioPasswordRequest {

    @NotBlank(message = "La vecchia password è obbligatoria")
    private String vecchiaPassword;

    @NotBlank(message = "La nuova password è obbligatoria")
    private String nuovaPassword;
}
