package com.reserveme.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.reserveme.model.enums.TipoNegozio;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "negozi")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Negozio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", unique = true, nullable = false)
    private Amministratore amministratore;

    @Column(nullable = false, length = 200)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoNegozio tipo;

    @Column(length = 300)
    private String indirizzo;

    @Column(length = 100)
    private String citta;

    @Column(length = 10)
    private String cap;

    @Column(length = 20)
    private String telefono;

    @Column(name = "partita_iva", unique = true, length = 20)
    private String partitaIva;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitudine;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitudine;

    @JsonIgnore
    @OneToMany(mappedBy = "negozio", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Servizio> servizi = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "negozio", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Cliente> clienti = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "negozio", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Appuntamento> appuntamenti = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "negozio", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Prodotto> prodotti = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "negozio", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Scontrino> scontrini = new ArrayList<>();

    @JsonIgnore
    @OneToOne(mappedBy = "negozio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Cassa cassa;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
