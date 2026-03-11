import { useEffect, useState } from 'react'
import { XIcon } from 'lucide-react'
import type { PublicInfo } from '../../types'

type FormData = {
  title: string
  content: string
  type: PublicInfo['type']
  active: boolean
  image: string
}

const EMPTY: FormData = {
  title: '',
  content: '',
  type: 'promo',
  active: true,
  image: '',
}

interface PublicInfoFormProps {
  initial?: PublicInfo | null
  onSave: (data: Omit<PublicInfo, 'id'>) => Promise<void>
  onClose: () => void
}

const PublicInfoForm = ({ initial, onSave, onClose }: PublicInfoFormProps) => {
  const [form, setForm]       = useState<FormData>(EMPTY)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (initial) {
      setForm({
        title:   initial.title,
        content: initial.content,
        type:    initial.type,
        active:  initial.active,
        image:   initial.image ?? '',
      })
    } else {
      setForm(EMPTY)
    }
    setError('')
  }, [initial])

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

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
        image:     form.image.trim() || undefined,
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

          {/* URL immagine */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              URL immagine <span className="text-gray-400 font-normal">(opzionale)</span>
            </label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => set('image', e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
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
