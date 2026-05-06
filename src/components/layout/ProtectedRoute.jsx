import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Spinner from '../ui/Spinner'

/**
 * Blocks unauthenticated or inactive users from accessing any protected page.
 * Redirects to /login if no session exists.
 */
export default function ProtectedRoute() {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-surface-500">Loading session…</p>
        </div>
      </div>
    )
  }

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />
}