# Piano — Fase 4: Lista Inventario

## File da creare

### 1. `src/hooks/useInventory.ts`
Custom hook con `onSnapshot` realtime su `artifacts/{appId}/users/{uid}/inventory`.
- Ritorna `{ items: InventoryItem[], loading: boolean, deleteItem: (id: string) => Promise<void> }`
- Mappa `doc.id` → `firestoreId`
- Cleanup unsubscribe su unmount
- `deleteItem` esegue `deleteDoc` (l'onSnapshot aggiorna automaticamente la lista)

### 2. `src/features/inventory/InventoryCard.tsx`
Card singolo libro, replica del layout legacy:
- **Sinistra**: badge scuro con scaffale (lettera emerald + numero), badge rosso copie se > 1
- **Centro**: titolo (truncated), badge condizione (verde/arancione/grigio), prezzo mercato + mio prezzo
- **Destra**: pulsante elimina (Trash2, rosso)
- Props: `item: InventoryItem`, `onDelete: (id: string) => void`
- Click sulla card: per ora no-op (BookDetailPage non ancora implementata)

### 3. `src/features/inventory/InventoryList.tsx`
Componente principale della lista:
- **Header**: "Magazzino" + badge conteggio (emerald)
- **Search**: input con icona Search, filtra per titolo O scaffale+posizione O scaffale
- **Lista**: card ordinate per `dateAdded` DESC
- **Paginazione**: 10/pagina, bottoni prev/next con ChevronLeft/ChevronRight, "Pagina X di Y"
- **Stato vuoto**: "Nessun libro trovato."
- **Loading**: skeleton shimmer (3-4 righe placeholder)
- Delete: `window.confirm("Eliminare definitivamente?")` → chiama onDelete

### 4. `src/pages/InventoryPage.tsx`
Wrapper minimale:
- Usa `useInventory()` hook
- Passa dati a `<InventoryList />`

## File da modificare

### 5. `src/App.tsx`
- Aggiungere import `InventoryPage`
- Sostituire `<PlaceholderPage title="Inventario" />` con `<InventoryPage />`

## Nessun altro file toccato
- AppShell, AuthContext, firebase.ts, types → invariati
- index.css → invariato (glass-panel, glass-dark, shimmer già presenti)
