import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  query,
  limit,
  orderBy,
  where,
  doc,
  getDoc
} from 'firebase/firestore'
import { db, FIRESTORE_APP_ID } from '../services/firebase'
import type { InventoryItem, PublicInfo } from '../types'

// L'UID amministratore da cui leggere i dati pubblici
const PUBLIC_STORE_UID = import.meta.env.VITE_PUBLIC_USER_ID || ''

export function usePublicBook(id: string | undefined) {
  const [item, setItem] = useState<InventoryItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!PUBLIC_STORE_UID || !id) {
      setLoading(false)
      return
    }

    const load = async () => {
      try {
        const ref = doc(db, 'artifacts', FIRESTORE_APP_ID, 'users', PUBLIC_STORE_UID, 'inventory', id)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setItem({ firestoreId: snap.id, ...snap.data() } as InventoryItem)
        }
      } catch (err) {
        console.error('Public Book error:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  return { item, loading }
}

export function usePublicCatalog() {

  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!PUBLIC_STORE_UID) {
      setLoading(false)
      return
    }

    // Nota: Filtra copie > 0 per il catalogo pubblico
    const q = query(
      collection(db, 'artifacts', FIRESTORE_APP_ID, 'users', PUBLIC_STORE_UID, 'inventory'),
      where('copies', '>', 0),
      orderBy('copies'),
      orderBy('dateAdded', 'desc'),
      limit(50)
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({
          firestoreId: d.id,
          ...d.data(),
        })) as InventoryItem[]
        setItems(docs)
        setLoading(false)
      },
      (err) => {
        console.error('Public Catalog error:', err)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [])

  return { items, loading }
}

export function usePublicInfo() {
  const [info, setInfo] = useState<PublicInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!PUBLIC_STORE_UID) {
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'artifacts', FIRESTORE_APP_ID, 'users', PUBLIC_STORE_UID, 'public_info'),
      where('active', '==', true),
      orderBy('dateAdded', 'desc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as PublicInfo[]
        setInfo(docs)
        setLoading(false)
      },
      (err) => {
        console.error('Public Info error:', err)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [])

  return { info, loading }
}
