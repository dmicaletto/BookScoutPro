import { ShoppingCart, Store, BookOpen, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { InventoryItem } from '../../types'

interface PublicBookCardProps {
  item: InventoryItem
}

function conditionColor(cond: string) {
  if (cond.includes('Nuovo') || cond.includes('Ottimo'))
    return 'bg-emerald-100/90 text-emerald-700'
  if (cond.includes('Accettabile') || cond.includes('Danneggiato'))
    return 'bg-orange-100/90 text-orange-700'
  return 'bg-gray-100/90 text-gray-500'
}

const PublicBookCard = ({ item }: PublicBookCardProps) => {
  const { book, myPrices, condition } = item
  
  // Trova il miglior prezzo pubblico disponibile
  const activePriceKey = (Object.keys(myPrices) as (keyof typeof myPrices)[]).find(k => myPrices[k])
  const activePrice = activePriceKey ? myPrices[activePriceKey] : null

  return (
    <Link 
      to={`/catalog/book/${item.firestoreId}`}
      className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block h-full flex flex-col group"
    >
      {/* Immagine con badge condizione */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <BookOpen size={48} />
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5 pointer-events-none">
          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase shadow-sm ${conditionColor(condition)}`}>
            {condition}
          </span>
          {activePrice && (
            <span className="bg-indigo-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-md">
              € {activePrice}
            </span>
          )}
        </div>
      </div>

      {/* Dettagli libro */}
      <div className="p-4 flex-1 flex flex-col">
        <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
          {book.title}
        </h4>
        <p className="text-xs text-gray-500 mb-3 truncate font-medium">
          {book.author}
        </p>
        
        {/* Footer con icone canali */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-1.5">
            {myPrices.amazon && <ShoppingCart size={14} className="text-gray-400 group-hover:text-yellow-600 transition" />}
            {myPrices.ebay && <Store size={14} className="text-gray-400 group-hover:text-blue-500 transition" />}
            {myPrices.abebooks && <BookOpen size={14} className="text-gray-400 group-hover:text-red-700 transition" />}
          </div>
          <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
        </div>
      </div>
    </Link>
  )
}

export default PublicBookCard
