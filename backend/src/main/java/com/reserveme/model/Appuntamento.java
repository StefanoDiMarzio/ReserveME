package com.reserveme.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.reserveme.model.enums.StatoAppuntamento;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "appuntamenti")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appuntamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "negozio_id", nullable = false)
    private Negozio negozio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servizio_id", nullable = false)
    private Servizio servizio;

    @Column(name = "data_ora_inizio", nullable = false)
    private LocalDateTime dataOraInizio;

    @Column(name = "data_ora_fine", nullable = false)
    private LocalDateTime dataOraFine;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatoAppuntamento stato = StatoAppuntamento.CONFERMATO;

    @Column(columnDefinition = "TEXT")
    private String note;

    @JsonIgnore
    @OneToOne(mappedBy = "appuntamento", fetch = FetchType.LAZY)
    private Scontrino scontrino;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
