import PublicNavbar from '../features/public/PublicNavbar'
import CatalogGrid from '../features/public/CatalogGrid'
import PublicFooter from '../features/public/PublicFooter'

const CatalogPage = () => (
  <div className="min-h-screen flex flex-col bg-transparent overflow-x-hidden">
    <PublicNavbar />
    <main className="flex-1 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-12">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg">
          Catalogo Libri
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl">
          Esplora la nostra collezione di libri rari, edizioni esclusive e novità.
        </p>
      </div>
      <section id="catalog">
        <CatalogGrid />
      </section>
    </main>
    <PublicFooter />
  </div>
)

export default CatalogPage
