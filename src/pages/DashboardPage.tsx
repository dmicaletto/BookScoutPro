import { TrendingUp, ShoppingBag, Package, Euro } from 'lucide-react'

// ── Mock data ────────────────────────────────────────────────────────────────

const KPI = [
  { label: 'Vendite questo mese',  value: '23',     unit: 'pz',  icon: ShoppingBag, color: 'text-emerald-600' },
  { label: 'Ricavo netto',         value: '€ 284',  unit: '',    icon: Euro,        color: 'text-blue-600'    },
  { label: 'Libri in inventario',  value: '137',    unit: 'pz',  icon: Package,     color: 'text-violet-600'  },
  { label: 'Margine medio',        value: '62 %',   unit: '',    icon: TrendingUp,  color: 'text-orange-500'  },
]

const MONTHLY = [
  { month: 'Gen', amazon: 8,  ebay: 4,  abebooks: 2  },
  { month: 'Feb', amazon: 12, ebay: 6,  abebooks: 3  },
  { month: 'Mar', amazon: 10, ebay: 5,  abebooks: 4  },
  { month: 'Apr', amazon: 15, ebay: 8,  abebooks: 5  },
  { month: 'Mag', amazon: 18, ebay: 10, abebooks: 3  },
  { month: 'Giu', amazon: 23, ebay: 12, abebooks: 6  },
]

const CHANNELS = [
  { key: 'amazon',   label: 'Amazon',   color: 'bg-orange-400', total: 86  },
  { key: 'ebay',     label: 'eBay',     color: 'bg-blue-400',   total: 45  },
  { key: 'abebooks', label: 'AbeBooks', color: 'bg-emerald-400',total: 23  },
] as const

const TOP_BOOKS = [
  { title: 'Il Nome della Rosa',         channel: 'Amazon',   price: '€ 18,00', margin: '+72%' },
  { title: 'Harry Potter e la Pietra..', channel: 'eBay',     price: '€ 24,50', margin: '+68%' },
  { title: 'Cent\'anni di solitudine',   channel: 'AbeBooks', price: '€ 12,00', margin: '+55%' },
  { title: 'La Divina Commedia',         channel: 'Amazon',   price: '€ 9,90',  margin: '+48%' },
  { title: 'Se questo è un uomo',        channel: 'Amazon',   price: '€ 8,50',  margin: '+42%' },
]

const maxTotal = Math.max(...MONTHLY.map((m) => m.amazon + m.ebay + m.abebooks))

// ── Component ─────────────────────────────────────────────────────────────────

const DashboardPage = () => (
  <div className="flex flex-col gap-4 p-4 fade-in max-w-3xl mx-auto w-full pb-8">
    {/* Header */}
    <div>
      <h2 className="text-2xl font-bold text-white drop-shadow-md">Dashboard</h2>
      <p className="text-sm text-gray-300 mt-0.5">Dati simulati — in attesa di integrazione reale</p>
    </div>

    {/* KPI */}
    <div className="grid grid-cols-2 gap-3">
      {KPI.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="glass-panel rounded-2xl p-4 flex items-start gap-3">
          <div className={`${color} mt-0.5`}><Icon size={22} /></div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900 leading-none">{value}</p>
            <p className="text-xs text-gray-500 mt-1 leading-tight">{label}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Bar chart — Vendite mensili */}
    <div className="glass-panel rounded-2xl p-5">
      <h3 className="font-bold text-gray-900 text-base mb-4">Vendite mensili per canale</h3>

      <div className="flex items-end gap-2 h-36">
        {MONTHLY.map((m) => {
          const total = m.amazon + m.ebay + m.abebooks
          const pct   = (total / maxTotal) * 100
          return (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-gray-500 font-medium">{total}</span>
              <div className="w-full flex flex-col justify-end rounded-t overflow-hidden" style={{ height: `${Math.round(pct)}%`, minHeight: '8px' }}>
                <div className="bg-orange-400" style={{ height: `${Math.round((m.amazon / total) * 100)}%` }} />
                <div className="bg-blue-400"   style={{ height: `${Math.round((m.ebay   / total) * 100)}%` }} />
                <div className="bg-emerald-400"style={{ height: `${Math.round((m.abebooks / total) * 100)}%` }} />
              </div>
              <span className="text-[10px] text-gray-500">{m.month}</span>
            </div>
          )
        })}
      </div>

      {/* Legenda */}
      <div className="flex gap-4 mt-3 justify-center">
        {CHANNELS.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />
            <span className="text-xs text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Canali — donut via cerchi CSS */}
    <div className="glass-panel rounded-2xl p-5">
      <h3 className="font-bold text-gray-900 text-base mb-4">Distribuzione canali (tot. vendite)</h3>
      <div className="flex flex-col gap-2">
        {CHANNELS.map(({ label, color, total }) => {
          const pct = Math.round((total / (86 + 45 + 23)) * 100)
          return (
            <div key={label} className="flex items-center gap-3">
              <span className="text-sm text-gray-700 w-20 shrink-0">{label}</span>
              <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
              </div>
              <span className="text-sm font-bold text-gray-700 w-10 text-right">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>

    {/* Top libri */}
    <div className="glass-panel rounded-2xl p-5">
      <h3 className="font-bold text-gray-900 text-base mb-4">Libri più venduti</h3>
      <div className="divide-y divide-gray-100">
        {TOP_BOOKS.map((b, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5">
            <span className="text-sm font-bold text-gray-400 w-5 shrink-0">{i + 1}</span>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 truncate">{b.title}</p>
              <p className="text-xs text-gray-500">{b.channel}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-gray-800">{b.price}</p>
              <p className="text-xs text-emerald-600 font-semibold">{b.margin}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default DashboardPage
