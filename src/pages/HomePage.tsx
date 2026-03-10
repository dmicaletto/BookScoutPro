import PublicNavbar from '../features/public/PublicNavbar'
import CatalogGrid from '../features/public/CatalogGrid'
import PromotionBanner from '../features/public/PromotionBanner'

const HomePage = () => (
  <div className="min-h-screen flex flex-col bg-transparent overflow-x-hidden">
    {/* Navigation */}
    <PublicNavbar />

    {/* Content */}
    <main className="flex-1 pb-20">
      
      {/* Promozioni ed Eventi (Sezione News) */}
      <section id="promo" className="bg-gradient-to-b from-black/20 to-transparent">
        <PromotionBanner />
      </section>

      {/* Catalogo Libri */}
      <section id="catalog" className="mt-8">
        <CatalogGrid />
      </section>

    </main>

    {/* Footer Pubblico */}
    <footer className="glass-dark border-t border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* About */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-white flex items-center gap-2">
            Libreria Sottomarina
          </h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            Siamo una libreria indipendente nel cuore di Roma, nata dalla passione per i libri rari, 
            le edizioni introvabili e il profumo della carta stampata. Venite a trovarci!
          </p>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Informazioni Legali</h4>
          <div className="space-y-2 text-xs text-gray-500">
            <p>Libreria Sottomarina — Mgml S.R.L.</p>
            <p>P.IVA 13488221006</p>
            <p>Capitale Sociale i.v. € 10.000,00</p>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Contatti & Sede</h4>
          <div className="space-y-2 text-xs text-gray-400">
            <p>Via Filippo Corridoni, 14</p>
            <p>00195 — Roma (RM)</p>
            <p className="mt-4 pt-4 border-t border-white/5">
              Email: info@libreriasottomarina.it
            </p>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest">
          © {new Date().getFullYear()} BookScoutPro — Managed by Mgml S.R.L.
        </p>
      </div>
    </footer>
  </div>
)

export default HomePage

