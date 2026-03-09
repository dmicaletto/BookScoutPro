import { Link } from 'react-router-dom'
import { LogIn } from 'lucide-react'

const LOGO_URL = 'https://libreriasottomarina.it/wp-content/uploads/2024/04/site-logo.png'

const HomePage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-6">
    <div className="glass-panel rounded-2xl p-10 w-full max-w-sm shadow-xl fade-in text-center">
      <img
        src={LOGO_URL}
        alt="Libreria Sottomarina"
        style={{ height: '52px', width: 'auto' }}
        className="mx-auto mb-6"
      />

      <h1 className="text-xl font-bold text-gray-800 mb-2">
        Libreria Sottomarina
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Catalogo libri in arrivo...
      </p>

      <Link
        to="/admin/login"
        className="inline-flex items-center gap-2 text-sm text-emerald-600 font-semibold hover:underline"
      >
        <LogIn size={16} />
        Area Staff
      </Link>
    </div>

    <footer className="mt-6 text-center">
      <p className="text-[10px] text-gray-400">
        Libreria Sottomarina — Mgml S.R.L. &nbsp;&middot;&nbsp; P.IVA 13488221006
      </p>
      <p className="text-[10px] text-gray-500">
        Via Filippo Corridoni, 14 &ndash; 00195 Roma
      </p>
    </footer>
  </div>
)

export default HomePage
