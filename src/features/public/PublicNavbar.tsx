import { Link } from 'react-router-dom'
import { LogIn, Book, Megaphone, Phone } from 'lucide-react'

const LOGO_URL = 'https://libreriasottomarina.it/wp-content/uploads/2024/04/site-logo.png'

const PublicNavbar = () => {
  return (
    <nav className="glass-dark border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Nome */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <img
              src={LOGO_URL}
              alt="Libreria Sottomarina"
              className="h-8 w-auto"
            />
            <span className="text-white font-bold text-lg hidden sm:block">
              Libreria Sottomarina
            </span>
          </Link>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/catalog" className="text-gray-300 hover:text-emerald-400 flex items-center gap-1 text-sm font-medium transition">
              <Book size={16} /> Catalogo
            </Link>
            <Link to="/info" className="text-gray-300 hover:text-emerald-400 flex items-center gap-1 text-sm font-medium transition">
              <Megaphone size={16} /> Promo & Eventi
            </Link>
            <Link to="/contacts" className="text-gray-300 hover:text-emerald-400 flex items-center gap-1 text-sm font-medium transition">
              <Phone size={16} /> Contatti
            </Link>
            <Link
              to="/admin/login"
              className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-emerald-600 hover:text-white transition flex items-center gap-1.5"
            >
              <LogIn size={14} /> Area Staff
            </Link>
          </div>

          {/* Mobile Menu Icon (Semplificato per ora) */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/admin/login" className="text-emerald-400 p-2">
              <LogIn size={20} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default PublicNavbar
