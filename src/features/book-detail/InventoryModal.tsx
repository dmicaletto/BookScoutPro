import { useState, useRef } from 'react'
import {
  X,
  Camera,
  Trash2,
  Sparkles,
  MapPin,
  Save,
  PackagePlus,
} from 'lucide-react'
import { addDoc, updateDoc, doc, collection } from 'firebase/firestore'
import { db, FIRESTORE_APP_ID } from '../../services/firebase'
import { useAuth } from '../../context/AuthContext'
import { generateDescription, getApiKey } from '../../services/gemini'
import type { InventoryItem, BookPrices } from '../../types'

interface InventoryModalProps {
  item: InventoryItem
  myPrices: BookPrices
  isEditing: boolean
  onClose: () => void
  onSaved: () => void
}

const CONDITIONS = [
  'Nuovo',
  'Come Nuovo',
  'Ottimo',
  'Buono',
  'Accettabile',
  'Danneggiato',
  'Altro',
]

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX = 800
        let w = img.width
        let h = img.height
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX }
          else       { w = Math.round(w * MAX / h); h = MAX }
        }
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.6))
      }
      img.onerror = reject
      img.src = reader.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const InventoryModal = ({ item, myPrices, isEditing, onClose, onSaved }: InventoryModalProps) => {
  const { user } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)

  const [condition, setCondition] = useState(item.condition || 'Buono')
  const [customCond, setCustomCond] = useState('')
  const [shelf, setShelf] = useState(item.location.shelf)
  const [position, setPosition] = useState(item.location.position)
  const [copies, setCopies] = useState(item.copies || 1)
  const [purchasePrice, setPurchasePrice] = useState(item.purchasePrice || 0)
  const [notes, setNotes] = useState(item.notes ?? '')
  const [photos, setPhotos] = useState<string[]>(item.photos ?? [])
  const [saving, setSaving] = useState(false)
  const [aiNoteLoading, setAiNoteLoading] = useState(false)

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const remaining = 3 - photos.length
    const toProcess = Array.from(files).slice(0, remaining)
    const compressed = await Promise.all(toProcess.map(compressImage))
    setPhotos((prev) => [...prev, ...compressed].slice(0, 3))
    if (fileRef.current) fileRef.current.value = ''
  }

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleGenerateNote = async () => {
    if (!getApiKey()) return
    setAiNoteLoading(true)
    try {
      const cond = condition === 'Altro' ? customCond || 'Altro' : condition
      const result = await generateDescription(item.book, cond)
      setNotes(result)
    } catch {
      // silente — l'utente può scrivere manualmente
    } finally {
      setAiNoteLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)

    const finalCondition = condition === 'Altro' ? (customCond || 'Altro') : condition
    const data = {
      book: {
        isbn: item.book.isbn,
        title: item.book.title,
        author: item.book.author,
        cover: item.book.cover,
        prices: item.book.prices,
        links: item.book.links ?? {},
      },
      location: { shelf: shelf.toUpperCase(), position: position.padStart(2, '0') },
      copies,
      condition: finalCondition,
      myPrices,
      purchasePrice,
      notes,
      photos,
      dateAdded: isEditing ? item.dateAdded : new Date().toISOString(),
    }

    try {
      const basePath = ['artifacts', FIRESTORE_APP_ID, 'users', user.uid, 'inventory'] as const
      if (isEditing && item.firestoreId) {
        await updateDoc(doc(db, ...basePath, item.firestoreId), data)
      } else {
        await addDoc(collection(db, ...basePath), data)
      }
      onSaved()
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full sm:max-w-[440px] max-h-[85vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">
            {isEditing ? 'Modifica Inventario' : 'Aggiungi a Inventario'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Condizione */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Condizioni</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full p-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-gray-800"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {condition === 'Altro' && (
              <input
                type="text"
                value={customCond}
                onChange={(e) => setCustomCond(e.target.value)}
                placeholder="Descrizione condizione..."
                className="w-full mt-2 p-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-gray-800"
              />
            )}
          </div>

          {/* Foto */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Foto ({photos.length}/3)
            </label>
            <div className="flex gap-2 flex-wrap">
              {photos.map((src, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                  <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
              {photos.length < 3 && (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition"
                >
                  <Camera size={18} />
                  <span className="text-[9px] mt-0.5">Aggiungi</span>
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhoto}
            />
          </div>

          {/* Note */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-600">Note</label>
              {getApiKey() && (
                <button
                  onClick={handleGenerateNote}
                  disabled={aiNoteLoading}
                  className="flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-500 disabled:opacity-50 transition"
                >
                  <Sparkles size={10} />
                  {aiNoteLoading ? 'Generazione...' : 'Genera con IA'}
                </button>
              )}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Descrizione, dettagli sullo stato, edizione..."
              className="w-full p-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-gray-800 resize-none"
            />
          </div>

          {/* Collocazione */}
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1">
              <MapPin size={12} /> Collocazione
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[10px] text-gray-400">Scaffale</label>
                <input
                  type="text"
                  maxLength={2}
                  value={shelf}
                  onChange={(e) => setShelf(e.target.value.toUpperCase())}
                  placeholder="A"
                  className="w-full p-2 text-sm text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-gray-800 font-bold"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-gray-400">Posizione</label>
                <input
                  type="text"
                  maxLength={2}
                  value={position}
                  onChange={(e) => setPosition(e.target.value.replace(/\D/g, ''))}
                  placeholder="01"
                  className="w-full p-2 text-sm text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-gray-800 font-bold"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-gray-400">Copie</label>
                <input
                  type="number"
                  min={1}
                  value={copies}
                  onChange={(e) => setCopies(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2 text-sm text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-gray-800 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Prezzo acquisto */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Prezzo di acquisto (€/copia)
            </label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              className="w-full p-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-gray-800"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={saving || !shelf || !position}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
          >
            {isEditing ? <Save size={18} /> : <PackagePlus size={18} />}
            {saving ? 'Salvataggio...' : (isEditing ? 'Aggiorna' : 'Salva in Inventario')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default InventoryModal
