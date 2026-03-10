import { useMemo, useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { usePublicCatalog } from '../../hooks/usePublicCatalog'
import PublicBookCard from './PublicBookCard'

const CatalogGrid = () => {
  const { items, loading } = usePublicCatalog()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim()
    if (!term) return items
    
    return items.filter((it) => {
      const titleMatch = it.book.title.toLowerCase().includes(term)
      const authorMatch = it.book.author.toLowerCase().includes(term)
      const isbnMatch = it.book.isbn.includes(term)
      return titleMatch || authorMatch || isbnMatch
    })
  }, [items, search])

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
            onChange={(e) => setSearch(e.target.value)}
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
          {filtered.map((item) => (
            <PublicBookCard key={item.firestoreId} item={item} />
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="text-center py-10">
        <p className="text-gray-400 text-sm">
          Stai visualizzando {filtered.length} libri disponibili in magazzino.
        </p>
      </div>
    </div>
  )
}

export default CatalogGrid
