package com.reserveme.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClienteRequest {

    @NotBlank(message = "Il nome è obbligatorio")
    private String nome;

    @NotBlank(message = "Il cognome è obbligatorio")
    private String cognome;

    @NotBlank(message = "Il telefono è obbligatorio")
    private String telefono;

    @Email(message = "Formato email non valido")
    private String email;

    private String note;
}
