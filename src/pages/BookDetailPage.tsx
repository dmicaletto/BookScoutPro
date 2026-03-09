import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db, FIRESTORE_APP_ID } from '../services/firebase'
import { useAuth } from '../context/AuthContext'
import { searchByISBN } from '../services/googleBooks'
import BookDetailView from '../features/book-detail/BookDetailView'
import type { InventoryItem } from '../types'

const BookDetailPage = () => {
  const { isbn, id } = useParams<{ isbn?: string; id?: string }>()
  const { user } = useAuth()
  const [item, setItem] = useState<InventoryItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isEditing = !!id

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')

      try {
        if (id && user) {
          // Carica da Firestore (modifica)
          const ref = doc(db, 'artifacts', FIRESTORE_APP_ID, 'users', user.uid, 'inventory', id)
          const snap = await getDoc(ref)
          if (snap.exists()) {
            setItem({ firestoreId: snap.id, ...snap.data() } as InventoryItem)
          } else {
            setError('Libro non trovato in inventario.')
          }
        } else if (isbn) {
          // Cerca da Google Books (nuovo)
          const books = await searchByISBN(isbn)
          if (books.length > 0) {
            const book = books[0]
            setItem({
              book,
              location: { shelf: '', position: '' },
              copies: 1,
              condition: 'Buono',
              myPrices: { amazon: '', ebay: '', abebooks: '' },
              purchasePrice: 0,
              notes: '',
              photos: [],
              dateAdded: new Date().toISOString(),
            })
          } else {
            setError('Nessun libro trovato per questo ISBN.')
          }
        }
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [isbn, id, user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p className="text-red-400 text-sm text-center">{error || 'Errore nel caricamento.'}</p>
      </div>
    )
  }

  return <BookDetailView item={item} isEditing={isEditing} />
}

export default BookDetailPage
