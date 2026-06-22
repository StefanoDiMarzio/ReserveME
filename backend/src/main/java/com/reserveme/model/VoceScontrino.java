package com.reserveme.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "voci_scontrino")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoceScontrino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scontrino_id", nullable = false)
    private Scontrino scontrino;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servizio_id")
    private Servizio servizio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prodotto_id")
    private Prodotto prodotto;

    @Column(nullable = false, length = 300)
    private String descrizione;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantita = 1;

    @Column(name = "prezzo_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal prezzoUnitario;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotale;
}
