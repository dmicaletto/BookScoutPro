import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, ShoppingCart, Store, ExternalLink } from 'lucide-react'
import { usePublicBook } from '../hooks/usePublicCatalog'
import PublicNavbar from '../features/public/PublicNavbar'

function conditionColor(cond: string) {
  if (cond.includes('Nuovo') || cond.includes('Ottimo'))
    return 'bg-emerald-100 text-emerald-700'
  if (cond.includes('Accettabile') || cond.includes('Danneggiato'))
    return 'bg-orange-100 text-orange-700'
  return 'bg-gray-100 text-gray-500'
}

const PublicBookDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { item, loading } = usePublicBook(id)

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-white font-medium">Caricamento scheda libro...</p>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNavbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4 text-center">
          <h2 className="text-2xl font-bold text-white">Libro non trovato</h2>
          <p className="text-gray-400">Il libro cercato potrebbe essere stato già venduto.</p>
          <button 
            onClick={() => navigate('/catalog')}
            className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-500 transition"
          >
            Torna al Catalogo
          </button>
        </div>
      </div>
    )
  }

  const { book, myPrices, condition, photos } = item

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <PublicNavbar />
      
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-10 space-y-8">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition font-medium"
        >
          <ArrowLeft size={20} /> Torna indietro
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left: Book Cover & Gallery */}
          <div className="space-y-4">
            <div className="glass-panel p-2 rounded-3xl overflow-hidden shadow-2xl">
              {book.cover ? (
                <img 
                  src={book.cover} 
                  alt={book.title} 
                  className="w-full rounded-2xl shadow-inner aspect-[3/4] object-cover"
                />
              ) : (
                <div className="w-full aspect-[3/4] rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">
                  <BookOpen size={64} />
                </div>
              )}
            </div>

            {/* Galleria Foto Utente */}
            {photos && photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {photos.map((src, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden glass-panel border border-white/20">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Purchase */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${conditionColor(condition)}`}>
                Condizione: {condition}
              </span>
              <h1 className="text-3xl font-extrabold text-white leading-tight drop-shadow-md">
                {book.title}
              </h1>
              <p className="text-xl text-gray-300 font-medium">
                di {book.author}
              </p>
            </div>

            <div className="h-px bg-white/10 w-full" />

            {/* Disponibilità & Prezzi */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Disponibilità su Canali</h3>
              <div className="grid grid-cols-1 gap-3">
                
                {myPrices.amazon && (
                  <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-yellow-500 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="text-yellow-600" size={20} />
                      <div>
                        <p className="text-xs text-gray-500 font-bold">Amazon</p>
                        <p className="text-lg font-bold text-gray-900">€ {myPrices.amazon}</p>
                      </div>
                    </div>
                    {book.links?.amazon && (
                      <a href={book.links.amazon} target="_blank" rel="noopener noreferrer" className="bg-yellow-500 text-white p-2 rounded-xl hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                )}

                {myPrices.ebay && (
                  <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-blue-500 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Store className="text-blue-500" size={20} />
                      <div>
                        <p className="text-xs text-gray-500 font-bold">eBay</p>
                        <p className="text-lg font-bold text-gray-900">€ {myPrices.ebay}</p>
                      </div>
                    </div>
                    {book.links?.ebay && (
                      <a href={book.links.ebay} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-400 transition shadow-lg shadow-blue-500/20">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                )}

                {myPrices.abebooks && (
                  <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-red-600 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="text-red-700" size={20} />
                      <div>
                        <p className="text-xs text-gray-500 font-bold">AbeBooks</p>
                        <p className="text-lg font-bold text-gray-900">€ {myPrices.abebooks}</p>
                      </div>
                    </div>
                    {book.links?.abebooks && (
                      <a href={book.links.abebooks} target="_blank" rel="noopener noreferrer" className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-500 transition shadow-lg shadow-red-600/20">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Note descrittive se disponibili */}
            {item.notes && (
              <div className="glass-panel p-6 rounded-3xl space-y-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Descrizione & Note</h3>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {item.notes}
                </p>
              </div>
            )}
            
            <div className="pt-6">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider text-center">
                ISBN-13/ID: {book.isbn}
              </p>
            </div>

          </div>
        </div>

      </main>
    </div>
  )
}

export default PublicBookDetailPage
