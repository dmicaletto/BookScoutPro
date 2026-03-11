import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db, FIRESTORE_APP_ID } from '../services/firebase'
import { useAuth } from '../context/AuthContext'
import type { PublicInfo } from '../types'

type PublicInfoInput = Omit<PublicInfo, 'id'>

export function useAdminPublicInfo() {
  const { user } = useAuth()
  const [items, setItems]     = useState<PublicInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'artifacts', FIRESTORE_APP_ID, 'users', user.uid, 'public_info'),
      orderBy('dateAdded', 'desc'),
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as PublicInfo[]
        setItems(docs)
        setLoading(false)
      },
      (err) => {
        console.error('AdminPublicInfo onSnapshot error:', err)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [user])

  const addItem = async (data: PublicInfoInput) => {
    if (!user) return
    await addDoc(
      collection(db, 'artifacts', FIRESTORE_APP_ID, 'users', user.uid, 'public_info'),
      data,
    )
  }

  const updateItem = async (id: string, data: Partial<PublicInfoInput>) => {
    if (!user) return
    await updateDoc(
      doc(db, 'artifacts', FIRESTORE_APP_ID, 'users', user.uid, 'public_info', id),
      data,
    )
  }

  const deleteItem = async (id: string) => {
    if (!user) return
    await deleteDoc(
      doc(db, 'artifacts', FIRESTORE_APP_ID, 'users', user.uid, 'public_info', id),
    )
  }

  return { items, loading, addItem, updateItem, deleteItem }
}
