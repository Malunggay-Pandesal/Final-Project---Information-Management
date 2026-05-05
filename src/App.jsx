import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { RightsProvider } from './contexts/RightsContext'
import ProtectedRoute   from './components/layout/ProtectedRoute'
import AdminRoute       from './components/layout/AdminRoute'
import AppShell         from './components/layout/AppShell'
import LoginPage          from './pages/LoginPage'
import RegisterPage       from './pages/RegisterPage'
import AuthCallbackPage   from './pages/AuthCallbackPage'
import SalesListPage      from './pages/SalesListPage'
import SalesDetailPage    from './pages/SalesDetailPage'
import CustomerLookupPage from './pages/CustomerLookupPage'
import EmployeeLookupPage from './pages/EmployeeLookupPage'
import ProductLookupPage  from './pages/ProductLookupPage'
import PriceLookupPage    from './pages/PriceLookupPage'
import ReportsPage        from './pages/ReportsPage'
import DeletedItemsPage   from './pages/DeletedItemsPage'
import AdminPage          from './pages/AdminPage'
import NotFoundPage       from './pages/NotFoundPage'


// --- PLACEHOLDER COMPONENTS (So the code recognizes the routes) ---
const Placeholder = ({ name }) => <div className="p-10"><h1>{name} Page Coming Soon</h1></div>
const LoginPage = () => <Placeholder name="Login" />
const SalesListPage = () => <Placeholder name="Sales List" />
const AppShell = ({ children }) => <div className="min-h-screen bg-gray-50">{/* App Shell Layout */} <main>{/* Outlet would go here */}<Placeholder name="App Shell Container" /></main></div>
const ProtectedRoute = () => <div className="p-4">Authenticated Access Only</div>

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RightsProvider>
          <Routes>
            {/* ── Public routes ── */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* ── Protected Routes ── */}
            <Route path="/" element={<Navigate to="/sales" replace />} />
            <Route path="/sales" element={<SalesListPage />} />

            {/* Fallback */}
            <Route path="*" element={<div>404 - Not Found</div>} />
          </Routes>
        </RightsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}