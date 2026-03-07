import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)

export const db   = getFirestore(app)
export const auth = getAuth(app)

// Usato nei path Firestore: artifacts/{FIRESTORE_APP_ID}/users/{uid}/...
// Corrisponde a __app_id del legacy (default: 'default-app-id')
export const FIRESTORE_APP_ID: string =
  (import.meta.env.VITE_APP_ID as string | undefined) ?? 'default-app-id'
