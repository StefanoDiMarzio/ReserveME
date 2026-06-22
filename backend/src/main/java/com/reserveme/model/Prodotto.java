package com.reserveme.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "prodotti")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prodotto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "negozio_id", nullable = false)
    private Negozio negozio;

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descrizione;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantita = 0;

    @Column(name = "prezzo_acquisto", nullable = false, precision = 10, scale = 2)
    private BigDecimal prezzoAcquisto;

    @Column(name = "prezzo_vendita", nullable = false, precision = 10, scale = 2)
    private BigDecimal prezzoVendita;

    @Column(name = "ricarico_percentuale", precision = 5, scale = 2)
    private BigDecimal ricaricoPercentuale;

    @Column(name = "soglia_minima")
    @Builder.Default
    private Integer sogliaMinima = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void calcolaRicarico() {
        if (prezzoAcquisto != null && prezzoVendita != null && prezzoAcquisto.compareTo(BigDecimal.ZERO) > 0) {
            this.ricaricoPercentuale = prezzoVendita.subtract(prezzoAcquisto)
                    .divide(prezzoAcquisto, 2, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }
    }
}
