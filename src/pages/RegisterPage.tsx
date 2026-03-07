import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/auth'

const LOGO_URL = 'https://libreriasottomarina.it/wp-content/uploads/2024/04/site-logo.png'

const AUTH_ERRORS: Record<string, string> = {
  'auth/email-already-in-use': 'Email già registrata.',
  'auth/weak-password':        'Password troppo debole (minimo 6 caratteri).',
  'auth/invalid-email':        'Formato email non valido.',
}

const RegisterPage = () => {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate                = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Le password non coincidono.')
      return
    }
    if (password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri.')
      return
    }
    setLoading(true)
    try {
      await register(email, password)
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      setError(AUTH_ERRORS[code] ?? 'Registrazione non riuscita. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="glass-panel rounded-2xl p-8 w-full max-w-sm shadow-xl fade-in">
        <div className="flex flex-col items-center mb-8">
          <img src={LOGO_URL} alt="Libreria Sottomarina" style={{ height: '44px', width: 'auto' }} className="mb-4" />
          <h1 className="text-xl font-bold text-gray-900">Crea account</h1>
          <p className="text-gray-500 text-sm mt-1">Area Staff — Libreria Sottomarina</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
              placeholder="Minimo 6 caratteri"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conferma password
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
              placeholder="Ripeti la password"
              autoComplete="new-password"
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
            {loading ? 'Registrazione...' : 'Crea account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Hai già un account?{' '}
          <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
