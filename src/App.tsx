import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppShell from './components/AppShell'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PlaceholderPage from './pages/PlaceholderPage'

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Route pubbliche */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Route protette — dentro AppShell */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index                   element={<PlaceholderPage title="Scansiona" />} />
            <Route path="inventory"        element={<PlaceholderPage title="Inventario" />} />
            <Route path="dashboard"        element={<PlaceholderPage title="Dashboard" />} />
            <Route path="import-export"    element={<PlaceholderPage title="Importa / Esporta" />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
)

export default App
