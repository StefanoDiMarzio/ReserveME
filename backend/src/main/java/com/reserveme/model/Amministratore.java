package com.reserveme.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "amministratori")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Amministratore {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "codice_univoco", unique = true, nullable = false, length = 50)
    private String codiceUnivoco;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 100)
    private String cognome;

    @Column(unique = true, nullable = false, length = 150)
    private String email;

    @Column(length = 20)
    private String telefono;

    @JsonIgnore
    @OneToOne(mappedBy = "amministratore", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Negozio negozio;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
