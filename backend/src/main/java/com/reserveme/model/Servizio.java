package com.reserveme.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "servizi")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Servizio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "negozio_id", nullable = false)
    private Negozio negozio;

    @Column(name = "nome_trattamento", nullable = false, length = 200)
    private String nomeTrattamento;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal costo;

    @Column(name = "durata_minuti")
    private Integer durataMinuti;

    @Column(columnDefinition = "TEXT")
    private String descrizione;

    @Column(name = "info_aggiuntive", columnDefinition = "TEXT")
    private String infoAggiuntive;

    @Column(nullable = false)
    @Builder.Default
    private Boolean attivo = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
