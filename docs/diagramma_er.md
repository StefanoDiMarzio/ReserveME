# 📊 Diagramma ER — ReserveME

## Panoramica Entità

Il database è progettato per gestire un sistema multi-tenant dove ogni **Amministratore** possiede un **Negozio** con i propri servizi, clienti, appuntamenti, inventario e gestione cassa.

---

## Diagramma Entità-Relazione

```mermaid
erDiagram

    AMMINISTRATORE {
        UUID id PK "Identificativo univoco"
        VARCHAR codice_univoco UK "Codice di accesso univoco"
        VARCHAR password "Password hashata"
        VARCHAR nome "Nome amministratore"
        VARCHAR cognome "Cognome amministratore"
        VARCHAR email "Email"
        VARCHAR telefono "Telefono"
        TIMESTAMP created_at "Data creazione"
        TIMESTAMP updated_at "Data ultimo aggiornamento"
    }

    NEGOZIO {
        SERIAL id PK "Identificativo negozio"
        UUID admin_id FK "Riferimento amministratore"
        VARCHAR nome "Nome attività"
        ENUM tipo "CENTRO_ESTETICO | BARBERIA | PARRUCCHIERE | CENTRO_MASSAGGI"
        VARCHAR indirizzo "Indirizzo"
        VARCHAR citta "Città"
        VARCHAR cap "CAP"
        VARCHAR telefono "Telefono negozio"
        VARCHAR partita_iva "Partita IVA"
        TIMESTAMP created_at "Data creazione"
        TIMESTAMP updated_at "Data ultimo aggiornamento"
    }

    SERVIZIO {
        SERIAL id PK "Identificativo servizio"
        INT negozio_id FK "Riferimento negozio"
        VARCHAR nome_trattamento "Nome del trattamento"
        DECIMAL costo "Costo del servizio"
        INT durata_minuti "Durata stimata in minuti"
        TEXT descrizione "Descrizione del servizio"
        TEXT info_aggiuntive "Informazioni aggiuntive"
        BOOLEAN attivo "Servizio attivo o disattivato"
        TIMESTAMP created_at "Data creazione"
        TIMESTAMP updated_at "Data ultimo aggiornamento"
    }

    CLIENTE {
        SERIAL id PK "Identificativo cliente"
        INT negozio_id FK "Riferimento negozio"
        VARCHAR nome "Nome cliente"
        VARCHAR cognome "Cognome cliente"
        VARCHAR telefono "Numero di telefono"
        VARCHAR email "Email (opzionale)"
        TEXT note "Note sul cliente"
        TIMESTAMP created_at "Data creazione"
        TIMESTAMP updated_at "Data ultimo aggiornamento"
    }

    APPUNTAMENTO {
        SERIAL id PK "Identificativo appuntamento"
        INT negozio_id FK "Riferimento negozio"
        INT cliente_id FK "Riferimento cliente"
        INT servizio_id FK "Riferimento servizio"
        TIMESTAMP data_ora_inizio "Data e ora inizio"
        TIMESTAMP data_ora_fine "Data e ora fine"
        ENUM stato "CONFERMATO | IN_ATTESA | COMPLETATO | ANNULLATO"
        TEXT note "Note appuntamento"
        TIMESTAMP created_at "Data creazione"
        TIMESTAMP updated_at "Data ultimo aggiornamento"
    }

    PRODOTTO {
        SERIAL id PK "Identificativo prodotto"
        INT negozio_id FK "Riferimento negozio"
        VARCHAR nome "Nome prodotto"
        TEXT descrizione "Descrizione"
        INT quantita "Quantità in magazzino"
        DECIMAL prezzo_acquisto "Prezzo di acquisto"
        DECIMAL prezzo_vendita "Prezzo di vendita"
        DECIMAL ricarico_percentuale "Percentuale di ricarico"
        INT soglia_minima "Soglia scorta minima"
        TIMESTAMP created_at "Data creazione"
        TIMESTAMP updated_at "Data ultimo aggiornamento"
    }

    SCONTRINO {
        SERIAL id PK "Identificativo scontrino"
        INT negozio_id FK "Riferimento negozio"
        INT cliente_id FK "Riferimento cliente (opzionale)"
        INT appuntamento_id FK "Riferimento appuntamento (opzionale)"
        VARCHAR numero_documento "Numero progressivo scontrino/fattura"
        TIMESTAMP data_emissione "Data e ora emissione"
        DECIMAL totale "Totale documento"
        ENUM metodo_pagamento "CONTANTI | POS | MISTO"
        ENUM tipo_documento "SCONTRINO | FATTURA"
        ENUM stato "EMESSO | ANNULLATO"
        DECIMAL importo_contanti "Importo pagato in contanti"
        DECIMAL importo_pos "Importo pagato con POS"
        TIMESTAMP created_at "Data creazione"
    }

    VOCE_SCONTRINO {
        SERIAL id PK "Identificativo voce"
        INT scontrino_id FK "Riferimento scontrino"
        INT servizio_id FK "Riferimento servizio (opzionale)"
        INT prodotto_id FK "Riferimento prodotto (opzionale)"
        VARCHAR descrizione "Descrizione voce"
        INT quantita "Quantità"
        DECIMAL prezzo_unitario "Prezzo unitario"
        DECIMAL subtotale "Subtotale voce"
    }

    CASSA {
        SERIAL id PK "Identificativo cassa"
        INT negozio_id FK "Riferimento negozio (unico)"
        DECIMAL saldo_contanti "Saldo contanti attuale"
        DECIMAL saldo_pos "Saldo POS attuale"
        TIMESTAMP ultimo_aggiornamento "Ultimo aggiornamento saldo"
    }

    CHIUSURA_CASSA {
        SERIAL id PK "Identificativo chiusura"
        INT cassa_id FK "Riferimento cassa"
        TIMESTAMP data_chiusura "Data e ora chiusura"
        DECIMAL totale_contanti "Totale incassato contanti"
        DECIMAL totale_pos "Totale incassato POS"
        DECIMAL totale_generale "Totale generale"
        INT num_scontrini "Numero scontrini emessi"
        INT num_fatture "Numero fatture emesse"
        TEXT note "Note chiusura"
        TIMESTAMP created_at "Data creazione"
    }

    MOVIMENTO_CASSA {
        SERIAL id PK "Identificativo movimento"
        INT cassa_id FK "Riferimento cassa"
        ENUM tipo "ENTRATA | USCITA"
        ENUM metodo "CONTANTI | POS"
        DECIMAL importo "Importo movimento"
        VARCHAR descrizione "Descrizione movimento"
        INT scontrino_id FK "Riferimento scontrino (opzionale)"
        TIMESTAMP data "Data e ora movimento"
    }

    %% ═══════════════════════════════════════
    %% RELAZIONI
    %% ═══════════════════════════════════════

    AMMINISTRATORE ||--o| NEGOZIO : "possiede"
    NEGOZIO ||--o{ SERVIZIO : "offre"
    NEGOZIO ||--o{ CLIENTE : "ha"
    NEGOZIO ||--o{ APPUNTAMENTO : "gestisce"
    NEGOZIO ||--o{ PRODOTTO : "ha in inventario"
    NEGOZIO ||--o{ SCONTRINO : "emette"
    NEGOZIO ||--|| CASSA : "ha"

    CLIENTE ||--o{ APPUNTAMENTO : "prenota"
    SERVIZIO ||--o{ APPUNTAMENTO : "richiesto in"

    CLIENTE ||--o{ SCONTRINO : "riceve"
    APPUNTAMENTO ||--o| SCONTRINO : "genera"

    SCONTRINO ||--o{ VOCE_SCONTRINO : "contiene"
    SERVIZIO ||--o{ VOCE_SCONTRINO : "incluso in"
    PRODOTTO ||--o{ VOCE_SCONTRINO : "venduto in"

    CASSA ||--o{ CHIUSURA_CASSA : "registra"
    CASSA ||--o{ MOVIMENTO_CASSA : "traccia"
    SCONTRINO ||--o| MOVIMENTO_CASSA : "genera"
```

