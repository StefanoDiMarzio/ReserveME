package com.reserveme.dto.request;

import com.reserveme.model.enums.TipoNegozio;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegistrazioneRequest {

    @NotBlank(message = "Il nome è obbligatorio")
    private String nomeAdmin;

    @NotBlank(message = "Il cognome è obbligatorio")
    private String cognomeAdmin;

    @NotBlank(message = "L'email è obbligatoria")
    @Email(message = "Formato email non valido")
    private String emailAdmin;

    private String telefonoAdmin;

    @NotBlank(message = "La password è obbligatoria")
    private String password;

    // Dati Negozio
    @NotBlank(message = "Il nome del negozio è obbligatorio")
    private String nomeNegozio;

    @NotNull(message = "Il tipo di negozio è obbligatorio")
    private TipoNegozio tipoNegozio;

    private String indirizzoNegozio;
    private String cittaNegozio;
    private String capNegozio;
    private String telefonoNegozio;

    @NotBlank(message = "La partita IVA è obbligatoria")
    private String partitaIva;
}
