import type { Book } from '../types'

const API_BASE = 'https://www.googleapis.com/books/v1/volumes'

function buildLinks(isbn: string, title: string) {
  const q = isbn && isbn !== 'NO-ISBN' ? isbn : encodeURIComponent(title)
  return {
    amazon: `https://www.amazon.it/s?k=${q}`,
    ebay: `https://www.ebay.it/sch/i.html?_nkw=${q}`,
    abebooks: isbn && isbn !== 'NO-ISBN'
      ? `https://www.abebooks.it/servlet/SearchResults?isbn=${isbn}`
      : `https://www.abebooks.it/servlet/SearchResults?tn=${encodeURIComponent(title)}`,
  }
}

function parseVolume(raw: Record<string, unknown>): Book {
  const info = raw.volumeInfo as Record<string, unknown> | undefined
  if (!info) {
    return {
      isbn: 'NO-ISBN', title: 'Sconosciuto', author: '', cover: '',
      prices: { amazon: '', ebay: '', abebooks: '' },
    }
  }

  // Estrai ISBN-13 o ISBN-10
  const identifiers = (info.industryIdentifiers as Array<{ type: string; identifier: string }>) ?? []
  const isbn13 = identifiers.find((i) => i.type === 'ISBN_13')?.identifier
  const isbn10 = identifiers.find((i) => i.type === 'ISBN_10')?.identifier
  const isbn = isbn13 ?? isbn10 ?? (raw.id as string) ?? 'NO-ISBN'

  const title = (info.title as string) ?? 'Sconosciuto'
  const authors = info.authors as string[] | undefined
  const author = authors?.[0] ?? ''

  // Cover: preferisci https
  const imageLinks = info.imageLinks as Record<string, string> | undefined
  const cover = (imageLinks?.thumbnail ?? '').replace('http://', 'https://')

  return {
    isbn,
    title,
    author,
    cover,
    prices: { amazon: '', ebay: '', abebooks: '' },
    links: buildLinks(isbn, title),
  }
}

export async function searchByISBN(isbn: string): Promise<Book[]> {
  const clean = isbn.replace(/[^0-9X]/gi, '')
  const res = await fetch(`${API_BASE}?q=isbn:${clean}&maxResults=10`)
  if (!res.ok) throw new Error(`Google Books API error: ${res.status}`)
  const data = await res.json()
  if (!data.items?.length) return []
  return (data.items as Record<string, unknown>[]).map(parseVolume)
}

export async function searchByTitle(title: string): Promise<Book[]> {
  const res = await fetch(`${API_BASE}?q=intitle:${encodeURIComponent(title)}&maxResults=10`)
  if (!res.ok) throw new Error(`Google Books API error: ${res.status}`)
  const data = await res.json()
  if (!data.items?.length) return []
  return (data.items as Record<string, unknown>[]).map(parseVolume)
}
