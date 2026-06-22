package com.reserveme.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "casse")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cassa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "negozio_id", unique = true, nullable = false)
    private Negozio negozio;

    @Column(name = "saldo_contanti", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal saldoContanti = BigDecimal.ZERO;

    @Column(name = "saldo_pos", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal saldoPos = BigDecimal.ZERO;

    @UpdateTimestamp
    @Column(name = "ultimo_aggiornamento", nullable = false)
    private LocalDateTime ultimoAggiornamento;

    @JsonIgnore
    @OneToMany(mappedBy = "cassa", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ChiusuraCassa> chiusure = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "cassa", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MovimentoCassa> movimenti = new ArrayList<>();
}
