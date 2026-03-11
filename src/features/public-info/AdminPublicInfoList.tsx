import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import type { PublicInfo } from '../../types'
import AdminPublicInfoCard from './AdminPublicInfoCard'
import PublicInfoForm from './PublicInfoForm'

const TYPE_FILTERS = [
  { value: 'all',   label: 'Tutti'    },
  { value: 'promo', label: 'Promo'    },
  { value: 'event', label: 'Eventi'   },
  { value: 'info',  label: 'Info'     },
] as const

type Filter = 'all' | PublicInfo['type']

interface AdminPublicInfoListProps {
  items: PublicInfo[]
  loading: boolean
  onAdd: (data: Omit<PublicInfo, 'id'>) => Promise<void>
  onUpdate: (id: string, data: Partial<Omit<PublicInfo, 'id'>>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const AdminPublicInfoList = ({
  items,
  loading,
  onAdd,
  onUpdate,
  onDelete,
}: AdminPublicInfoListProps) => {
  const [filter, setFilter]         = useState<Filter>('all')
  const [showForm, setShowForm]     = useState(false)
  const [editing, setEditing]       = useState<PublicInfo | null>(null)

  const filtered = filter === 'all' ? items : items.filter((i) => i.type === filter)

  const handleEdit = (item: PublicInfo) => {
    setEditing(item)
    setShowForm(true)
  }

  const handleNew = () => {
    setEditing(null)
    setShowForm(true)
  }

  const handleSave = async (data: Omit<PublicInfo, 'id'>) => {
    if (editing) {
      await onUpdate(editing.id, data)
    } else {
      await onAdd(data)
    }
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    await onUpdate(id, { active })
  }

  // --- Loading skeleton ---
  if (loading) {
    return (
      <div className="flex flex-col h-full p-4 fade-in max-w-3xl mx-auto w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="h-7 w-40 rounded shimmer" />
          <div className="h-9 w-24 rounded-xl shimmer" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl shimmer" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full fade-in max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-4 mb-3 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-md">Promo & Info</h2>
          <p className="text-xs text-gray-300 mt-0.5">Contenuti visibili ai clienti</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow transition"
        >
          <PlusIcon size={16} />
          Nuovo
        </button>
      </div>

      {/* Filtri tipo */}
      <div className="flex gap-2 px-4 mb-3 shrink-0 overflow-x-auto hide-scroll pb-1">
        {TYPE_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value as Filter)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              filter === value
                ? 'bg-emerald-600 text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {label}
            {value !== 'all' && (
              <span className="ml-1 opacity-75">
                ({items.filter((i) => i.type === value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="flex-1 space-y-3 overflow-y-auto hide-scroll px-4 pb-4">
        {filtered.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-300 text-sm">Nessun elemento.</p>
            <button
              onClick={handleNew}
              className="mt-3 text-emerald-400 text-sm underline underline-offset-2"
            >
              Crea il primo
            </button>
          </div>
        ) : (
          filtered.map((item) => (
            <AdminPublicInfoCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={onDelete}
              onToggleActive={handleToggleActive}
            />
          ))
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <PublicInfoForm
          initial={editing}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

export default AdminPublicInfoList
