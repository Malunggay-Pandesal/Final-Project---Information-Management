/**
 * Admin (User Management) Page — ADMIN / SUPERADMIN only.
 * * Member 4 Contribution (Sprint 3):
 * - W5 PR-02: SUPERADMIN-protected row logic.
 * - Implemented UI-level disabling of action buttons for SuperAdmin accounts.
 */
import { useEffect, useState, useCallback } from 'react'
import { useAuth }   from '../contexts/AuthContext'
import { useRights } from '../contexts/RightsContext'
import { getUsers, activateUser, deactivateUser } from '../services/adminService'
import Spinner     from '../components/ui/Spinner'
import AlertBanner from '../components/ui/AlertBanner'
import EmptyState  from '../components/ui/EmptyState'

const USER_TYPE_BADGE = {
  SUPERADMIN: 'badge badge-blue',
  ADMIN:      'badge badge-green',
  USER:       'badge badge-gray',
}

export default function AdminPage() {
  const { currentUser }    = useAuth()
  const { isSuperAdmin }   = useRights()

  const [users,     setUsers]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')
  const [acting,     setActing]    = useState(null) 
  const [search,     setSearch]    = useState('')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await getUsers()
    if (err) setError(err.message)
    else     setUsers(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  async function handleActivate(userId, username) {
    setActing(userId)
    const { error: err } = await activateUser(userId, currentUser.userId)
    if (err) setError(err.message)
    else {
      setSuccess(`${username} activated.`)
      fetchUsers()
    }
    setActing(null)
  }

  async function handleDeactivate(userId, username) {
    setActing(userId)
    const { error: err } = await deactivateUser(userId, currentUser.userId)
    if (err) setError(err.message)
    else {
      setSuccess(`${username} deactivated.`)
      fetchUsers()
    }
    setActing(null)
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    return (
      u.username?.toLowerCase().includes(q) ||
      u.user_type?.toLowerCase().includes(q)
    )
  })

  // Member 4 Helper: Identify SuperAdmin rows
  const isSuperAdminRow = (u) => u.user_type === 'SUPERADMIN'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900">User Management</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          Activate or deactivate user accounts. SUPERADMIN rows are protected.
        </p>
      </div>

      {error   && <AlertBanner type="error"   message={error}   onDismiss={() => setError('')}   />}
      {success && <AlertBanner type="success" message={success} onDismiss={() => setSuccess('')} />}

      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400"
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input className="input pl-9" placeholder="Search users…"
                value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            title="No users found"
          />
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Stamp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const isSuper    = isSuperAdminRow(u)
                const isActingOn = acting === u.userId
                
                // Member 4: Core Logic for SuperAdmin Protection
                // If the target row is a SUPERADMIN, the action is disabled for regular ADMINS.
                const canAct = isSuperAdmin || !isSuper

                return (
                  <tr key={u.userId} className={isSuper ? 'bg-blue-50/30 font-semibold' : ''}>
                    <td className="font-mono text-xs text-surface-400">{u.userId?.slice(0, 8)}…</td>
                    <td className="font-medium">
                      {u.username || '(no name)'}
                      {u.userId === currentUser?.userId && (
                        <span className="ml-2 text-xs text-surface-400">(you)</span>
                      )}
                    </td>
                    <td>
                      <span className={USER_TYPE_BADGE[u.user_type] || 'badge badge-gray'}>
                        {u.user_type}
                      </span>
                    </td>
                    <td>
                      <span className={u.record_status === 'ACTIVE' ? 'badge badge-green' : 'badge badge-red'}>
                        {u.record_status}
                      </span>
                    </td>
                    <td className="text-xs font-mono text-surface-400 max-w-xs truncate">{u.stamp || '—'}</td>
                    <td>
                      {/* Member 4: Sprint 3 Security Guard Implementation */}
                      {isSuper ? (
                        <span
                          className="text-xs text-indigo-600 font-bold italic"
                          title="SUPERADMIN accounts are system-protected and cannot be modified."
                        >
                          🛡️ Protected
                        </span>
                      ) : u.record_status === 'ACTIVE' ? (
                        <button
                          className="btn-danger btn-sm"
                          onClick={() => handleDeactivate(u.userId, u.username)}
                          disabled={!canAct || isActingOn || u.userId === currentUser?.userId}
                          title={!canAct ? 'Cannot modify SUPERADMIN' : 'Deactivate account'}
                        >
                          {isActingOn ? <Spinner size="sm" /> : 'Deactivate'}
                        </button>
                      ) : (
                        <button
                          className="btn-success btn-sm"
                          onClick={() => handleActivate(u.userId, u.username)}
                          disabled={!canAct || isActingOn}
                          title={!canAct ? 'Cannot modify SUPERADMIN' : 'Activate account'}
                        >
                          {isActingOn ? <Spinner size="sm" /> : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}