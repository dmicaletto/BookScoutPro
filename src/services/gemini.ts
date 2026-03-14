import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, FIRESTORE_APP_ID } from './firebase'
import type { Book } from '../types'

const STORAGE_KEY = 'bookscout_api_key'
const MODEL = 'gemini-2.5-flash'

export function getApiKey(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export function setApiKey(key: string) {
  localStorage.setItem(STORAGE_KEY, key)
}

export async function loadApiKeyFromFirestore(uid: string): Promise<string | null> {
  const cached = getApiKey()
  if (cached) return cached
  try {
    const ref = doc(db, 'artifacts', FIRESTORE_APP_ID, 'users', uid, 'settings', 'config')
    const snap = await getDoc(ref)
    const key = snap.data()?.googleApiKey as string | undefined
    if (key) setApiKey(key)
    return key ?? null
  } catch {
    return null
  }
}

export async function saveApiKeyToFirestore(uid: string, key: string): Promise<void> {
  setApiKey(key)
  const ref = doc(db, 'artifacts', FIRESTORE_APP_ID, 'users', uid, 'settings', 'config')
  await setDoc(ref, { googleApiKey: key }, { merge: true })
}

export async function analyzeBook(book: Book, condition: string): Promise<string> {
  const key = getApiKey()
  if (!key) throw new Error('API_KEY_MISSING')

  const prompt = `
Sei un esperto libraio antiquario e di libri usati. Analizza questo libro e dammi una strategia di vendita.

LIBRO: ${book.title} di ${book.author}
ISBN: ${book.isbn}
CONDIZIONI: ${condition}

PREZZI DI MERCATO ATTUALI:
- Amazon: ${book.prices.amazon || 'N/D'}
- eBay: ${book.prices.ebay || 'N/D'}
- AbeBooks: ${book.prices.abebooks || 'N/D'}

Rispondi in massimo 3 frasi brevi. Consiglia un prezzo di vendita competitivo e su quale canale puntare (Arbitraggio, Vendita Diretta, etc). Sii diretto.
`.trim()

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Nessuna risposta ricevuta.'
}

export async function generateDescription(
  book: Book,
  condition: string,
): Promise<string> {
  const key = getApiKey()
  if (!key) throw new Error('API_KEY_MISSING')

  const prompt = `
Scrivi una breve descrizione di vendita (max 2 frasi) per questo libro usato:
"${book.title}" di ${book.author}, condizioni: ${condition}.
Sii conciso e professionale, in italiano.
`.trim()

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  })

  if (!res.ok) throw new Error(`Gemini API error ${res.status}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}
