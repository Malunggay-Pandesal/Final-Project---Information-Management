/**
 * Employee Lookup Page — READ-ONLY, no mutation buttons for any user type.
 */
import { useEffect, useState } from 'react'
import { getEmployees } from '../services/lookupService'
import Spinner     from '../components/ui/Spinner'
import AlertBanner from '../components/ui/AlertBanner'
import EmptyState  from '../components/ui/EmptyState'
import { formatDate } from '../utils/format'

export default function EmployeeLookupPage() {
  const [employees, setEmployees] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [search,    setSearch]    = useState('')

  useEffect(() => {
    getEmployees().then(({ data, error: err }) => {
      if (err) setError(err.message)
      else     setEmployees(data || [])
      setLoading(false)
    })
  }, [])

  const filtered = employees.filter(e => {
    const q = search.toLowerCase()
    return (
      e.empno?.toLowerCase().includes(q)     ||
      e.lastname?.toLowerCase().includes(q)  ||
      e.firstname?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Employees</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          Reference lookup — {employees.length} records · Read-only
        </p>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400"
             fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input className="input pl-9" placeholder="Search employees…"
               value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            title="No employees found"
            description={search ? 'Try a different search term.' : 'No employee records available.'}
          />
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Emp No.</th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Gender</th>
                <th>Hire Date</th>
                <th>Sep. Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.empno}>
                  <td className="font-mono font-medium text-surface-700">{e.empno}</td>
                  <td className="font-medium">{e.lastname}</td>
                  <td>{e.firstname}</td>
                  <td>
                    <span className={e.gender === 'M' ? 'badge badge-blue' : 'badge badge-yellow'}>
                      {e.gender === 'M' ? 'Male' : 'Female'}
                    </span>
                  </td>
                  <td className="text-surface-600">{formatDate(e.hiredate)}</td>
                  <td className="text-surface-400">{e.sepDate ? formatDate(e.sepDate) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
