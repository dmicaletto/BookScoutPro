---
title: 
---

# Regole Firebase

## Sicurezza

- **MAI** scrivere credenziali Firebase nel codice sorgente.
- **MAI** committare `.env` o `.mcp.json`.
- Le variabili `VITE_FIREBASE_*` sono in `.env` locale e in GitHub Secrets per CI/CD.

## App ID


## Struttura Path Firestore


## Operazioni Consentite

- **Read** (onSnapshot, getDoc, getDocs): sempre consentite per sviluppo.
- **Write** (addDoc, updateDoc, setDoc): proponi prima la struttura del documento, poi implementa.
- **Delete** (deleteDoc): proponi sempre prima di implementare. Verifica se è soft-delete o hard-delete.
- **Regole Firestore**: qualsiasi modifica alle Security Rules va discussa e approvata prima.

## Realtime Listeners

## Autenticazione

- Provider: **email/password** (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`).
- Il listener `onAuthStateChanged` è in `App.jsx` — non replicarlo altrove.
- Dopo logout (`signOut`), resetta sempre lo stato locale dell'applicazione.
- I messaggi di errore Firebase vanno tradotti in italiano (già gestito in `AuthScreen.jsx`).

## MCP Firebase

Il server MCP Firebase (`firebase-tools experimental:mcp`) è configurato in `.mcp.json`.
Usarlo solo per ispezione/debug in locale. Non automatizzare operazioni distruttive via MCP.
