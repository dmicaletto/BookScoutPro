import { useState } from 'react'
import { XIcon, ExternalLinkIcon, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import type { PublicInfo } from '../../types'

const TYPE_LABELS: Record<PublicInfo['type'], string> = {
  promo: 'Promozione',
  event: 'Evento',
  info:  'Info',
}

const TYPE_COLORS: Record<PublicInfo['type'], string> = {
  promo: 'bg-indigo-100 text-indigo-700',
  event: 'bg-rose-100 text-rose-700',
  info:  'bg-gray-100 text-gray-600',
}

interface PublicInfoDetailModalProps {
  item: PublicInfo
  onClose: () => void
}

const PublicInfoDetailModal = ({ item, onClose }: PublicInfoDetailModalProps) => {
  const photos  = item.photos ?? (item.image ? [item.image] : [])
  const [slide, setSlide] = useState(0)

  const dateStr = new Date(item.dateAdded).toLocaleDateString('it-IT', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  const prev = () => setSlide((s) => (s - 1 + photos.length) % photos.length)
  const next = () => setSlide((s) => (s + 1) % photos.length)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Pannello */}
      <div className="relative z-10 w-full sm:max-w-2xl glass-panel rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92dvh] overflow-y-auto">
        {/* Chiudi */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition"
          aria-label="Chiudi"
        >
          <XIcon size={18} />
        </button>

        {/* Galleria foto */}
        {photos.length > 0 && (
          <div className="relative w-full aspect-video bg-gray-100 rounded-t-3xl overflow-hidden">
            <img
              src={photos[slide]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {photos.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
                  aria-label="Precedente"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
                  aria-label="Successivo"
                >
                  <ChevronRight size={16} />
                </button>
                {/* Indicatori */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlide(i)}
                      className={`w-1.5 h-1.5 rounded-full transition ${i === slide ? 'bg-white' : 'bg-white/50'}`}
                      aria-label={`Foto ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Contenuto */}
        <div className="p-6">
          {/* Badge + data */}
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${TYPE_COLORS[item.type]}`}>
              {TYPE_LABELS[item.type]}
            </span>
            <span className="flex items-center gap-1 text-gray-500 text-xs">
              <Calendar size={12} />
              {dateStr}
            </span>
          </div>

          {/* Titolo */}
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-4">
            {item.title}
          </h2>

          {/* Testo completo */}
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {item.content}
          </p>

          {/* CTA link esterno */}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition"
            >
              Visita il sito <ExternalLinkIcon size={15} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default PublicInfoDetailModal
