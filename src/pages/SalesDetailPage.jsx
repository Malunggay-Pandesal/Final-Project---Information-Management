import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth }   from '../contexts/AuthContext'
import { useRights } from '../contexts/RightsContext'
import {
  getDetailByTrans, addDetailLine, updateDetailLine, softDeleteDetailLine,
} from '../services/salesDetailService'
import { getSales } from '../services/salesService'
import { getProducts, getCurrentPrice } from '../services/lookupService'
import { formatDate, formatCurrency } from '../utils/format'
import Modal       from '../components/ui/Modal'
import Spinner     from '../components/ui/Spinner'
import AlertBanner from '../components/ui/AlertBanner'
import EmptyState  from '../components/ui/EmptyState'

// ── Add / Edit line item form─────────────────────────────────────────────────
function DetailForm({ initial, products, onSave, onCancel, saving }) {
  const [prodCode,     setProdCode]     = useState(initial?.prodcode  || '')
  const [quantity,     setQuantity]     = useState(initial?.quantity  || '')
  const [unitPrice,    setUnitPrice]    = useState(initial?.unitprice || '')
  const [loadingPrice, setLoadingPrice] = useState(false)
  const [errors,       setErrors]       = useState({})

  async function handleProductChange(e) {
    const code = e.target.value
    setProdCode(code)
    setUnitPrice('')
    if (!code) return
    setLoadingPrice(true)
    const { data } = await getCurrentPrice(code)
    if (data) setUnitPrice(data.unitprice)
    setLoadingPrice(false)
  }

  function validate() {
    const e = {}
    if (!prodCode)                             e.prodCode = 'Product is required.'
    if (!quantity || parseFloat(quantity) < 0) e.quantity = 'Quantity must be ≥ 0.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    if (validate()) onSave({ prodCode, quantity: parseFloat(quantity) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <label className="label">Product</label>
        <select
          className={`input ${errors.prodCode ? 'input-error' : ''}`}
          value={prodCode}
          onChange={handleProductChange}
          disabled={!!initial}
        >
          <option value="">— Select product —</option>
          {products.map(p => (
            <option key={p.prodcode} value={p.prodcode}>
              {p.description} ({p.prodcode}) — {p.unit}
            </option>
          ))}
        </select>
        {errors.prodCode && <p className="error-msg">{errors.prodCode}</p>}
      </div>

      <div className="form-group">
        <label className="label">
          Unit Price
          {loadingPrice && <Spinner size="sm" className="inline-block ml-2" />}
        </label>
        <input
          type="number"
          className="input bg-surface-50"
          value={unitPrice}
          readOnly
          placeholder="Auto-filled from price history"
        />
        <p className="text-xs text-surface-400 mt-1">
          Auto-filled from the latest price history entry.
        </p>
      </div>

      <div className="form-group">
        <label className="label">Quantity</label>
        <input
          type="number"
          step="0.01"
          min="0"
          className={`input ${errors.quantity ? 'input-error' : ''}`}
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          placeholder="0.00"
        />
        {errors.quantity && <p className="error-msg">{errors.quantity}</p>}
      </div>

      {unitPrice && quantity && (
        <div className="bg-surface-100 border border-surface-200 rounded-lg px-4 py-3">
          <p className="text-sm text-surface-700">
            Line total:{' '}
            <span className="font-bold">
              {formatCurrency(parseFloat(unitPrice) * parseFloat(quantity))}
            </span>
          </p>
        </div>
      )}

      <div className="modal-footer px-0 pb-0">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={saving || loadingPrice}>
          {saving ? <><Spinner size="sm" /> Saving…</> : 'Save Line Item'}
        </button>
      </div>
    </form>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function SalesDetailPage() {
  const { transNo }         = useParams()
  const { currentUser }     = useAuth()
  const { rights, isAdmin } = useRights()

  const [transaction, setTransaction] = useState(null)
  const [lines,       setLines]       = useState([])
  const [products,    setProducts]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState('')

  const [addOpen,    setAddOpen]    = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [delTarget,  setDelTarget]  = useState(null)
  const [saving,     setSaving]     = useState(false)
  const [deleting,   setDeleting]   = useState(false)

  const fetchLines = useCallback(async () => {
    const { data, error: err } = await getDetailByTrans(transNo)
    if (err) setError(err.message)
    else     setLines(data || [])
  }, [transNo])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getSales(),
      fetchLines(),
      getProducts().then(({ data }) => setProducts(data || [])),
    ]).then(([salesRes]) => {
      const tx = (salesRes.data || []).find(s => s.transno === transNo)
      setTransaction(tx || null)
      setLoading(false)
    })
  }, [transNo, fetchLines])

  async function handleAdd(form) {
    setSaving(true)
    const { error: err } = await addDetailLine({ ...form, transNo, userId: currentUser.userId })
    if (err) setError(err.message)
    else {
      setSuccess(`Line item ${form.prodCode} added.`)
      setAddOpen(false)
      fetchLines()
    }
    setSaving(false)
  }

  async function handleEdit(form) {
    setSaving(true)
    const { error: err } = await updateDetailLine(transNo, editTarget.prodcode, {
      quantity: form.quantity, userId: currentUser.userId,
    })
    if (err) setError(err.message)
    else {
      setSuccess('Line item updated.')
      setEditTarget(null)
      fetchLines()
    }
    setSaving(false)
  }

  async function handleDelete() {
    setDeleting(true)
    const { error: err } = await softDeleteDetailLine(transNo, delTarget.prodcode, currentUser.userId)
    if (err) setError(err.message)
    else {
      setSuccess(`Line item ${delTarget.prodcode} soft-deleted.`)
      setDelTarget(null)
      fetchLines()
    }
    setDeleting(false)
  }

  const totalAmount = lines.reduce(
    (sum, l) => sum + (parseFloat(l.quantity) * parseFloat(l.unitprice || 0)), 0
  )

  const availableProducts = products.filter(
    p => !lines.some(l => l.prodcode === p.prodcode)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  // Count columns: always 6 data cols + 1 actions col = 7
  // If isAdmin: add Stamp col = 8
  const dataColSpan = 5  // Product Code + Description + Unit + Unit Price + Quantity

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link to="/sales"
            className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-800">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Sales
      </Link>

      {/* Feedback */}
      {error   && <AlertBanner type="error"   message={error}   onDismiss={() => setError('')}   />}
      {success && <AlertBanner type="success" message={success} onDismiss={() => setSuccess('')} />}

      {/* Transaction header card */}
      {transaction ? (
        <div className="card p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold font-mono text-surface-900">{transaction.transno}</h1>
                <span className={transaction.record_status === 'ACTIVE'
                  ? 'badge badge-green' : 'badge badge-red'}>
                  {transaction.record_status}
                </span>
              </div>
              <p className="text-sm text-surface-500">Sales Transaction</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-surface-900">{formatCurrency(totalAmount)}</p>
              <p className="text-xs text-surface-400">
                {lines.length} line item{lines.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-surface-100">
            <div>
              <p className="stat-label">Date</p>
              <p className="text-sm font-medium text-surface-800">{formatDate(transaction.salesdate)}</p>
            </div>
            <div>
              <p className="stat-label">Customer</p>
              <p className="text-sm font-medium text-surface-800">{transaction.custname}</p>
              <p className="text-xs text-surface-400">{transaction.custno} · {transaction.payterm}</p>
            </div>
            <div>
              <p className="stat-label">Sales Agent</p>
              <p className="text-sm font-medium text-surface-800">{transaction.empname}</p>
              <p className="text-xs text-surface-400">{transaction.empno}</p>
            </div>
            {isAdmin && (
              <div>
                <p className="stat-label">Stamp</p>
                <p className="text-xs font-mono text-surface-400 break-all">
                  {transaction.stamp || '—'}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card p-6">
          <p className="text-surface-500">
            Transaction <span className="font-mono font-semibold">{transNo}</span> not found.
          </p>
        </div>
      )}

      {/* Line items section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-surface-800">Line Items</h2>

          {/* Add line item — gated by SD_ADD */}
          {rights.SD_ADD === 1 && transaction?.record_status === 'ACTIVE' && (
            <button className="btn-primary btn-sm" onClick={() => setAddOpen(true)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Line Item
            </button>
          )}
        </div>

        {lines.length === 0 ? (
          <div className="card">
            <EmptyState
              icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              title="No line items yet"
              description={
                rights.SD_ADD === 1
                  ? 'Add the first product to this transaction.'
                  : 'No products in this transaction.'
              }
            />
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Product Code</th>
                  <th>Description</th>
                  <th>Unit</th>
                  <th className="text-right">Unit Price</th>
                  <th className="text-right">Quantity</th>
                  <th className="text-right">Line Total</th>
                  {isAdmin && <th>Stamp</th>}
                  {/* Actions col — always present so totals row aligns */}
                  <th className="w-20"></th>
                </tr>
              </thead>
              <tbody>
                {lines.map(l => (
                  <tr key={l.prodcode}>
                    <td className="font-mono font-medium text-surface-700">{l.prodcode}</td>
                    <td className="font-medium">{l.description}</td>
                    <td className="text-surface-500">{l.unit}</td>
                    <td className="text-right tabular-nums">{formatCurrency(l.unitprice)}</td>
                    <td className="text-right tabular-nums">
                      {parseFloat(l.quantity).toLocaleString()}
                    </td>
                    <td className="text-right tabular-nums font-semibold">
                      {formatCurrency(parseFloat(l.quantity) * parseFloat(l.unitprice || 0))}
                    </td>
                    {isAdmin && (
                      <td className="max-w-xs truncate text-xs font-mono text-surface-400">
                        {l.stamp || '—'}
                      </td>
                    )}
                    <td>
                      <div className="flex items-center gap-1 justify-end">
                        {/* Edit — gated by SD_EDIT */}
                        {rights.SD_EDIT === 1 && (
                          <button
                            className="btn-ghost btn-sm"
                            title="Edit quantity"
                            onClick={() => setEditTarget(l)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                 strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}
                        {/* Soft-delete — gated by SD_DEL (SUPERADMIN only) */}
                        {rights.SD_DEL === 1 && (
                          <button
                            className="btn-ghost btn-sm text-red-500 hover:bg-red-50"
                            title="Soft-delete line item"
                            onClick={() => setDelTarget(l)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                 strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {/* ── Totals row — colSpan must match header exactly ── */}
                <tr className="bg-surface-50 font-semibold">
                  {/* Product Code + Description + Unit + Unit Price + Quantity = 5 cols */}
                  <td colSpan={5} className="text-right text-surface-700 px-4 py-3">
                    Total
                  </td>
                  {/* Line Total */}
                  <td className="text-right tabular-nums text-surface-900 px-4 py-3">
                    {formatCurrency(totalAmount)}
                  </td>
                  {/* Stamp (admin only) */}
                  {isAdmin && <td />}
                  {/* Actions  */}
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add line item modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Line Item">
        <DetailForm
          products={availableProducts}
          onSave={handleAdd}
          onCancel={() => setAddOpen(false)}
          saving={saving}
        />
      </Modal>

      {/* Edit line item modal */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Line Item">
        <DetailForm
          initial={editTarget}
          products={products}
          onSave={handleEdit}
          onCancel={() => setEditTarget(null)}
          saving={saving}
        />
      </Modal>

      {/* Soft-delete confirm */}
      <Modal
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        title="Soft-Delete Line Item"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setDelTarget(null)} disabled={deleting}>
              Cancel
            </button>
            <button className="btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? <><Spinner size="sm" /> Deleting…</> : 'Yes, soft-delete'}
            </button>
          </>
        }
      >
        <p className="text-sm text-surface-600">
          Soft-delete line item{' '}
          <span className="font-mono font-semibold">{delTarget?.prodcode}</span>{' '}
          from <span className="font-mono font-semibold">{transNo}</span>?
        </p>
      </Modal>
    </div>
  )
}