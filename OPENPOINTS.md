# BookScoutPro - Punti Aperti (Open Points)

Questo file traccia lo stato di avanzamento del progetto, le attività completate e i prossimi passi per avere un punto fermo da cui ripartire ad ogni sessione.

---

## ✅ Attività Completate

### Fase 1 — Scaffold
- [x] Setup Vite + React 18 + TypeScript + TailwindCSS v3 + React Router v6
- [x] Firebase Auth email/password (`AuthContext`, `LoginPage`, `RegisterPage`)
- [x] `AppShell` con header, menu laterale e footer (area admin)
- [x] `ProtectedRoute` per le rotte admin

### Fase 2 — Branding & Dati
- [x] Branding "Libreria Sottomarina" (logo, colori, footer aziendale)
- [x] Script `scripts/seed-inventory.js`: popolamento Firestore con 50 libri reali
- [x] `scripts/books-data.json`: 50 libri scrappati da libreriasottomarina.it

### Fase 3 — Dettaglio Libro + Inventario Admin
- [x] `src/services/googleBooks.ts`: ricerca Google Books API (ISBN + titolo)
- [x] `src/services/gemini.ts`: analisi AI con Gemini 2.5 Flash (key da localStorage)
- [x] `src/features/book-detail/BookDetailView.tsx`: dettaglio libro con prezzi marketplace e AI Insight
- [x] `src/features/book-detail/InventoryModal.tsx`: modal logistica (condizione, foto, note, scaffale, prezzo)
- [x] `src/pages/BookDetailPage.tsx`: carica da Google Books (`:isbn`) o da Firestore (`:id`)
- [x] Click su `InventoryCard` → naviga a `/admin/inventory/:id`

### Fase 4 — Lista Inventario Admin
- [x] `src/hooks/useInventory.ts`: onSnapshot realtime sull'inventario staff
- [x] `src/features/inventory/InventoryCard.tsx`: card libro con scaffale, condizione, prezzi, elimina
- [x] `src/features/inventory/InventoryList.tsx`: lista con ricerca, paginazione (10/pag), skeleton
- [x] `src/pages/InventoryPage.tsx`: wrapper della lista

### Fase Scanner — Aggiunta Libri
- [x] `src/features/scanner/ScannerView.tsx`: tab Scanner (html5-qrcode, fotocamera, ISBN-10/13) + tab Ricerca (ISBN manuale o titolo, lista risultati)
- [x] `src/pages/ScannerPage.tsx`: wrapper con intestazione
- [x] Integrazione in `App.tsx` come route `/admin/scanner` (default admin)

### Area Pubblica (Fasi A+B+C)
- [x] `CatalogPage` (`/catalog`): griglia libri pubblica con ricerca
- [x] `PublicBookDetailPage` (`/catalog/book/:id`): dettaglio read-only (cover, prezzi marketplace, note, foto)
- [x] `InfoPage` (`/info`): promozioni ed eventi attivi da Firestore
- [x] `ContactsPage` (`/contacts`): sede, orari, email
- [x] `PublicFooter`: footer condiviso tra le pagine pubbliche
- [x] `HomePage` (`/`): landing con CTA "Esplora il Catalogo" e link "Area Staff"
- [x] Inventario pubblico via `VITE_PUBLIC_USER_ID` (stessa collection staff, read-only)
- [x] Script `scripts/add-promo.js`: inserimento promozioni/eventi via CLI
- [x] Evento "Lungo il Tevere Roma 2026" inserito su Firestore e visibile nell'app

### CI/CD
- [x] `deploy-firebase.yml`: deploy automatico su Firebase Hosting
- [x] `android.yml`: build APK Android via Capacitor
- [x] `release.yml`: release GitHub
- [x] Secret `VITE_PUBLIC_USER_ID` iniettato nella build CI

---

## ⏳ Attività in Sospeso

### Setup manuale (azione utente)
- [ ] Aggiungere `VITE_PUBLIC_USER_ID` su GitHub Secrets (`Settings > Secrets and variables > Actions`) con valore `ITAASMpeCoZKMwlZhnP1ocO1HWH2`

### Fase D — CRUD Admin Promozioni/Eventi
Oggi gestite via CLI (`scripts/add-promo.js`). Obiettivo: gestione grafica dall'area admin.
- [ ] Pagina `/admin/promotions`: lista promozioni con "Nuova", modifica, elimina
- [ ] Pagina `/admin/events`: lista eventi con "Nuovo", modifica, elimina
- [ ] Modal `PromotionForm` / `EventForm` per CRUD
- [ ] Aggiungere voci "Promozioni" e "Eventi" al menu admin (`AppShell`)
- [ ] Route `admin/promotions` e `admin/events` in `App.tsx`

### Fase E — Vendite
- [ ] Modal vendita da dettaglio libro: selezione canale (amazon/ebay/abebooks), prezzo, spedizione, quantità
- [ ] `addDoc` su collection `sales` al momento della vendita
- [ ] Decremento `copies` sull'`InventoryItem`; se `copies === 0` → `deleteDoc`
- [ ] Hook `useSales` per lettura storico vendite

### Fase F — Dashboard
- [ ] KPI: totale libri, valore inventario (sum purchasePrice), libri venduti
- [ ] Grafico vendite per canale (amazon/ebay/abebooks)
- [ ] Libri più vecchi in inventario (ordinati per `dateAdded` ASC)
- [ ] Sostituire `PlaceholderPage` con la `DashboardPage` reale

### Fase G — Import/Export CSV
- [ ] Export inventario in CSV (titolo, autore, ISBN, scaffale, condizione, prezzo)
- [ ] Import libri da CSV (batch insert su Firestore)
- [ ] Sostituire `PlaceholderPage` con `ImportExportPage`

### Fase H — Prenotazioni
- [ ] Design collection Firestore `reservations`: `{ bookId, bookTitle, customerEmail, status, createdAt }`
- [ ] Stati: `pending` → `confirmed` → `delivered` / `cancelled`
- [ ] UI pubblica: pulsante "Prenota" nel dettaglio libro pubblico
- [ ] UI admin: lista prenotazioni con cambio stato

### Raffinamenti
- [ ] Filtri catalogo pubblico per condizione e prezzo
- [ ] SEO: `<title>` e `<meta description>` per ogni pagina pubblica
- [ ] `AccountPage` per utenti pubblici registrati (preferiti, prenotazioni personali)
