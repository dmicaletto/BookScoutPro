// Tipi di dominio per BookScoutPro

export type SaleChannel = 'amazon' | 'ebay' | 'abebooks'

export interface BookLocation {
  shelf: string    // es. "A"
  position: string // es. "01"
}

export interface BookPrices {
  amazon: string
  ebay: string
  abebooks: string
}

export interface Book {
  isbn: string
  title: string
  author: string
  cover: string
  prices: BookPrices
  links?: {
    amazon: string
    ebay: string
    abebooks: string
  }
  strategy?: string
}

export interface InventoryItem {
  firestoreId?: string // assegnato da Firestore, assente al momento della creazione
  book: Book
  location: BookLocation
  copies: number
  condition: string    // vedi dominio: Nuovo | Come Nuovo | Ottimo | Buono | Accettabile | Danneggiato | Altro
  myPrices: BookPrices
  purchasePrice: number
  notes?: string
  photos?: string[]   // base64
  dateAdded: string   // ISO string
}

export interface Sale {
  bookTitle: string
  isbn: string
  channel: SaleChannel
  price: number
  shippingCost: number
  purchasePrice: number // snapshot al momento della vendita
  quantity: number
  dateSold: string      // ISO string
}

export interface PublicInfo {
  id: string
  title: string
  content: string
  type: 'promo' | 'event' | 'info'
  dateAdded: string     // ISO string
  active: boolean
  image?: string        // URL o base64
}

