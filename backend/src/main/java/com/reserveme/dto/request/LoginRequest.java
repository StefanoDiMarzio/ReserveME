package com.reserveme.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Il codice univoco è obbligatorio")
    private String codiceUnivoco;

    @NotBlank(message = "La password è obbligatoria")
    private String password;
}
