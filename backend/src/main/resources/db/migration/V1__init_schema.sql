CREATE TABLE amministratori (
    id UUID PRIMARY KEY,
    codice_univoco VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE negozi (
    id BIGSERIAL PRIMARY KEY,
    admin_id UUID UNIQUE NOT NULL,
    nome VARCHAR(200) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    indirizzo VARCHAR(300),
    citta VARCHAR(100),
    cap VARCHAR(10),
    telefono VARCHAR(20),
    partita_iva VARCHAR(20) UNIQUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_negozio_admin FOREIGN KEY (admin_id) REFERENCES amministratori(id)
);

CREATE TABLE servizi (
    id BIGSERIAL PRIMARY KEY,
    negozio_id BIGINT NOT NULL,
    nome_trattamento VARCHAR(200) NOT NULL,
    costo NUMERIC(10, 2) NOT NULL,
    durata_minuti INT,
    descrizione TEXT,
    info_aggiuntive TEXT,
    attivo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_servizio_negozio FOREIGN KEY (negozio_id) REFERENCES negozi(id)
);

CREATE TABLE clienti (
    id BIGSERIAL PRIMARY KEY,
    negozio_id BIGINT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    note TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_cliente_negozio FOREIGN KEY (negozio_id) REFERENCES negozi(id)
);

CREATE TABLE appuntamenti (
    id BIGSERIAL PRIMARY KEY,
    negozio_id BIGINT NOT NULL,
    cliente_id BIGINT NOT NULL,
    servizio_id BIGINT NOT NULL,
    data_ora_inizio TIMESTAMP NOT NULL,
    data_ora_fine TIMESTAMP NOT NULL,
    stato VARCHAR(50) NOT NULL,
    note TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_appuntamento_negozio FOREIGN KEY (negozio_id) REFERENCES negozi(id),
    CONSTRAINT fk_appuntamento_cliente FOREIGN KEY (cliente_id) REFERENCES clienti(id),
    CONSTRAINT fk_appuntamento_servizio FOREIGN KEY (servizio_id) REFERENCES servizi(id)
);

CREATE TABLE prodotti (
    id BIGSERIAL PRIMARY KEY,
    negozio_id BIGINT NOT NULL,
    nome VARCHAR(200) NOT NULL,
    descrizione TEXT,
    quantita INT NOT NULL DEFAULT 0,
    prezzo_acquisto NUMERIC(10, 2) NOT NULL,
    prezzo_vendita NUMERIC(10, 2) NOT NULL,
    ricarico_percentuale NUMERIC(5, 2),
    soglia_minima INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_prodotto_negozio FOREIGN KEY (negozio_id) REFERENCES negozi(id)
);

CREATE TABLE casse (
    id BIGSERIAL PRIMARY KEY,
    negozio_id BIGINT UNIQUE NOT NULL,
    saldo_contanti NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    saldo_pos NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    ultimo_aggiornamento TIMESTAMP NOT NULL,
    CONSTRAINT fk_cassa_negozio FOREIGN KEY (negozio_id) REFERENCES negozi(id)
);

CREATE TABLE scontrini (
    id BIGSERIAL PRIMARY KEY,
    negozio_id BIGINT NOT NULL,
    cliente_id BIGINT,
    appuntamento_id BIGINT,
    numero_documento VARCHAR(50) NOT NULL,
    data_emissione TIMESTAMP NOT NULL,
    totale NUMERIC(10, 2) NOT NULL,
    metodo_pagamento VARCHAR(50) NOT NULL,
    tipo_documento VARCHAR(50) NOT NULL,
    stato VARCHAR(50) NOT NULL,
    importo_contanti NUMERIC(10, 2) DEFAULT 0.00,
    importo_pos NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_scontrino_negozio FOREIGN KEY (negozio_id) REFERENCES negozi(id),
    CONSTRAINT fk_scontrino_cliente FOREIGN KEY (cliente_id) REFERENCES clienti(id),
    CONSTRAINT fk_scontrino_appuntamento FOREIGN KEY (appuntamento_id) REFERENCES appuntamenti(id)
);

CREATE TABLE voci_scontrino (
    id BIGSERIAL PRIMARY KEY,
    scontrino_id BIGINT NOT NULL,
    servizio_id BIGINT,
    prodotto_id BIGINT,
    descrizione VARCHAR(300) NOT NULL,
    quantita INT NOT NULL DEFAULT 1,
    prezzo_unitario NUMERIC(10, 2) NOT NULL,
    subtotale NUMERIC(10, 2) NOT NULL,
    CONSTRAINT fk_voce_scontrino FOREIGN KEY (scontrino_id) REFERENCES scontrini(id),
    CONSTRAINT fk_voce_servizio FOREIGN KEY (servizio_id) REFERENCES servizi(id),
    CONSTRAINT fk_voce_prodotto FOREIGN KEY (prodotto_id) REFERENCES prodotti(id)
);

CREATE TABLE movimenti_cassa (
    id BIGSERIAL PRIMARY KEY,
    cassa_id BIGINT NOT NULL,
    scontrino_id BIGINT,
    tipo VARCHAR(50) NOT NULL,
    metodo VARCHAR(50) NOT NULL,
    importo NUMERIC(10, 2) NOT NULL,
    data TIMESTAMP NOT NULL,
    descrizione VARCHAR(255),
    CONSTRAINT fk_movimento_cassa FOREIGN KEY (cassa_id) REFERENCES casse(id),
    CONSTRAINT fk_movimento_scontrino FOREIGN KEY (scontrino_id) REFERENCES scontrini(id)
);

CREATE TABLE chiusure_cassa (
    id BIGSERIAL PRIMARY KEY,
    cassa_id BIGINT NOT NULL,
    data_chiusura TIMESTAMP NOT NULL,
    totale_contanti NUMERIC(10, 2) NOT NULL,
    totale_pos NUMERIC(10, 2) NOT NULL,
    totale_generale NUMERIC(10, 2) NOT NULL,
    num_scontrini INT NOT NULL,
    num_fatture INT NOT NULL,
    note TEXT,
    CONSTRAINT fk_chiusura_cassa FOREIGN KEY (cassa_id) REFERENCES casse(id)
);
