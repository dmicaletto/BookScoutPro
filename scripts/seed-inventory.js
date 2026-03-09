/**
 * Seed script: popola Firestore con i libri da books-data.json
 *
 * Uso:
 *   node --env-file=.env scripts/seed-inventory.js <email> <password>
 *
 * Prerequisiti:
 *   - .env con le variabili VITE_FIREBASE_*
 *   - Utente Firebase già registrato (email/password)
 *   - Node >= 20 (per --env-file)
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

// --- Config ---
const __dirname = dirname(fileURLToPath(import.meta.url))

const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error('Uso: node --env-file=.env scripts/seed-inventory.js <email> <password>')
  process.exit(1)
}

const firebaseConfig = {
  apiKey:            process.env.VITE_FIREBASE_API_KEY,
  authDomain:        process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.VITE_FIREBASE_APP_ID,
  measurementId:     process.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const appId = process.env.VITE_APP_ID || 'default-app-id'

// --- Init Firebase ---
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// --- Carica dati ---
const booksRaw = JSON.parse(
  readFileSync(join(__dirname, 'books-data.json'), 'utf-8')
)

console.log(`📚 ${booksRaw.length} libri caricati da books-data.json`)

// --- Login ---
let userCredential
try {
  userCredential = await signInWithEmailAndPassword(auth, email, password)
} catch (err) {
  console.error('❌ Login fallito:', err.message)
  process.exit(1)
}

const uid = userCredential.user.uid
console.log(`✅ Login OK — UID: ${uid}`)

// --- Mappa libri → InventoryItem ---
const collRef = collection(db, `artifacts/${appId}/users/${uid}/inventory`)

const shelves = 'ABCDEFGHIJ'.split('')
let inserted = 0

for (let i = 0; i < booksRaw.length; i++) {
  const raw = booksRaw[i]

  const shelfIndex = Math.floor(i / 5) % shelves.length
  const posIndex = (i % 5) + 1

  const item = {
    book: {
      isbn: raw.isbn || 'NO-ISBN',
      title: raw.title,
      author: raw.author || '',
      cover: raw.cover || '',
      prices: { amazon: '', ebay: '', abebooks: '' },
      links:  { amazon: '', ebay: '', abebooks: '' },
    },
    location: {
      shelf: shelves[shelfIndex],
      position: String(posIndex).padStart(2, '0'),
    },
    copies: 1,
    condition: 'Buono',
    myPrices: { amazon: '', ebay: '', abebooks: '' },
    purchasePrice: raw.price || 0,
    notes: [raw.publisher, raw.year].filter(Boolean).join(', '),
    photos: [],
    dateAdded: new Date().toISOString(),
  }

  try {
    const docRef = await addDoc(collRef, item)
    inserted++
    console.log(`  [${inserted}/${booksRaw.length}] ${raw.title} → ${docRef.id}`)
  } catch (err) {
    console.error(`  ❌ Errore su "${raw.title}":`, err.message)
  }
}

console.log(`\n✅ Seed completato: ${inserted}/${booksRaw.length} libri inseriti`)
console.log(`   Path: artifacts/${appId}/users/${uid}/inventory`)

process.exit(0)
