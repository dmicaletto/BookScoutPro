import PublicNavbar from '../features/public/PublicNavbar'
import PromotionBanner from '../features/public/PromotionBanner'
import PublicFooter from '../features/public/PublicFooter'

const InfoPage = () => (
  <div className="min-h-screen flex flex-col bg-transparent overflow-x-hidden">
    <PublicNavbar />
    <main className="flex-1 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-12">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg">
          Promo & Eventi
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl">
          Rimani aggiornato su tutte le promozioni attive e i prossimi eventi nella nostra libreria.
        </p>
      </div>
      <section className="bg-gradient-to-b from-black/20 to-transparent">
        <PromotionBanner />
      </section>
    </main>
    <PublicFooter />
  </div>
)

export default InfoPage
