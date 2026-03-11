import PublicNavbar from '../features/public/PublicNavbar'
import CatalogGrid from '../features/public/CatalogGrid'
import PromotionBanner from '../features/public/PromotionBanner'
import PublicFooter from '../features/public/PublicFooter'

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
    <PublicFooter />
  </div>
)

export default HomePage

