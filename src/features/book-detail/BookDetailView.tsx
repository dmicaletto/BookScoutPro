import { useState, useEffect } from 'react'
import {
  ShoppingCart,
  Store,
  BookOpen,
  ExternalLink,
  Sparkles,
  PackagePlus,
  Save,
  ArrowLeft,
  KeyRound,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { InventoryItem, BookPrices } from '../../types'
import { analyzeBook, getApiKey, loadApiKeyFromFirestore, saveApiKeyToFirestore } from '../../services/gemini'
import { useAuth } from '../../context/AuthContext'
import InventoryModal from './InventoryModal'

interface BookDetailViewProps {
  item: InventoryItem
  isEditing: boolean
}

const CHANNELS = [
  { key: 'amazon' as const, label: 'Amazon', icon: ShoppingCart, border: 'border-l-yellow-500' },
  { key: 'ebay' as const, label: 'eBay', icon: Store, border: 'border-l-blue-500' },
  { key: 'abebooks' as const, label: 'AbeBooks', icon: BookOpen, border: 'border-l-red-700' },
]

function conditionColor(cond: string) {
  if (cond.includes('Nuovo') || cond.includes('Ottimo'))
    return 'bg-emerald-100 text-emerald-700'
  if (cond.includes('Accettabile') || cond.includes('Danneggiato'))
    return 'bg-orange-100 text-orange-700'
  return 'bg-gray-100 text-gray-500'
}

const BookDetailView = ({ item, isEditing }: BookDetailViewProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [myPrices, setMyPrices] = useState<BookPrices>({ ...item.myPrices })
  const [strategy, setStrategy] = useState(item.book.strategy ?? '')
  const [aiLoading, setAiLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showKeyPrompt, setShowKeyPrompt] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState('')

  useEffect(() => {
    if (user) loadApiKeyFromFirestore(user.uid)
  }, [user])

  const book = item.book

  const updatePrice = (channel: keyof BookPrices, value: string) => {
    setMyPrices((prev) => ({ ...prev, [channel]: value }))
  }

  const handleGemini = async () => {
    if (!getApiKey()) {
      setShowKeyPrompt(true)
      return
    }
    setAiLoading(true)
    try {
      const result = await analyzeBook(book, item.condition)
      setStrategy(result)
    } catch (err) {
      const msg = (err as Error).message
      if (msg === 'API_KEY_MISSING') {
        setShowKeyPrompt(true)
      } else {
        setStrategy(`Errore: ${msg}`)
      }
    } finally {
      setAiLoading(false)
    }
  }

  const handleSaveKey = async () => {
    if (apiKeyInput.trim() && user) {
      await saveApiKeyToFirestore(user.uid, apiKeyInput.trim())
      setShowKeyPrompt(false)
      setApiKeyInput('')
      handleGemini()
    }
  }

  return (
    <div className="fade-in max-w-3xl mx-auto w-full">
      <div className="p-4 space-y-4">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition mb-2"
        >
          <ArrowLeft size={16} />
          Indietro
        </button>

        {/* Header libro */}
        <div className="glass-panel rounded-xl p-4 flex gap-4">
          {book.cover ? (
            <img
              src={book.cover}
              alt={book.title}
              className="w-24 h-36 object-cover rounded-lg shadow-md shrink-0"
            />
          ) : (
            <div className="w-24 h-36 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
              <BookOpen size={32} className="text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 font-mono mb-1">
              {book.isbn !== 'NO-ISBN' ? book.isbn : 'Senza ISBN'}
            </p>
            <h2 className="font-bold text-gray-900 text-lg leading-tight mb-1">
              {book.title}
            </h2>
            <p className="text-sm text-gray-600 mb-2">{book.author}</p>

            {isEditing && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${conditionColor(item.condition)}`}>
                  {item.condition}
                </span>
                <span className="text-[10px] bg-gray-800 text-emerald-400 px-2 py-0.5 rounded font-bold">
                  {item.location.shelf}-{item.location.position}
                </span>
                {item.copies > 1 && (
                  <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                    x{item.copies}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Prezzi marketplace */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white px-1">Prezzi Marketplace</h3>
          {CHANNELS.map(({ key, label, icon: Icon, border }) => (
            <div
              key={key}
              className={`glass-panel rounded-lg p-3 border-l-4 ${border} flex items-center gap-3`}
            >
              <Icon size={18} className="text-gray-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-semibold text-gray-800">
                  {book.prices[key] ? `€ ${book.prices[key]}` : '—'}
                </p>
              </div>
              <input
                type="text"
                value={myPrices[key]}
                onChange={(e) => updatePrice(key, e.target.value)}
                placeholder="Il mio €"
                className="w-20 text-right text-sm p-1.5 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-gray-800"
              />
              {book.links?.[key] && (
                <a
                  href={book.links[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-500 transition shrink-0"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* AI Insight */}
        <div className="glass-panel rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-800">BookScout AI Insight</h3>
            <button
              onClick={handleGemini}
              disabled={aiLoading}
              className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg transition"
            >
              <Sparkles size={12} />
              {aiLoading ? 'Analisi in corso...' : 'Analizza'}
            </button>
          </div>
          {strategy ? (
            <p className="text-sm text-gray-700 leading-relaxed">{strategy}</p>
          ) : (
            <p className="text-sm text-gray-400 italic">
              Clicca &quot;Analizza&quot; per eseguire un&apos;analisi di mercato sul libro...
            </p>
          )}
        </div>

        {/* API Key prompt */}
        {showKeyPrompt && (
          <div className="glass-panel rounded-xl p-4 border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <KeyRound size={16} className="text-indigo-500" />
              <h4 className="text-sm font-semibold text-gray-800">Google API Key</h4>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Inserisci la tua API Key con Gemini API abilitata.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 text-sm p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-400 text-gray-800"
              />
              <button
                onClick={handleSaveKey}
                className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-500 transition"
              >
                Salva
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer azione */}
      <div className="sticky bottom-0 p-4 glass-dark border-t border-white/10">
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition"
        >
          {isEditing ? (
            <>
              <Save size={18} />
              Aggiorna Dati
            </>
          ) : (
            <>
              <PackagePlus size={18} />
              Aggiungi a Inventario
            </>
          )}
        </button>
      </div>

      {/* Modal inventario */}
      {showModal && (
        <InventoryModal
          item={item}
          myPrices={myPrices}
          isEditing={isEditing}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false)
            navigate('/admin/inventory')
          }}
        />
      )}
    </div>
  )
}

export default BookDetailView
