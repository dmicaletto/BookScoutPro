import { useState } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import {
  MenuIcon,
  XIcon,
  BarcodeIcon,
  BoxesIcon,
  PieChartIcon,
  FileInputIcon,
  MegaphoneIcon,
  LogOutIcon,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { logout } from '../services/auth'

const LOGO_URL = 'https://libreriasottomarina.it/wp-content/uploads/2024/04/site-logo.png'

const navItems = [
  { to: '/admin/scanner',       icon: BarcodeIcon,    label: 'Scansiona',         end: true  },
  { to: '/admin/inventory',     icon: BoxesIcon,      label: 'Inventario',        end: false },
  { to: '/admin/promotions',    icon: MegaphoneIcon,  label: 'Promo & Info',      end: false },
  { to: '/admin/dashboard',     icon: PieChartIcon,   label: 'Dashboard',         end: false },
  { to: '/admin/import-export', icon: FileInputIcon,  label: 'Importa / Esporta', end: false },
]

const AppShell = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user }                = useAuth()
  const navigate                = useNavigate()

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div id="app-root" className="relative z-10 w-full h-dvh flex flex-col overflow-hidden">
      {/* Header */}
      <header className="glass-dark px-4 py-3 flex justify-between items-center shadow-lg shrink-0 z-40">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <img
            src={LOGO_URL}
            alt="Libreria Sottomarina"
            style={{ height: '32px', width: 'auto', filter: 'invert(1)' }}
          />
          <span className="text-white font-semibold text-base hidden sm:block">
            Libreria Sottomarina — Staff
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-white/10 text-emerald-400'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Hamburger mobile */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-white hover:text-emerald-400 transition"
          aria-label="Apri menu"
        >
          <MenuIcon size={24} />
        </button>
      </header>

      {/* Menu laterale */}
      {menuOpen && (
        <div className="absolute inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-64 glass-dark shadow-xl flex flex-col p-6 pt-20">
            <div className="flex justify-between items-center mb-8">
              <img
                src={LOGO_URL}
                alt="Libreria Sottomarina"
                style={{ height: '22px', width: 'auto', filter: 'invert(1)' }}
              />
              <button
                onClick={() => setMenuOpen(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Chiudi menu"
              >
                <XIcon size={24} />
              </button>
            </div>

            <nav className="space-y-1 flex-1">
              {navItems.map(({ to, icon: Icon, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition hover:bg-white/10 ${
                      isActive ? 'bg-white/10 text-emerald-400' : 'text-white'
                    }`
                  }
                >
                  <Icon size={18} className="shrink-0" />
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
              {user?.email && (
                <p className="text-xs text-gray-400 px-1 truncate">{user.email}</p>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 rounded-lg w-full text-red-400 hover:bg-white/10 transition"
              >
                <LogOutIcon size={18} />
                Esci
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Area contenuto */}
      <main className="flex-1 overflow-y-auto hide-scroll relative">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="glass-dark shrink-0 border-t border-white/10 px-4 py-2">
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-[10px] text-gray-400 text-center">
            Libreria Sottomarina — Mgml S.R.L. &nbsp;·&nbsp; P.IVA 13488221006
          </p>
          <p className="text-[10px] text-gray-500 text-center">
            Via Filippo Corridoni, 14 &ndash; 00195 Roma
          </p>
        </div>
      </footer>
    </div>
  )
}

export default AppShell
