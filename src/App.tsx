import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppShell from './components/AppShell'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PlaceholderPage from './pages/PlaceholderPage'
import InventoryPage from './pages/InventoryPage'
import BookDetailPage from './pages/BookDetailPage'
import ScannerPage from './pages/ScannerPage'

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Landing pubblica */}
        <Route path="/" element={<HomePage />} />

        {/* Auth admin */}
        <Route path="/admin/login"    element={<LoginPage />} />
        <Route path="/admin/register" element={<RegisterPage />} />

        {/* Route protette admin — dentro AppShell */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index                   element={<Navigate to="scanner" replace />} />
            <Route path="scanner"          element={<ScannerPage />} />
            <Route path="inventory"        element={<InventoryPage />} />
            <Route path="inventory/:id"    element={<BookDetailPage />} />
            <Route path="book/:isbn"       element={<BookDetailPage />} />
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
