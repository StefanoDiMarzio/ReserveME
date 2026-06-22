# 🔄 Diagrammi di Flusso — ReserveME

## 1. Registrazione e Login Amministratore

```mermaid
flowchart TD
    A([Inizio]) --> B[Amministratore accede alla pagina di registrazione]
    B --> C{È già registrato?}

    C -- No --> D[Compila form registrazione:<br/>Nome, Cognome, Email, Telefono,<br/>Password]
    D --> E[Sistema genera UUID e Codice Univoco]
    E --> F[Registrazione dati Negozio:<br/>Nome, Tipo, Indirizzo,<br/>P.IVA, Telefono]
    F --> G[Sistema crea Cassa associata al Negozio]
    G --> H[ Registrazione completata]
    H --> I[Redirect alla pagina di Login]

    C -- Sì --> I
    I --> J[Inserisce Codice Univoco + Password]
    J --> K{Credenziali valide?}
    K -- No --> L[Errore: credenziali non valide]
    L --> I
    K -- Sì --> M[Sistema genera token di sessione JWT]
    M --> N[ Redirect alla Dashboard]
    N --> O([Fine])
```

---

## 2. Gestione Appuntamenti

### 2.1 Creazione Appuntamento

```mermaid
flowchart TD
    A([Inizio]) --> B[Admin accede al Calendario]
    B --> C[Seleziona data e ora]
    C --> D{Cliente già registrato?}

    D -- No --> E[Crea nuovo Cliente:<br/>Nome, Cognome, Telefono]
    E --> F[Cliente salvato nel DB]
    F --> G[Seleziona Servizio dal Menu]

    D -- Sì --> G
    G --> H[Seleziona Cliente esistente]
    H --> I[Imposta data/ora inizio]
    I --> J[Sistema calcola data/ora fine<br/>in base alla durata del servizio]
    J --> K{Slot disponibile?}

    K -- No --> L[Conflitto: slot occupato]
    L --> M[Suggerisci slot alternativi]
    M --> I

    K -- Sì --> N[Aggiunge note opzionali]
    N --> O[Stato: CONFERMATO]
    O --> P[Appuntamento salvato]
    P --> Q[Aggiorna visualizzazione Calendario]
    Q --> R([Fine])
```

### 2.2 Modifica / Eliminazione Appuntamento

```mermaid
flowchart TD
    A([🚀 Inizio]) --> B[Admin visualizza Calendario]
    B --> C[Seleziona appuntamento esistente]
    C --> D{Quale azione?}

    D -- Modifica Data --> E[Seleziona nuova data/ora]
    E --> F{Nuovo slot disponibile?}
    F -- Sì --> G[Aggiorna data_ora_inizio e data_ora_fine]
    F -- No --> H[Conflitto: slot occupato]
    H --> E

    D -- Aggiungi Info --> I[Modifica note appuntamento]
    I --> G

    D -- Cambia Servizio --> J[Seleziona nuovo servizio]
    J --> G

    D -- Elimina --> K{Conferma eliminazione?}
    K -- No --> L[Annulla operazione]
    K -- Sì --> M[Stato → ANNULLATO]

    G --> N[Appuntamento aggiornato]
    M --> N
    L --> N
    N --> O[Aggiorna visualizzazione Calendario]
    O --> P([Fine])
```

---

## 3. Emissione Scontrino / Fattura

```mermaid
flowchart TD
    A([Inizio]) --> B[Admin completa un servizio<br/>o vende un prodotto]
    B --> C{Associato ad appuntamento?}

    C -- Sì --> D[Carica servizio dall appuntamento]
    C -- No --> E[Seleziona manualmente<br/>servizi e/o prodotti]

    D --> F[Componi voci scontrino]
    E --> F

    F --> G[Aggiungi voci:<br/>Servizi e/o Prodotti]
    G --> H[Sistema calcola totale]
    H --> I{Tipo documento?}

    I -- Scontrino --> J[Tipo: SCONTRINO]
    I -- Fattura --> K[Tipo: FATTURA<br/>Richiede dati fiscali cliente]

    J --> L{Metodo di pagamento?}
    K --> L

    L -- Contanti --> M[Importo contanti = totale]
    L -- POS --> N[Importo POS = totale]
    L -- Misto --> O[Specifica ripartizione<br/>contanti + POS]

    M --> P[Genera numero documento progressivo]
    N --> P
    O --> P

    P --> Q[Salva Scontrino con Voci]
    Q --> R[Registra Movimento Cassa<br/>tipo: ENTRATA]
    R --> S[Aggiorna saldo Cassa]
    S --> T{Venduti prodotti?}

    T -- Sì --> U[Aggiorna quantità Inventario<br/>quantità - venduta]
    T -- No --> V[Documento emesso]
    U --> V

    V --> W{Appuntamento associato?}
    W -- Sì --> X[Stato appuntamento → COMPLETATO]
    W -- No --> Y([Fine])
    X --> Y
```

