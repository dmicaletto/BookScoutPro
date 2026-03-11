import { useMemo, useState } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import type { InventoryItem } from '../../types'
import InventoryCard from './InventoryCard'

const ITEMS_PER_PAGE = 10

interface InventoryListProps {
  items: InventoryItem[]
  loading: boolean
  onDelete: (id: string) => void
}

const InventoryList = ({ items, loading, onDelete }: InventoryListProps) => {
  const [search, setSearch]       = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Filtra e ordina
  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim()

    const result = term
      ? items.filter((it) => {
          const titleMatch = it.book.title.toLowerCase().includes(term)
          const shelfPosMatch = (it.location.shelf + it.location.position)
            .toLowerCase()
            .includes(term)
          const shelfOnly = it.location.shelf.toLowerCase().includes(term)
          return titleMatch || shelfPosMatch || shelfOnly
        })
      : [...items]

    result.sort((a, b) => (b.dateAdded || '').localeCompare(a.dateAdded || ''))
    return result
  }, [items, search])

  // Reset pagina quando cambia la ricerca
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const safePage   = Math.min(currentPage, totalPages)

  if (safePage !== currentPage) setCurrentPage(safePage)

  const start          = (safePage - 1) * ITEMS_PER_PAGE
  const paginatedItems = filtered.slice(start, start + ITEMS_PER_PAGE)

  const handleSearch = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  // --- Loading skeleton ---
  if (loading) {
    return (
      <div className="flex flex-col h-full p-2 pt-4 fade-in max-w-2xl mx-auto w-full">
        <div className="flex justify-between items-end mb-4 px-2">
          <div className="h-7 w-32 rounded shimmer" />
          <div className="h-5 w-8 rounded-full shimmer" />
        </div>
        <div className="px-2 mb-2">
          <div className="h-10 rounded-xl shimmer" />
        </div>
        <div className="space-y-3 px-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl shimmer" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full fade-in max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-end mb-4 px-4 pt-4">
        <h2 className="text-2xl font-bold text-white drop-shadow-md">
          Magazzino
        </h2>
        <span className="text-xs text-white bg-emerald-600 px-2 py-1 rounded-full">
          {filtered.length}
        </span>
      </div>

      {/* Ricerca */}
      <div className="px-4 mb-2">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cerca titolo o scaffale..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/90 border border-white/30 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          />
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 space-y-3 pb-2 overflow-y-auto hide-scroll px-4">
        {paginatedItems.length === 0 ? (
          <p className="text-center text-gray-400 mt-8 text-sm">
            Nessun libro trovato.
          </p>
        ) : (
          paginatedItems.map((item) => (
            <InventoryCard
              key={item.firestoreId}
              item={item}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {/* Paginazione */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-6 py-3 glass-dark border-t border-white/10 shrink-0">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="text-white disabled:text-gray-600 hover:text-emerald-400 transition"
            aria-label="Pagina precedente"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-xs text-gray-300">
            Pagina {safePage} di {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="text-white disabled:text-gray-600 hover:text-emerald-400 transition"
            aria-label="Pagina successiva"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  )
}

export default InventoryList
