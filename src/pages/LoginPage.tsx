import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/auth'

const LOGO_URL = 'https://libreriasottomarina.it/wp-content/uploads/2024/04/site-logo.png'

const AUTH_ERRORS: Record<string, string> = {
  'auth/invalid-credential':     'Email o password non corretti.',
  'auth/user-not-found':         'Utente non trovato.',
  'auth/wrong-password':         'Password non corretta.',
  'auth/too-many-requests':      'Troppi tentativi. Riprova tra qualche minuto.',
  'auth/network-request-failed': 'Errore di rete. Verifica la connessione.',
}

const LoginPage = () => {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate                = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      setError(AUTH_ERRORS[code] ?? 'Accesso non riuscito. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="glass-panel rounded-2xl p-8 w-full max-w-sm shadow-xl fade-in">
        <div className="flex flex-col items-center mb-8">
          <img src={LOGO_URL} alt="Libreria Sottomarina" style={{ height: '44px', width: 'auto' }} className="mb-4" />
          <p className="text-gray-500 text-sm">Gestione Inventario — Area Staff</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
              placeholder="nome@email.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 rounded-lg p-3 border border-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60
                       text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Non hai un account?{' '}
          <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
            Registrati
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
