/**
 * Customer Lookup Page
 * ─────────────────────
 * READ-ONLY. No add / edit / delete buttons for ANY user type.
 * customer table is SELECT-only per project spec.
 */
import { useEffect, useState } from 'react'
import { getCustomers } from '../services/lookupService'
import Spinner    from '../components/ui/Spinner'
import AlertBanner from '../components/ui/AlertBanner'
import EmptyState  from '../components/ui/EmptyState'

const PAYTERM_LABELS = { COD: 'Cash on Delivery', '30D': 'Net 30 Days', '45D': 'Net 45 Days' }

export default function CustomerLookupPage() {
  const [customers, setCustomers] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [search,    setSearch]    = useState('')

  useEffect(() => {
    getCustomers().then(({ data, error: err }) => {
      if (err) setError(err.message)
      else     setCustomers(data || [])
      setLoading(false)
    })
  }, [])

  const filtered = customers.filter(c => {
    const q = search.toLowerCase()
    return (
      c.custno?.toLowerCase().includes(q)   ||
      c.custname?.toLowerCase().includes(q) ||
      c.address?.toLowerCase().includes(q)  ||
      c.payterm?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Customers</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          Reference lookup — {customers.length} records · Read-only
        </p>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400"
             fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input className="input pl-9" placeholder="Search customers…"
               value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
            title="No customers found"
            description={search ? 'Try a different search term.' : 'No customer records available.'}
          />
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Cust No.</th>
                <th>Name</th>
                <th>Address</th>
                <th>Payment Term</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.custno}>
                  <td className="font-mono font-medium text-surface-700">{c.custno}</td>
                  <td className="font-medium">{c.custname}</td>
                  <td className="text-surface-500 text-xs max-w-xs truncate">{c.address}</td>
                  <td>
                    <span className={
                      c.payterm === 'COD' ? 'badge badge-yellow' :
                      c.payterm === '30D' ? 'badge badge-blue'   : 'badge badge-green'
                    }>
                      {c.payterm}
                    </span>
                    <span className="ml-2 text-xs text-surface-400">{PAYTERM_LABELS[c.payterm]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
