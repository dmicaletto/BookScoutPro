---
title: Dominio BookScout
---

# Regole Dominio BookScout

## Entità Principali

### Libro (`Book`)
- Identificato da **ISBN-13** (o ISBN-10 se non disponibile)
- Se non esiste un ISBN, si usa l'ID Google Books o la stringa `"NO-ISBN"`
- Attributi: `isbn`, `title`, `author`, `cover` (URL), `prices` (prezzi mercato), `links` (link marketplace)
- I **prezzi di mercato** (`prices`) sono riferimenti informativi (non real-time): si mostrano link ai marketplace per verifica

### Canali di Vendita (`SaleChannel`)
I tre canali supportati sono:
- `"amazon"` → Amazon.it
- `"ebay"` → eBay.it
- `"abebooks"` → AbeBooks.it

Ogni libro in inventario può avere un **prezzo personalizzato** (`myPrices`) per ciascun canale, indipendente dal prezzo di mercato.

### Condizione Libro (`Condition`)
Valori standard (ordine decrescente di qualità):
- `"Nuovo"`
- `"Come Nuovo"`
- `"Ottimo"`
- `"Buono"` ← default
- `"Accettabile"`
- `"Danneggiato"`
- `"Altro"` ← richiede campo libero custom

La condizione influenza la strategia di prezzo suggerita da Gemini.

### Posizione in Scaffale (`Location`)
Struttura: `{ shelf: string, position: string }`
- `shelf`: lettera maiuscola (es. `"A"`, `"B"`) — identificatore dello scaffale fisico
- `position`: numero a 2 cifre con zero-padding (es. `"01"`, `"12"`)
- Visualizzazione: `"A-01"` (shelf + "-" + position)
- La posizione è fondamentale per localizzare fisicamente il libro nel negozio/magazzino

### Voce Inventario (`InventoryItem`)
Un libro fisico con:
- Dati bibliografici (`book`)
- Posizione fisica (`location`)
- Numero di copie disponibili (`copies`)
- Condizione (`condition`)
- Prezzi di vendita per canale (`myPrices`)
- Prezzo di acquisto (`purchasePrice`) — snapshot al momento dell'inserimento
- Note descrittive (`notes`) — può essere generata da Gemini
- Foto del libro (`photos[]`) — base64
- Data di inserimento (`dateAdded`) — ISO string

### Vendita (`Sale`)
Registrata quando si vende una o più copie. Contiene uno **snapshot** dei costi al momento della vendita (non referenze live). Un `InventoryItem` con `copies = 0` viene eliminato dalla collection.

### Prenotazione (`Reservation`) ← _da creare_
Concetto non ancora implementato. Rappresenta la prenotazione di un libro da parte di un cliente.
- Da definire: struttura, stati (es. `pending`, `confirmed`, `delivered`), relazione con l'inventario

---

## Terminologia UI (Italiano)

| Concetto | Label UI | Note |
|---|---|---|
| `InventoryItem` | "Libro in inventario" / "In magazzino" | |
| `location` | "Posizione scaffale" / "Scaffale" | |
| `copies` | "Copie disponibili" | |
| `purchasePrice` | "Prezzo di acquisto" | |
| `myPrices` | "Il mio prezzo" | |
| `condition` | "Condizioni" | |
| `dateAdded` | "Data inserimento" | |
| `sales` | "Vendite" | |
| `channel` | "Canale" / "Piattaforma" | |
| Ricerca per ISBN | "Scansiona barcode" | tramite fotocamera |
| Ricerca per copertina | "Scatta copertina" | Google Vision API |
| Ricerca manuale | "Cerca per titolo" | Google Books API |
| Analisi AI | "Chiedi a Gemini" / "Analisi di mercato" | |

---

## Flussi Principali

### Inserimento Libro
1. Ricerca (barcode / copertina / testo)
2. Selezione dalla lista risultati Google Books
3. Visualizzazione dettaglio + prezzi mercato
4. Click "Aggiungi a Inventario" → modal logistica
5. Inserimento: scaffale, posizione, copie, condizione, prezzo acquisto, note
6. Salvataggio su Firestore

### Vendita
1. Trovare il libro dall'inventario
2. Click su canale di vendita (Amazon / eBay / AbeBooks)
3. Inserimento: prezzo, spedizione, numero copie
4. Conferma → `addDoc` sales + `updateDoc`/`deleteDoc` inventory

### Ricerca in Inventario
- Per titolo (substring case-insensitive)
- Per scaffale (es. "A" o "A01")
- Paginazione: 10 elementi per pagina, ordinati per `dateAdded` DESC

---

## API Esterne

| API | Utilizzo | Key |
|---|---|---|
| Google Books API | Ricerca libro per ISBN o titolo | pubblica (senza key) |
| Google Vision API | OCR da foto copertina | Google API Key utente |
| Gemini 2.5 Flash | Analisi mercato + generazione note | Google API Key utente |

La Google API Key è **sempre fornita dall'utente** e salvata in `localStorage`. Non va mai inserita nel codice.
