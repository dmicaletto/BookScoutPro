import { useMemo, useState } from 'react'
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { usePublicCatalog } from '../../hooks/usePublicCatalog'
import PublicBookCard from './PublicBookCard'

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const

const CatalogGrid = () => {
  const { items, loading } = usePublicCatalog()
  const [search, setSearch]       = useState('')
  const [page, setPage]           = useState(0)
  const [pageSize, setPageSize]   = useState<10 | 20 | 50>(20)

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim()
    if (!term) return items
    return items.filter((it) => {
      const titleMatch  = it.book.title.toLowerCase().includes(term)
      const authorMatch = it.book.author.toLowerCase().includes(term)
      const isbnMatch   = it.book.isbn.includes(term)
      return titleMatch || authorMatch || isbnMatch
    })
  }, [items, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated  = filtered.slice(page * pageSize, page * pageSize + pageSize)

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(0)
  }

  const handlePageSize = (size: 10 | 20 | 50) => {
    setPageSize(size)
    setPage(0)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 size={48} className="text-emerald-500 animate-spin" />
        <p className="text-gray-400 font-medium animate-pulse">Caricamento catalogo...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Search Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl drop-shadow-md">
          Esplora il Catalogo
        </h2>
        <p className="text-lg text-gray-300 font-medium">
          Cerca tra centinaia di titoli selezionati con cura.
        </p>
        <div className="relative mt-6">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cerca per titolo, autore o ISBN..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 border-none text-gray-900 placeholder-gray-500 shadow-2xl focus:ring-4 focus:ring-emerald-500/30 transition-shadow outline-none text-lg"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl p-10 mt-10">
          <h3 className="text-xl font-bold text-gray-800">Nessun libro trovato</h3>
          <p className="text-gray-500 mt-2">Prova con altri termini di ricerca.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-12">
          {paginated.map((item) => (
            <PublicBookCard key={item.firestoreId} item={item} />
          ))}
        </div>
      )}

      {/* Paginazione */}
      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">

          {/* Selettore elementi per pagina */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Mostra</span>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                onClick={() => handlePageSize(size)}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  pageSize === size
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {size}
              </button>
            ))}
            <span>per pagina</span>
          </div>

          {/* Controlli prev / pagina / next */}
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Pagina precedente"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="min-w-[100px] text-center">
              Pagina <strong className="text-white">{page + 1}</strong> di <strong className="text-white">{totalPages}</strong>
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Pagina successiva"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Conteggio totale */}
          <p className="text-gray-400 text-sm">
            {filtered.length} libri disponibili
          </p>
        </div>
      )}
    </div>
  )
}

export default CatalogGrid
