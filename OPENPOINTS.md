# BookScoutPro - Punti Aperti (Open Points)

Questo file traccia lo stato di avanzamento del progetto, le attività completate e i prossimi passi per avere un punto fermo da cui ripartire ad ogni sessione.

## ✅ Attività Completate (Fatte)

### 1. Sistema di Routing e Pagine Pubbliche
- [x] Separazione delle sezioni pubbliche in pagine dedicate al posto di un'unica `HomePage`.
- [x] Creazione di `CatalogPage` (`/catalog`) per visualizzare solo la griglia dei libri.
- [x] Creazione di `InfoPage` (`/info`) per visualizzare gli eventi e le promozioni.
- [x] Creazione di `ContactsPage` (`/contacts`) con dettagli su sede, indirizzo, email e orari.
- [x] Creazione e isolamento di `PublicFooter` per condividerlo tra le diverse pagine senza ripetizioni di codice.
- [x] Aggiornamento del file di routing principale (`App.tsx`).

### 2. Dati Pubblici (Inventario & Promozioni)
- [x] Identificato e risolto il problema del caricamento inventario su domini diversi: sincronizzato `VITE_APP_ID` su `default-app-id` in modo che il negozio pubblico legga dall'inventario reale.
- [x] Individuato il difetto sulla variabile d'ambiente vuota per l'utente pubblico: impostato `VITE_PUBLIC_USER_ID` = `ITAASMpeCoZKMwlZhnP1ocO1HWH2` nel `.env` locale.
- [x] Sviluppato uno script `scripts/add-promo.js` utilizzabile tramite riga di comando per inserire nuove promozioni/eventi su Firestore.

### 3. Evento "Lungo il Tevere Roma 2026"
- [x] Scraping automatizzato/manuale dei dettagli rilevanti dal sito di "Lungo il Tevere".
- [x] Estrazione dell'immagine/logo ufficiale e date esatte.
- [x] Popolamento del database remoto Firestore e test di visualizzazione di successo della card nella sezione "Promo & Eventi".

### 4. CI/CD (GitHub Actions)
- [x] Aggiornati i file `.yml` di GitHub Actions (`deploy.yml` e `deploy-firebase.yml`).
- [x] Aggiunta iniezione del secret `VITE_PUBLIC_USER_ID` al task di build (`npm run build`) in modo che la versione pubblicata su GitHub Pages/Firebase riesca a leggere il catalogo giusto.

---

## ⏳ Attività in Sospeso e Prossimi Passi (Da Fare)

### 1. Operazioni Manuali / Setup
- [ ] **Aggiunta Secret su GitHub:** Navigare sulle impostazioni del repository GitHub (`Settings > Secrets and variables > Actions`) e aggiungere la variabile `VITE_PUBLIC_USER_ID` con il valore `ITAASMpeCoZKMwlZhnP1ocO1HWH2`.

### 2. Sviluppo App
- [ ] **Gestione eventi da Pannello Admin:** Creare una sezione protetta (es. `/admin/promos`) in cui poter aggiungere, modificare ed eliminare graficamente le promozioni (oggi gestite via CLI con scripts node).
- [ ] **Ulteriori raffinamenti UI:** Aggiungere eventuali filtri per la ricerca libera nel `/catalog`.
- [ ] **SEO e Meta tags:** Curare title e description per ogni singola pagina pubblica al fine di migliorare i risultati Google.
