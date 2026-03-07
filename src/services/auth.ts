import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import { auth } from './firebase'

export const login = async (email: string, password: string) => {
  await setPersistence(auth, browserLocalPersistence)
  return signInWithEmailAndPassword(auth, email, password)
}

export const register = async (email: string, password: string) => {
  await setPersistence(auth, browserLocalPersistence)
  return createUserWithEmailAndPassword(auth, email, password)
}

export const logout = () => signOut(auth)
