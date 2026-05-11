/**
 * Deleted Items Page — ADMIN / SUPERADMIN only.
 * Shows INACTIVE sales transactions and INACTIVE salesDetail rows.
 * Allows recovery (set record_status = 'ACTIVE').
 * Route guard (AdminRoute) blocks USER accounts at the router level.
 */







import { useEffect, useState, useCallback } from 'react'
import { useAuth }   from '../contexts/AuthContext'
import { getDeletedSales, recoverSale }        from '../services/salesService'
import { getDeletedDetailLines, recoverDetailLine } from '../services/salesDetailService'
import { formatDate, formatCurrency }          from '../utils/format'
import Spinner     from '../components/ui/Spinner'
import AlertBanner from '../components/ui/AlertBanner'
import EmptyState  from '../components/ui/EmptyState'

const TABS = [
  { key: 'transactions', label: 'Transactions' },
  { key: 'lineitems',    label: 'Line Items' },
]

export default function DeletedItemsPage() {
  const { currentUser } = useAuth()

  const [tab,       setTab]       = useState('transactions')
  const [sales,     setSales]     = useState([])
  const [lines,     setLines]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')
  const [recovering, setRecovering] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [s, l] = await Promise.all([getDeletedSales(), getDeletedDetailLines()])
    if (s.error) setError(s.error.message)
    else         setSales(s.data || [])
    if (l.error) setError(l.error.message)
    else         setLines(l.data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  async function handleRecoverSale(transNo) {
    setRecovering(transNo)
    const { error: err } = await recoverSale(transNo, currentUser.userId)
    if (err) setError(err.message)
    else {
      setSuccess(`Transaction ${transNo} and all its line items restored.`)
      fetchAll()
    }
    setRecovering(null)
  }

  async function handleRecoverLine(transNo, prodCode) {
    const key = `${transNo}-${prodCode}`
    setRecovering(key)
    const { error: err } = await recoverDetailLine(transNo, prodCode, currentUser.userId)
    if (err) setError(err.message)
    else {
      setSuccess(`Line item ${prodCode} in ${transNo} restored.`)
      fetchAll()
    }
    setRecovering(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Deleted Items</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          INACTIVE records — recoverable by Admin and SuperAdmin.
        </p>
      </div>

      {error   && <AlertBanner type="error"   message={error}   onDismiss={() => setError('')}   />}
      {success && <AlertBanner type="success" message={success} onDismiss={() => setSuccess('')} />}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-surface-200">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ` +
              (tab === t.key
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-surface-500 hover:text-surface-700')}
          >
            {t.label}
            <span className="ml-2 badge badge-red">
              {t.key === 'transactions' ? sales.length : lines.length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : tab === 'transactions' ? (
        sales.length === 0 ? (
          <div className="card">
            <EmptyState
              icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              title="No deleted transactions"
              description="All transactions are active."
            />
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Trans No.</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Agent</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Stamp</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sales.map(s => (
                  <tr key={s.transNo} className="opacity-75">
                    <td className="font-mono font-medium text-surface-600">{s.transNo}</td>
                    <td className="text-surface-500">{formatDate(s.salesDate)}</td>
                    <td>{s.custname}</td>
                    <td>{s.empName}</td>
                    <td className="text-center">{s.lineitemcount ?? 0}</td>
                    <td className="tabular-nums">{s.totalamount ? formatCurrency(s.totalamount) : '—'}</td>
                    <td className="text-xs font-mono text-surface-400 max-w-xs truncate">{s.stamp || '—'}</td>
                    <td>
                      <button
                        className="btn-success btn-sm"
                        onClick={() => handleRecoverSale(s.transNo)}
                        disabled={recovering === s.transNo}
                      >
                        {recovering === s.transNo ? <Spinner size="sm" /> : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        )}
                        Recover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        lines.length === 0 ? (
          <div className="card">
            <EmptyState
              icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              title="No deleted line items"
              description="All line items are active."
            />
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Trans No.</th>
                  <th>Prod Code</th>
                  <th>Description</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Unit Price</th>
                  <th>Stamp</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lines.map(l => {
                  const key = `${l.transNo}-${l.prodCode}`
                  return (
                    <tr key={key} className="opacity-75">
                      <td className="font-mono text-surface-600">{l.transNo}</td>
                      <td className="font-mono font-medium">{l.prodCode}</td>
                      <td>{l.description}</td>
                      <td className="text-right tabular-nums">{parseFloat(l.quantity).toLocaleString()}</td>
                      <td className="text-right tabular-nums">{formatCurrency(l.unitprice)}</td>
                      <td className="text-xs font-mono text-surface-400 max-w-xs truncate">{l.stamp || '—'}</td>
                      <td>
                        <button
                          className="btn-success btn-sm"
                          onClick={() => handleRecoverLine(l.transNo, l.prodCode)}
                          disabled={recovering === key}
                        >
                          {recovering === key ? <Spinner size="sm" /> : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          )}
                          Recover
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  )
}
