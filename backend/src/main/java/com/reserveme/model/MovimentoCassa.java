package com.reserveme.model;

import com.reserveme.model.enums.MetodoPagamento;
import com.reserveme.model.enums.TipoMovimento;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimenti_cassa")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimentoCassa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cassa_id", nullable = false)
    private Cassa cassa;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoMovimento tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MetodoPagamento metodo;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal importo;

    @Column(length = 300)
    private String descrizione;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scontrino_id")
    private Scontrino scontrino;

    @Column(nullable = false)
    private LocalDateTime data;
}
