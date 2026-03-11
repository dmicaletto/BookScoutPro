import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import type { PublicInfo } from '../../types'

const TYPE_LABELS: Record<PublicInfo['type'], string> = {
  promo: 'Promo',
  event: 'Evento',
  info: 'Info',
}

const TYPE_COLORS: Record<PublicInfo['type'], string> = {
  promo: 'bg-emerald-100 text-emerald-700',
  event: 'bg-blue-100 text-blue-700',
  info: 'bg-gray-100 text-gray-600',
}

interface AdminPublicInfoCardProps {
  item: PublicInfo
  onEdit: (item: PublicInfo) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string, active: boolean) => void
}

const AdminPublicInfoCard = ({
  item,
  onEdit,
  onDelete,
  onToggleActive,
}: AdminPublicInfoCardProps) => {
  const handleDelete = () => {
    if (window.confirm('Eliminare definitivamente questo elemento?')) {
      onDelete(item.id)
    }
  }

  const dateStr = item.dateAdded
    ? new Date(item.dateAdded).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
    : ''

  return (
    <div className={`glass-panel p-4 rounded-xl shadow-sm mx-1 flex gap-3 ${!item.active ? 'opacity-60' : ''}`}>
      {/* Immagine */}
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="w-16 h-16 object-cover rounded-lg shrink-0"
        />
      )}

      {/* Contenuto */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${TYPE_COLORS[item.type]}`}>
              {TYPE_LABELS[item.type]}
            </span>
            {!item.active && (
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-red-100 text-red-600">
                Nascosto
              </span>
            )}
          </div>
          <span className="text-[10px] text-gray-500 shrink-0">{dateStr}</span>
        </div>

        <h4 className="font-bold text-gray-900 text-sm mt-1 truncate">{item.title}</h4>
        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{item.content}</p>
      </div>

      {/* Azioni */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <button
          onClick={() => onEdit(item)}
          className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition"
          aria-label="Modifica"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onToggleActive(item.id, !item.active)}
          className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition"
          aria-label={item.active ? 'Nascondi' : 'Mostra'}
        >
          {item.active ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
        <button
          onClick={handleDelete}
          className="w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center transition"
          aria-label="Elimina"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

export default AdminPublicInfoCard