---

## 4. Chiusura Cassa

```mermaid
flowchart TD
    A([Inizio]) --> B[Admin accede alla sezione Cassa]
    B --> C[Richiede Chiusura Cassa]
    C --> D[Sistema recupera tutti gli scontrini<br/>emessi dalla ultima chiusura]

    D --> E[Calcola totale contanti del periodo]
    E --> F[Calcola totale POS del periodo]
    F --> G[Calcola totale generale]
    G --> H[Conta numero scontrini emessi]
    H --> I[Conta numero fatture emesse]

    I --> J[Mostra riepilogo chiusura:<br/>• Totale contanti<br/>• Totale POS<br/>• Totale generale<br/>• N. scontrini<br/>• N. fatture]

    J --> K{Admin conferma chiusura?}

    K -- No --> L[Annulla operazione]
    L --> M([Fine])

    K -- Sì --> N[Admin aggiunge note opzionali]
    N --> O[Salva record CHIUSURA_CASSA]
    O --> P[Azzera saldi Cassa]
    P --> Q[Chiusura cassa completata]
    Q --> M
```

---

## 5. Gestione Inventario

```mermaid
flowchart TD
    A([Inizio]) --> B[Admin accede all Inventario]
    B --> C{Quale operazione?}

    C -- Aggiungi Prodotto --> D[Inserisci:<br/>Nome, Descrizione, Quantità,<br/>Prezzo Acquisto, Prezzo Vendita]
    D --> E[Sistema calcola ricarico %:<br/>prezzo_vendita - prezzo_acquisto<br/>/ prezzo_acquisto x 100]
    E --> F[Imposta soglia minima scorta]
    F --> G[Prodotto salvato]

    C -- Modifica Prodotto --> H[Seleziona prodotto]
    H --> I[Modifica campi desiderati]
    I --> J[Sistema ricalcola ricarico se necessario]
    J --> G

    C -- Carico Merce --> K[Seleziona prodotto]
    K --> L[Inserisci quantità da aggiungere]
    L --> M[quantità = quantità + carico]
    M --> G

    C -- Visualizza Scorte --> N[Lista prodotti con quantità]
    N --> O{Prodotti sotto soglia minima?}
    O -- Sì --> P[Evidenzia prodotti da riordinare]
    O -- No --> Q[Inventario nella norma]

    G --> R([Fine])
    P --> R
    Q --> R
```

---

## 6. Dashboard — Flusso Dati

```mermaid
flowchart TD
    A([Admin accede alla Dashboard]) --> B[Sistema carica dati aggregati]

    B --> C[Query: Totale clienti ricevuti]
    B --> D[Query: Scontrini e fatture]
    B --> E[Query: Incassi totali]

    C --> F{Filtro temporale?}
    F -- Totale --> G[COUNT clienti con appuntamento COMPLETATO]
    F -- Ultimo mese --> H[COUNT clienti ultimo mese]
    F -- Ultima settimana --> I[COUNT clienti ultima settimana]
    F -- Ultimo anno --> J[COUNT clienti ultimo anno]

    D --> K[Lista scontrini emessi con dettagli]
    D --> L[Lista fatture emesse con dettagli]

    E --> M[SUM totale scontrini per periodo]
    E --> N[SUM totale per metodo pagamento]

    G --> O[Renderizza Dashboard]
    H --> O
    I --> O
    J --> O
    K --> O
    L --> O
    M --> O
    N --> O

    O --> P([Fine])
```

---

## 7. Gestione Menu Servizi

```mermaid
flowchart TD
    A([🚀 Inizio]) --> B[Admin accede al Menu Servizi]
    B --> C{Quale operazione?}

    C -- Aggiungi Servizio --> D[Inserisci:<br/>Nome trattamento, Costo,<br/>Durata, Descrizione,<br/>Info aggiuntive]
    D --> E[Stato: attivo = true]
    E --> F[Servizio salvato nel menu]

    C -- Modifica Servizio --> G[Seleziona servizio esistente]
    G --> H[Modifica campi desiderati]
    H --> F

    C -- Disattiva Servizio --> I[Seleziona servizio]
    I --> J[attivo = false]
    J --> K[Servizio non visibile nel menu<br/>ma storico preservato]

    C -- Visualizza Menu --> L[Lista servizi attivi<br/>con prezzi e dettagli]

    F --> M([Fine])
    K --> M
    L --> M
```
