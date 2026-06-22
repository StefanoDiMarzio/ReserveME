# Avvio del progetto

## Prerequisiti

- Java 21
- Node.js (versione LTS recente) e npm
- PostgreSQL in esecuzione in locale (porta 5432)
- Per testare l'app mobile su smartphone: Expo Go installato sul telefono, sulla stessa rete locale del PC

Non serve installare Maven: il progetto include il Maven Wrapper (`mvnw` / `mvnw.cmd`).

## Setup da zero (es. dopo un git clone su un nuovo PC)

### 1. Database PostgreSQL

Aprire pgAdmin (o `psql`) connessi come utente `postgres` ed eseguire:

```sql
CREATE DATABASE reserveme;
CREATE ROLE reserveme_user WITH LOGIN PASSWORD 'reserveme_pass';
GRANT ALL PRIVILEGES ON DATABASE reserveme TO reserveme_user;
```

Poi connettersi al database `reserveme` appena creato (non più a `postgres`) ed eseguire:

```sql
GRANT ALL ON SCHEMA public TO reserveme_user;
```

Il database deve restare vuoto: le tabelle vengono create automaticamente da Flyway al primo avvio del backend.

Se si usano credenziali o porta diverse, aggiornare `backend/src/main/resources/application.properties` (`spring.datasource.*`).

### 2. Backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Al primo avvio scarica le dipendenze (può richiedere qualche minuto) e crea automaticamente lo schema del database con dati di esempio (5 negozi con servizi). Resta in ascolto su `http://localhost:8080`.

Variabili d'ambiente opzionali:

- `GOOGLE_MAPS_API_KEY` — chiave Google Geocoding API, usata per calcolare le coordinate dei negozi alla registrazione. Senza, i negozi vengono salvati comunque ma senza coordinate.

### 3. App mobile (Expo)

```powershell
cd mobile
npm install
```

Creare il file `mobile/.env` con l'indirizzo IP locale del PC che esegue il backend (necessario perché da telefono `localhost` non è raggiungibile):

```
EXPO_PUBLIC_API_URL=http://<IP-LAN-DEL-PC>:8080
```

Per trovare l'IP LAN: `ipconfig` (Windows), guardare "Indirizzo IPv4" della rete attiva.

Avvio:

```powershell
npx expo start --lan
```

Dal telefono (stessa rete locale, anche se il PC è collegato via cavo basta che sia lo stesso router del WiFi del telefono): aprire Safari (iOS) o il browser e visitare `exp://<IP-LAN-DEL-PC>:8081`, oppure scansionare il QR code mostrato nel terminale con l'app Expo Go.

Nota: la visualizzazione a mappa richiede una build di sviluppo EAS con chiave Google Maps per funzionare in modo completo su entrambe le piattaforme; senza configurazione aggiuntiva su iOS viene usato automaticamente Apple Maps (nessuna chiave richiesta, funziona anche in Expo Go).

### 4. Backoffice web (admin-web)

```powershell
cd admin-web
npm install
npm run dev
```

Apre il pannello su `http://localhost:5173`, già configurato per parlare con il backend su `http://localhost:8080` (nessuna configurazione aggiuntiva necessaria se eseguito sullo stesso PC).

## Avvio rapido (progetto già configurato)

Tre terminali separati, dalla cartella del progetto:

```powershell
cd backend; .\mvnw.cmd spring-boot:run
```

```powershell
cd admin-web; npm run dev
```

```powershell
cd mobile; npx expo start --lan
```

Nessun ordine obbligatorio, ma conviene avviare prima il backend.

## Credenziali di test

Cinque negozi di esempio, tutti con password `password123`:

| Codice univoco | Negozio | Città |
|---|---|---|
| `ADMIN123` | Barberia Rossi | Milano |
| `ADMIN456` | Centro Estetico Bellavita | Milano |
| `ADMIN789` | Parrucchiere Stile & Colore | Roma |
| `ADMIN101` | Centro Massaggi Zen | Torino |
| `ADMIN202` | Barberia Napoli Vintage | Napoli |

Per l'app mobile cliente: registrare un nuovo account direttamente dalla schermata di registrazione.
