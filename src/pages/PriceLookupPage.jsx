/**
 * Price History Lookup Page — READ-ONLY, no mutation buttons for any user type.
 */
import { useEffect, useState } from 'react'
import { getPriceHistory } from '../services/lookupService'
import { formatDate, formatCurrency } from '../utils/format'
import Spinner     from '../components/ui/Spinner'
import AlertBanner from '../components/ui/AlertBanner'
import EmptyState  from '../components/ui/EmptyState'

export default function PriceLookupPage() {
  const [prices,  setPrices]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    getPriceHistory().then(({ data, error: err }) => {
      if (err) setError(err.message)
      else     setPrices(data || [])
      setLoading(false)
    })
  }, [])

  const filtered = prices.filter(p => {
    const q = search.toLowerCase()
    return p.prodCode?.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Price History</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          Reference lookup — {prices.length} price entries · Read-only
        </p>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400"
             fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input className="input pl-9" placeholder="Filter by product code…"
               value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            title="No price history found"
          />
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Prod Code</th>
                <th>Effective Date</th>
                <th className="text-right">Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={`${p.prodCode}-${p.effDate}`}>
                  <td className="font-mono font-medium text-surface-700">{p.prodCode}</td>
                  <td className="text-surface-600">{formatDate(p.effDate)}</td>
                  <td className="text-right tabular-nums font-medium">{formatCurrency(p.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
