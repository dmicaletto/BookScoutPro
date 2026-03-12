import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppShell from './components/AppShell'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import InfoPage from './pages/InfoPage'
import ContactsPage from './pages/ContactsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import InventoryPage from './pages/InventoryPage'
import DashboardPage from './pages/DashboardPage'
import ImportExportPage from './pages/ImportExportPage'
import BookDetailPage from './pages/BookDetailPage'
import ScannerPage from './pages/ScannerPage'
import PublicBookDetailPage from './pages/PublicBookDetailPage'
import AdminPublicInfoPage from './pages/AdminPublicInfoPage'

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Landing pubblica */}
        <Route path="/"                 element={<HomePage />} />
        <Route path="/catalog"          element={<CatalogPage />} />
        <Route path="/catalog/book/:id" element={<PublicBookDetailPage />} />
        <Route path="/info"             element={<InfoPage />} />
        <Route path="/contacts"         element={<ContactsPage />} />

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
            <Route path="dashboard"        element={<DashboardPage />} />
            <Route path="import-export"    element={<ImportExportPage />} />
            <Route path="promotions"       element={<AdminPublicInfoPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
)

export default App
