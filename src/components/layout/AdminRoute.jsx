import { Navigate, Outlet } from 'react-router-dom'
import { useAuth }   from '../../contexts/AuthContext'
import { useRights } from '../../contexts/RightsContext'

/**
 * Restricts routes to ADMIN and SUPERADMIN only.
 * USER accounts attempting to access /deleted-items or /admin
 * are redirected to /sales.
 */
export default function AdminRoute() {
  const { currentUser } = useAuth()
  const { isAdmin }     = useRights()

  if (!currentUser) return <Navigate to="/login"  replace />
  if (!isAdmin)     return <Navigate to="/sales"  replace />

  return <Outlet />
}
