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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RightsProvider>
          <Routes>
            {/* ── Public routes ── */}
            <Route path="/login"         element={<LoginPage />} />
            <Route path="/register"      element={<RegisterPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            {/* ── Protected: all authenticated active users ── */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route index element={<Navigate to="/sales" replace />} />
                <Route path="/sales"             element={<SalesListPage />} />
                <Route path="/sales/:transNo"    element={<SalesDetailPage />} />
                <Route path="/lookups/customers" element={<CustomerLookupPage />} />
                <Route path="/lookups/employees" element={<EmployeeLookupPage />} />
                <Route path="/lookups/products"  element={<ProductLookupPage />} />
                <Route path="/lookups/prices"    element={<PriceLookupPage />} />
                <Route path="/reports"           element={<ReportsPage />} />

                {/* ── Admin / SuperAdmin only ── */}
                <Route element={<AdminRoute />}>
                  <Route path="/deleted-items" element={<DeletedItemsPage />} />
                  <Route path="/admin"         element={<AdminPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </RightsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
