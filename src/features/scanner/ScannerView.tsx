import { useState, useEffect, useRef, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { 
  Camera, 
  Search, 
  X, 
  Barcode, 
  Book as BookIcon, 
  Loader2,
  ChevronRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { searchByISBN, searchByTitle } from '../../services/googleBooks'
import type { Book } from '../../types'

const ScannerView = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'scan' | 'search'>('scan')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<Book[]>([])
  
  // States per ricerca manuale
  const [searchValue, setSearchValue] = useState('')
  
  // Scanner state
  const [isScanning, setIsScanning] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const SCANNER_ID = 'reader'

  const stopScanner = useCallback(async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop()
      } catch {
        // ignorato
      }
    }
    setIsScanning(false)
  }, [])

  // Avvia il decoder DOPO che React ha renderizzato il div#reader
  useEffect(() => {
    if (!isScanning) return

    const html5QrCode = new Html5Qrcode(SCANNER_ID)
    scannerRef.current = html5QrCode

    html5QrCode
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => { handleISBNSearch(decodedText) },
        undefined
      )
      .catch(() => {
        setError('Impossibile accedere alla fotocamera.')
        setIsScanning(false)
      })
  }, [isScanning]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => { stopScanner() }
  }, [stopScanner])

  const startScanner = () => {
    setError('')
    setIsScanning(true) // re-render → div#reader in DOM → useEffect lo inizializza
  }

  const handleISBNSearch = async (isbn: string) => {
    stopScanner()
    setLoading(true)
    setError('')
    try {
      const books = await searchByISBN(isbn)
      if (books.length > 0) {
        navigate(`/admin/book/${books[0].isbn}`)
      } else {
        setError('Libro non trovato per questo ISBN.')
      }
    } catch {
      setError('Errore durante la ricerca ISBN.')
    } finally {
      setLoading(false)
    }
  }

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchValue.trim()) return
    
    setLoading(true)
    setError('')
    try {
      // Se sembra un ISBN, cerca per ISBN
      if (/^[0-9X-]{10,17}$/i.test(searchValue.replace(/[-\s]/g, ''))) {
        const books = await searchByISBN(searchValue)
        if (books.length > 0) {
          navigate(`/admin/book/${books[0].isbn}`)
        } else {
          setError('Libro non trovato.')
        }
      } else {
        // Altrimenti cerca per titolo
        const books = await searchByTitle(searchValue)
        setResults(books)
        if (books.length === 0) setError('Nessun risultato trovato.')
      }
    } catch {
      setError('Errore durante la ricerca.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full fade-in">
      {/* Tab Switcher */}
      <div className="flex p-4 gap-2">
        <button
          onClick={() => { setActiveTab('scan'); stopScanner(); setResults([]); setError(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition font-medium ${
            activeTab === 'scan' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/10 text-gray-700 hover:bg-white/20'
          }`}
        >
          <Barcode size={18} />
          Scanner
        </button>
        <button
          onClick={() => { setActiveTab('search'); stopScanner(); setResults([]); setError(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition font-medium ${
            activeTab === 'search' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/10 text-gray-700 hover:bg-white/20'
          }`}
        >
          <Search size={18} />
          Ricerca
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
        
        {activeTab === 'scan' && (
          <div className="space-y-4">
            <div className="glass-panel rounded-2xl overflow-hidden relative h-64 flex flex-col items-center justify-center border-2 border-emerald-500/30">
              {/* div#reader sempre nel DOM: evita "HTML Element not found" */}
              <div id={SCANNER_ID} className={isScanning ? 'w-full h-full' : 'hidden'} />

              {!isScanning && (
                <div className="text-center p-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <Camera size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Avvia Scansione</h3>
                    <p className="text-sm text-gray-500">Inquadra il codice a barre ISBN</p>
                  </div>
                  <button
                    onClick={startScanner}
                    className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-emerald-500 transition"
                  >
                    Apri Fotocamera
                  </button>
                </div>
              )}

              {isScanning && (
                <>
                  <div className="scan-line" />
                  <button
                    onClick={stopScanner}
                    className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                  >
                    <X size={20} />
                  </button>
                </>
              )}
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-400">
                Supporta ISBN-10 e ISBN-13
              </p>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-4">
            <form onSubmit={handleManualSearch} className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="ISBN o Titolo libro..."
                className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-white/90 border border-white/30 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 shadow-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center hover:bg-emerald-500 disabled:opacity-50 transition"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              </button>
            </form>

            {/* Risultati Titolo */}
            <div className="space-y-3">
              {results.map((book, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/admin/book/${book.isbn}`)}
                  className="glass-panel p-3 rounded-xl flex gap-3 items-center cursor-pointer hover:bg-white/40 transition shadow-sm border-l-4 border-l-emerald-500"
                >
                  {book.cover ? (
                    <img src={book.cover} alt="" className="w-12 h-18 object-cover rounded shadow" />
                  ) : (
                    <div className="w-12 h-18 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                      <BookIcon size={20} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{book.title}</h4>
                    <p className="text-xs text-gray-500 truncate">{book.author}</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{book.isbn}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100/90 border border-red-200 rounded-xl text-red-600 text-center text-sm font-medium">
            {error}
          </div>
        )}

        {/* Loading Overlay */}
        {loading && activeTab === 'scan' && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3">
              <Loader2 size={32} className="text-emerald-600 animate-spin" />
              <p className="text-sm font-semibold text-gray-700">Ricerca in corso...</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ScannerView