---

## Legenda Relazioni

| Relazione | Tipo | Descrizione |
|---|---|---|
| `AMMINISTRATORE → NEGOZIO` | 1:1 | Ogni admin possiede **un** negozio |
| `NEGOZIO → SERVIZIO` | 1:N | Un negozio offre **molti** servizi (menu) |
| `NEGOZIO → CLIENTE` | 1:N | Un negozio ha **molti** clienti |
| `NEGOZIO → APPUNTAMENTO` | 1:N | Un negozio gestisce **molti** appuntamenti |
| `NEGOZIO → PRODOTTO` | 1:N | Un negozio ha **molti** prodotti in inventario |
| `NEGOZIO → SCONTRINO` | 1:N | Un negozio emette **molti** scontrini/fatture |
| `NEGOZIO → CASSA` | 1:1 | Ogni negozio ha **una** cassa |
| `CLIENTE → APPUNTAMENTO` | 1:N | Un cliente può avere **molti** appuntamenti |
| `SERVIZIO → APPUNTAMENTO` | 1:N | Un servizio può essere richiesto in **molti** appuntamenti |
| `SCONTRINO → VOCE_SCONTRINO` | 1:N | Uno scontrino contiene **molte** voci |
| `CASSA → CHIUSURA_CASSA` | 1:N | Una cassa registra **molte** chiusure |
| `CASSA → MOVIMENTO_CASSA` | 1:N | Una cassa traccia **molti** movimenti |

---

## Note di Progettazione

1. **Multi-tenancy**: Ogni entità è legata al `negozio_id`, garantendo isolamento dei dati tra amministratori diversi
2. **Soft Delete**: Lo stato `ANNULLATO` negli scontrini e appuntamenti permette di mantenere lo storico senza eliminare dati
3. **Ricarico**: Il campo `ricarico_percentuale` nei prodotti viene calcolato come `((prezzo_vendita - prezzo_acquisto) / prezzo_acquisto) * 100`
4. **Pagamenti Misti**: Lo scontrino supporta pagamenti parte contanti e parte POS tramite i campi `importo_contanti` e `importo_pos`
5. **Tracciabilità**: I `MOVIMENTO_CASSA` tracciano ogni entrata/uscita per ricostruire lo storico della cassa in qualsiasi momento
