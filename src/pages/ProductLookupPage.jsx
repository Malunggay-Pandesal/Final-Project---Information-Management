/**
 * Product Lookup Page — READ-ONLY, no mutation buttons for any user type.
 */
import { useEffect, useState } from 'react'
import { getProducts } from '../services/lookupService'
import Spinner     from '../components/ui/Spinner'
import AlertBanner from '../components/ui/AlertBanner'
import EmptyState  from '../components/ui/EmptyState'

export default function ProductLookupPage() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [search,   setSearch]   = useState('')

  useEffect(() => {
    getProducts().then(({ data, error: err }) => {
      if (err) setError(err.message)
      else     setProducts(data || [])
      setLoading(false)
    })
  }, [])

  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    return (
      p.prodcode?.toLowerCase().includes(q)    ||
      p.description?.toLowerCase().includes(q) ||
      p.unit?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Products</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          Reference lookup — {products.length} records · Read-only
        </p>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400"
             fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input className="input pl-9" placeholder="Search products…"
               value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            title="No products found"
            description={search ? 'Try a different search term.' : 'No product records available.'}
          />
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Prod Code</th>
                <th>Description</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.prodcode}>
                  <td className="font-mono font-medium text-surface-700">{p.prodcode}</td>
                  <td className="font-medium">{p.description}</td>
                  <td className="text-surface-500">{p.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}