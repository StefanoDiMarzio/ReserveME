package com.reserveme.dto.request;

import com.reserveme.model.enums.MetodoPagamento;
import com.reserveme.model.enums.TipoDocumento;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ScontrinoRequest {

    private Long clienteId;

    private Long appuntamentoId;

    @NotNull(message = "Il metodo di pagamento è obbligatorio")
    private MetodoPagamento metodoPagamento;

    @NotNull(message = "Il tipo di documento è obbligatorio")
    private TipoDocumento tipoDocumento;

    private BigDecimal importoContanti;

    private BigDecimal importoPos;

    @NotEmpty(message = "Lo scontrino deve avere almeno una voce")
    @Valid
    private List<VoceScontrinoRequest> voci;
}
