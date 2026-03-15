import { useEffect, useRef, useState } from 'react'
import { XIcon, ImagePlusIcon, Trash2Icon } from 'lucide-react'
import type { PublicInfo } from '../../types'

type FormData = {
  title: string
  content: string
  type: PublicInfo['type']
  active: boolean
  url: string
  photos: string[]
}

const EMPTY: FormData = {
  title: '',
  content: '',
  type: 'promo',
  active: true,
  url: '',
  photos: [],
}

interface PublicInfoFormProps {
  initial?: PublicInfo | null
  onSave: (data: Omit<PublicInfo, 'id'>) => Promise<void>
  onClose: () => void
}

const PublicInfoForm = ({ initial, onSave, onClose }: PublicInfoFormProps) => {
  const [form, setForm]     = useState<FormData>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')
  const fileRef             = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initial) {
      setForm({
        title:   initial.title,
        content: initial.content,
        type:    initial.type,
        active:  initial.active,
        url:     initial.url ?? '',
        photos:  initial.photos ?? [],
      })
    } else {
      setForm(EMPTY)
    }
    setError('')
  }, [initial])

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  // Converti file caricati in base64 e aggiungili a photos
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image()
        img.onload = () => {
          const MAX = 1200
          const scale = Math.min(1, MAX / Math.max(img.width, img.height))
          const canvas = document.createElement('canvas')
          canvas.width  = Math.round(img.width  * scale)
          canvas.height = Math.round(img.height * scale)
          canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
          const compressed = canvas.toDataURL('image/jpeg', 0.75)
          setForm((f) => ({ ...f, photos: [...f.photos, compressed] }))
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const removePhoto = (index: number) =>
    setForm((f) => ({ ...f, photos: f.photos.filter((_, i) => i !== index) }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Il titolo è obbligatorio.'); return }
    if (!form.content.trim()) { setError('Il contenuto è obbligatorio.'); return }

    setSaving(true)
    try {
      await onSave({
        title:     form.title.trim(),
        content:   form.content.trim(),
        type:      form.type,
        active:    form.active,
        url:       form.url.trim() || undefined,
        photos:    form.photos.length > 0 ? form.photos : undefined,
        dateAdded: initial?.dateAdded ?? new Date().toISOString(),
      })
      onClose()
    } catch {
      setError('Errore durante il salvataggio. Riprova.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Pannello */}
      <div className="relative z-10 w-full sm:max-w-lg glass-panel rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[92dvh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-gray-900">
            {initial ? 'Modifica elemento' : 'Nuovo elemento'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
            aria-label="Chiudi"
          >
            <XIcon size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo</label>
            <div className="flex gap-2">
              {(['promo', 'event', 'info'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set('type', t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition border ${
                    form.type === t
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'
                  }`}
                >
                  {t === 'promo' ? 'Promo' : t === 'event' ? 'Evento' : 'Info'}
                </button>
              ))}
            </div>
          </div>

          {/* Titolo */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Titolo *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="es. Saldi estivi 30%"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            />
          </div>

          {/* Contenuto */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Contenuto *</label>
            <textarea
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              rows={4}
              placeholder="Descrizione visibile ai clienti..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 resize-none"
            />
          </div>

          {/* URL esterno */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              URL <span className="text-gray-400 font-normal">(link evento/promo — opzionale)</span>
            </label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => set('url', e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            />
          </div>

          {/* Upload foto */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Foto <span className="text-gray-400 font-normal">(opzionale)</span>
            </label>

            {/* Preview thumbnails */}
            {form.photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {form.photos.map((src, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                      aria-label="Rimuovi foto"
                    >
                      <Trash2Icon size={14} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Pulsante aggiungi */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 text-sm hover:border-emerald-400 hover:text-emerald-600 transition w-full justify-center"
            >
              <ImagePlusIcon size={16} />
              Aggiungi foto
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          {/* Visibile */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set('active', !form.active)}
              className={`w-11 h-6 rounded-full transition-colors relative ${form.active ? 'bg-emerald-500' : 'bg-gray-300'}`}
              aria-label="Visibile ai clienti"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.active ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
            <span className="text-sm text-gray-700">
              {form.active ? 'Visibile ai clienti' : 'Nascosto'}
            </span>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          {/* Bottoni */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 transition"
            >
              {saving ? 'Salvataggio...' : 'Salva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PublicInfoForm
