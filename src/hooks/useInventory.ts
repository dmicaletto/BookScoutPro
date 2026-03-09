import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db, FIRESTORE_APP_ID } from '../services/firebase'
import { useAuth } from '../context/AuthContext'
import type { InventoryItem } from '../types'

export function useInventory() {
  const { user } = useAuth()
  const [items, setItems]     = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    const colRef = collection(
      db,
      'artifacts', FIRESTORE_APP_ID, 'users', user.uid, 'inventory',
    )

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({
          firestoreId: d.id,
          ...d.data(),
        })) as InventoryItem[]
        setItems(docs)
        setLoading(false)
      },
      (err) => {
        console.error('Inventory onSnapshot error:', err)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [user])

  const deleteItem = async (id: string) => {
    if (!user) return
    await deleteDoc(
      doc(db, 'artifacts', FIRESTORE_APP_ID, 'users', user.uid, 'inventory', id),
    )
  }

  return { items, loading, deleteItem }
}
