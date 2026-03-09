import { Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { InventoryItem } from '../../types'

interface InventoryCardProps {
  item: InventoryItem
  onDelete: (id: string) => void
}

function conditionColor(cond: string) {
  if (cond.includes('Nuovo') || cond.includes('Ottimo'))
    return 'bg-emerald-100 text-emerald-700'
  if (cond.includes('Accettabile') || cond.includes('Danneggiato'))
    return 'bg-orange-100 text-orange-700'
  return 'bg-gray-100 text-gray-500'
}

function conditionLabel(cond: string) {
  return cond.length > 10 ? cond.substring(0, 8) + '..' : cond
}

const InventoryCard = ({ item, onDelete }: InventoryCardProps) => {
  const navigate = useNavigate()
  const cond = item.condition || 'Buono'

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Eliminare definitivamente?')) {
      onDelete(item.firestoreId!)
    }
  }

  return (
    <div
      onClick={() => navigate(`/admin/inventory/${item.firestoreId}`)}
      className="glass-panel p-3 rounded-xl flex gap-3 items-center shadow-sm mx-1 cursor-pointer hover:bg-white/40 transition"
    >
      {/* Scaffale */}
      <div className="bg-gray-800 text-white w-12 h-12 rounded-lg flex flex-col items-center justify-center shrink-0 border border-emerald-500/50 relative">
        <span className="text-[10px] font-bold text-emerald-400">
          {item.location.shelf}
        </span>
        <span className="text-md font-bold leading-none">
          {item.location.position}
        </span>
        {item.copies > 1 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white">
            x{item.copies}
          </div>
        )}
      </div>

      {/* Info libro */}
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-gray-900 truncate text-sm max-w-[70%]">
            {item.book.title}
          </h4>
          <span
            className={`text-[9px] px-1.5 rounded font-bold uppercase ${conditionColor(cond)}`}
          >
            {conditionLabel(cond)}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {item.book.prices?.amazon && (
            <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 rounded">
              Mkt: &euro;{item.book.prices.amazon}
            </span>
          )}
          {item.myPrices?.amazon && (
            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 rounded font-bold">
              Tu: &euro;{item.myPrices.amazon}
            </span>
          )}
        </div>
      </div>

      {/* Elimina */}
      <button
        onClick={handleDelete}
        className="w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center transition shrink-0 ml-1"
        aria-label="Elimina libro"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

export default InventoryCard
