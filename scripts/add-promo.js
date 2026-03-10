/**
 * Script per aggiungere la prima promozione (evento Lungo il Tevere Roma 2026)
 *
 * Uso:
 *   node --env-file=.env scripts/add-promo.js <email> <password>
 */

import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error('Uso: node --env-file=.env scripts/add-promo.js <email> <password>')
  process.exit(1)
}

const firebaseConfig = {
  apiKey:            process.env.VITE_FIREBASE_API_KEY,
  authDomain:        process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.VITE_FIREBASE_APP_ID,
}

const appId = process.env.VITE_APP_ID || 'bookscout-pro'
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

try {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  const uid = userCredential.user.uid
  console.log(`✅ Login effettuato come: ${uid}`)

  const promo = {
    title: "Estate 2026: Libreria Sottomarina @ Lungo il Tevere Roma",
    content: "Quest'estate ci trovate sulle banchine del Tevere! Avremo uno stand dedicato con centinaia di titoli selezionati e uno sconto speciale fino al 15% su tutto il catalogo per i visitatori della manifestazione. Vi aspettiamo per sfogliare libri unici sotto le stelle di Roma.",
    type: "event",
    dateAdded: new Date().toISOString(),
    active: true,
    image: "https://www.lungoiltevereroma.it/it" // Link di riferimento
  }

  const collRef = collection(db, `artifacts/${appId}/users/${uid}/public_info`)
  const docRef = await addDoc(collRef, promo)
  
  console.log(`🚀 Promozione creata con ID: ${docRef.id}`)
  process.exit(0)
} catch (err) {
  console.error('❌ Errore:', err.message)
  process.exit(1)
}
