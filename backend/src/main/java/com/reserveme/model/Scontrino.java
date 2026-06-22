package com.reserveme.model;

import com.reserveme.model.enums.MetodoPagamento;
import com.reserveme.model.enums.StatoDocumento;
import com.reserveme.model.enums.TipoDocumento;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "scontrini")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Scontrino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "negozio_id", nullable = false)
    private Negozio negozio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appuntamento_id")
    private Appuntamento appuntamento;

    @Column(name = "numero_documento", nullable = false, length = 50)
    private String numeroDocumento;

    @Column(name = "data_emissione", nullable = false)
    private LocalDateTime dataEmissione;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totale;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pagamento", nullable = false)
    private MetodoPagamento metodoPagamento;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento", nullable = false)
    private TipoDocumento tipoDocumento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatoDocumento stato = StatoDocumento.EMESSO;

    @Column(name = "importo_contanti", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal importoContanti = BigDecimal.ZERO;

    @Column(name = "importo_pos", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal importoPos = BigDecimal.ZERO;

    @OneToMany(mappedBy = "scontrino", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<VoceScontrino> voci = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
