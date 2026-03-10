import { usePublicInfo } from '../../hooks/usePublicCatalog'
import { Megaphone, Calendar, ChevronRight } from 'lucide-react'

const PromotionBanner = () => {
  const { info, loading } = usePublicInfo()

  if (loading || info.length === 0) return null

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2 drop-shadow-md">
          <Megaphone className="text-emerald-400" size={24} /> News & Promo
        </h3>
        <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Libreria Sottomarina</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {info.map((item) => (
          <div 
            key={item.id} 
            className="group relative glass-panel rounded-3xl p-6 border-l-8 border-l-emerald-500 overflow-hidden hover:scale-[1.02] transition-transform duration-300"
          >
            {item.image && (
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 -mr-8 -mt-8 rotate-12 group-hover:rotate-6 transition-transform">
                <img src={item.image} alt="" className="w-full h-full object-contain" />
              </div>
            )}
            
            <div className="flex items-start justify-between mb-4">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                item.type === 'promo' ? 'bg-indigo-100 text-indigo-700' : 
                item.type === 'event' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {item.type}
              </span>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <Calendar size={12} />
                {new Date(item.dateAdded).toLocaleDateString('it-IT')}
              </div>
            </div>

            <h4 className="text-xl font-extrabold text-gray-900 mb-2 leading-tight">
              {item.title}
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {item.content}
            </p>
            
            <button className="flex items-center gap-1 text-emerald-600 text-xs font-bold hover:gap-2 transition-all uppercase">
              Scopri di più <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PromotionBanner
