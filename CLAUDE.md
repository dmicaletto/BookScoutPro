---

## Descrizione

**BookScout** è un'app per librai e collezionisti per gestire l'inventario di libri usati, analizzare i prezzi di mercato (Amazon, eBay, AbeBooks) e registrare vendite. L'AI (Gemini) suggerisce strategie di prezzo.

**Target**: Mobile + Desktop (responsive), potenzialmente Capacitor-ready per build Android.

---

## Stack Tecnologico

| Layer | Attuale (legacy) | Target (migrazione) |
|---|---|---|
| Bundler | nessuno (CDN) | **Vite** |
| UI Framework | Vanilla JS | **React 18** |
| Linguaggio | JS ES Modules | **TypeScript** |
| Styling | TailwindCSS CDN | **TailwindCSS v3** (npm) |
| Routing | nessuno (sezioni nascoste) | **React Router v6** |
| Backend | Firebase Firestore | Firebase Firestore (invariato) |
| Auth | Anonima | **Email/Password** |
| AI | Gemini 2.5 Flash (key utente) | Gemini 2.5 Flash (invariato) |
| Barcode | html5-qrcode CDN | html5-qrcode (npm) |
| Icone | Font Awesome CDN | **lucide-react** |

---

## Struttura Progetto (Target)

```
src/
  components/         # Componenti riutilizzabili (Button, Modal, etc.)
  features/           # Una cartella per feature (scanner/, inventory/, dashboard/)
    scanner/
    book-detail/
    inventory/
    dashboard/
    import-export/
    reservations/     # ← nuova feature: prenotazione libri
  hooks/              # Custom hooks (useFirestore, useAuth, useGemini)
  services/           # Logica esterna (firebase.ts, gemini.ts, googleBooks.ts)
  context/            # AuthContext, InventoryContext
  types/              # TypeScript interfaces (Book, InventoryItem, Sale, etc.)
  pages/              # Route-level components
```

---

## Architettura

### Strategia di Migrazione

**Feature by feature** — l'`index.html` rimane live finché la migrazione non è completa.

Fasi pianificate:
1. Setup Vite + React + TS + Firebase + Auth Email/Password
2. Scanner ISBN + Ricerca libri (Google Books API)
3. Dettaglio libro + Aggiunta a inventario
4. Lista inventario (con ricerca e paginazione)
5. Registrazione vendita (modal per canale)
6. Dashboard (KPI + grafici)
7. Import/Export CSV
8. Prenotazione libri _(da creare)_

### View principali

| Route | Componente | Descrizione |
|---|---|---|
| `/` | `ScannerPage` | Scanner barcode + ricerca manuale + upload copertina |
| `/book/:isbn` | `BookDetailPage` | Dettaglio libro, prezzi mercato, analisi Gemini |
| `/inventory` | `InventoryPage` | Lista inventario con ricerca e paginazione |
| `/inventory/:id` | `BookDetailPage` | Dettaglio da inventario (modalità modifica) |
| `/dashboard` | `DashboardPage` | KPI, grafici canali, libri più vecchi |
| `/import-export` | `ImportExportPage` | Import/Export CSV |
| `/reservations` | `ReservationsPage` | Prenotazioni libri _(da creare)_ |

### Struttura Firestore

**Path base**: `artifacts/{appId}/users/{uid}/`

**Collection `inventory`**:
```ts
{
  book: {
    isbn: string,
    title: string,
    author: string,
    cover: string,          // URL immagine
    prices: { amazon: string, ebay: string, abebooks: string },
    links: { amazon: string, ebay: string, abebooks: string }
  },
  location: { shelf: string, position: string }, // es. "A", "01"
  copies: number,
  condition: string,         // vedi dominio: condizioni libro
  myPrices: { amazon: string, ebay: string, abebooks: string },
  purchasePrice: number,
  notes: string,
  photos: string[],          // base64 (da valutare migrazione a Storage)
  dateAdded: string          // ISO
}
```

**Collection `sales`**:
```ts
{
  bookTitle: string,
  isbn: string,
  channel: "amazon" | "ebay" | "abebooks",
  price: number,
  shippingCost: number,
  purchasePrice: number,    // snapshot al momento della vendita
  quantity: number,
  dateSold: string          // ISO
}
```

---

## Firebase

### Variabili d'ambiente (`.env` locale — non committare mai)

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

Gli stessi valori vanno come **GitHub Secrets** per il deploy CI/CD e la build Android.

## Note di Sicurezza

- Firebase web config è **pubblica per design**: la sicurezza è delegata alle Firestore Security Rules.
- La Google API Key (Gemini + Vision) è inserita dall'utente e salvata in `localStorage` — NON nel codice.
- `.mcp.json` è in `.gitignore` — NON va committato mai.
- `.env` è in `.gitignore` — NON va committato mai.

## Comandi di Sviluppo

```bash
npm run dev        # Dev server locale (http://localhost:5173)
npm run build      # Build produzione → ./dist
npm run preview    # Preview build produzione
npm run lint       # ESLint (flat config, React Hooks)
```

## Versionamento

- `package.json` → `"version"` aggiornata manualmente
- Tag git `vX.Y.Z` triggerano build Android con versionCode automatico (da `github.run_number`)
- Semantic versioning: MAJOR.MINOR.PATCH
