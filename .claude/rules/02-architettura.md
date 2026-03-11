---
title: 
---

# Regole Architettura

## Regole Generali Claude

- **NO commit automatici**: l'utente gestisce autonomamente tutte le operazioni git.
- **NO push, NO force-push**: mai, in nessun caso.
- **NO test automatici**: non eseguire mai `npm run lint`, `npm run build`, `npm test` o qualsiasi altro comando di verifica in autonomia. Proponi sempre il comando e attendi approvazione esplicita prima di eseguirlo.
- **Ogni decisione di implementazione**: proponi prima (cosa fare e perché), implementa solo dopo approvazione esplicita.
- **Modifiche chirurgiche**: modifica solo le righe strettamente necessarie al task. Nessuna riformattazione automatica.
- **Nessun refactoring non richiesto**: non "migliorare" codice circostante, non aggiungere docstring o commenti non richiesti.

## Lingua

- **Business logic e UI copy**: italiano (etichette, messaggi toast, placeholder, testi AI).
- **Termini tecnici**: inglese (variabili, funzioni, prop names, commenti tecnici).
- **Info non verificate**: marcare con `_(da verificare)_`.
- **Documenti pianificati**: marcare con `_(da creare)_`.

## Struttura Componenti

### Gerarchia View


### Regole di Composizione



### Naming

## Styling


## Context

## Icone


## Date

## Performance

## ESLint

