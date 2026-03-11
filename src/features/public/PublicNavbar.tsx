import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LogIn, Book, Megaphone, Phone, MenuIcon, XIcon } from 'lucide-react'

const LOGO_URL = 'https://libreriasottomarina.it/wp-content/uploads/2024/04/site-logo.png'

const navLinks = [
  { to: '/catalog',  icon: Book,      label: 'Catalogo'      },
  { to: '/info',     icon: Megaphone, label: 'Promo & Eventi' },
  { to: '/contacts', icon: Phone,     label: 'Contatti'       },
]

const PublicNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="glass-dark border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <img src={LOGO_URL} alt="Libreria Sottomarina" className="h-8 w-auto" />
            <span className="text-white font-bold text-lg hidden sm:block">
              Libreria Sottomarina
            </span>
          </Link>

          {/* Nav desktop */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1 text-sm font-medium transition ${
                    isActive ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'
                  }`
                }
              >
                <Icon size={16} /> {label}
              </NavLink>
            ))}
            <Link
              to="/admin/login"
              className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-emerald-600 hover:text-white transition flex items-center gap-1.5"
            >
              <LogIn size={14} /> Area Staff
            </Link>
          </div>

          {/* Hamburger mobile */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-white hover:text-emerald-400 transition p-1"
            aria-label="Apri menu"
          >
            <MenuIcon size={24} />
          </button>
        </div>
      </div>

      {/* Drawer mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-64 glass-dark shadow-xl flex flex-col p-6 pt-8">
            <div className="flex justify-between items-center mb-8">
              <img src={LOGO_URL} alt="Libreria Sottomarina" className="h-6 w-auto" />
              <button
                onClick={() => setMenuOpen(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Chiudi menu"
              >
                <XIcon size={24} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 flex-1">
              {navLinks.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition hover:bg-white/10 ${
                      isActive ? 'bg-white/10 text-emerald-400' : 'text-white'
                    }`
                  }
                >
                  <Icon size={18} className="shrink-0" /> {label}
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-white/10 pt-4">
              <Link
                to="/admin/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg text-emerald-400 hover:bg-white/10 transition text-sm font-medium"
              >
                <LogIn size={18} /> Area Staff
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default PublicNavbar
