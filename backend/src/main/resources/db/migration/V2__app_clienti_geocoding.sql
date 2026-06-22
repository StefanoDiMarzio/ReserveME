CREATE TABLE utenti (
    id UUID PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

ALTER TABLE negozi
    ADD COLUMN latitudine NUMERIC(10, 7),
    ADD COLUMN longitudine NUMERIC(10, 7);

ALTER TABLE clienti
    ADD COLUMN utente_id UUID,
    ADD CONSTRAINT fk_cliente_utente FOREIGN KEY (utente_id) REFERENCES utenti(id),
    ADD CONSTRAINT uq_cliente_negozio_utente UNIQUE (negozio_id, utente_id);

CREATE INDEX idx_clienti_utente_id ON clienti(utente_id);
