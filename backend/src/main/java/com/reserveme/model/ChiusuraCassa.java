package com.reserveme.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "chiusure_cassa")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChiusuraCassa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cassa_id", nullable = false)
    private Cassa cassa;

    @Column(name = "data_chiusura", nullable = false)
    private LocalDateTime dataChiusura;

    @Column(name = "totale_contanti", nullable = false, precision = 10, scale = 2)
    private BigDecimal totaleContanti;

    @Column(name = "totale_pos", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalePos;

    @Column(name = "totale_generale", nullable = false, precision = 10, scale = 2)
    private BigDecimal totaleGenerale;

    @Column(name = "num_scontrini")
    @Builder.Default
    private Integer numScontrini = 0;

    @Column(name = "num_fatture")
    @Builder.Default
    private Integer numFatture = 0;

    @Column(columnDefinition = "TEXT")
    private String note;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
