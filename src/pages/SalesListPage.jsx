import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth }   from '../contexts/AuthContext'
import { useRights } from '../contexts/RightsContext'
import {
  getSales, createSale, updateSale, softDeleteSale, recoverSale, getLatestTransNo,
} from '../services/salesService'
import { getCustomers, getEmployees } from '../services/lookupService'
import { formatDate, formatCurrency, nextTransNo } from '../utils/format'
import Modal       from '../components/ui/Modal'
import Spinner     from '../components/ui/Spinner'
import AlertBanner from '../components/ui/AlertBanner'
import EmptyState  from '../components/ui/EmptyState'

// ── Add / Edit Form ──────────────────────────────────────────────────────────
function SaleForm({ initial, customers, employees, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    transNo:   initial?.transno   || '',
    salesDate: initial?.salesdate || new Date().toISOString().split('T')[0],
    custNo:    initial?.custno    || '',
    empNo:     initial?.empno     || '',
  })
  const [errors, setErrors] = useState({})


  
  function validate() {
    const e = {}
    if (!form.transNo.trim())  e.transNo   = 'Transaction number is required.'
    if (!form.salesDate)       e.salesDate = 'Date is required.'
    if (!form.custNo)          e.custNo    = 'Customer is required.'
    if (!form.empNo)           e.empNo     = 'Employee is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (validate()) onSave(form)
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <label className="label">Transaction No.</label>
        <input
          className={`input font-mono ${errors.transNo ? 'input-error' : ''}`}
          value={form.transNo}
          onChange={set('transNo')}
          disabled={!!initial?.transno}  // locked when editing
          placeholder="TR000125"
        />
        {errors.transNo && <p className="error-msg">{errors.transNo}</p>}
      </div>

      <div className="form-group">
        <label className="label">Sales Date</label>
        <input
          type="date"
          className={`input ${errors.salesDate ? 'input-error' : ''}`}
          value={form.salesDate}
          onChange={set('salesDate')}
        />
        {errors.salesDate && <p className="error-msg">{errors.salesDate}</p>}
      </div>

      <div className="form-group">
        <label className="label">Customer</label>
        <select
          className={`input ${errors.custNo ? 'input-error' : ''}`}
          value={form.custNo}
          onChange={set('custNo')}
        >
          <option value="">— Select customer —</option>
          {customers.map(c => (
            <option key={c.custno} value={c.custno}>
              {c.custname} ({c.custno})
            </option>
          ))}
        </select>
        {errors.custNo && <p className="error-msg">{errors.custNo}</p>}
      </div>

      <div className="form-group">
        <label className="label">Sales Agent (Employee)</label>
        <select
          className={`input ${errors.empNo ? 'input-error' : ''}`}
          value={form.empNo}
          onChange={set('empNo')}
        >
          <option value="">— Select employee —</option>
          {employees.map(e => (
            <option key={e.empno} value={e.empno}>
              {e.lastname}, {e.firstname} ({e.empno})
            </option>
          ))}
        </select>
        {errors.empNo && <p className="error-msg">{errors.empNo}</p>}
      </div>

      <div className="modal-footer px-0 pb-0">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? <><Spinner size="sm" /> Saving…</> : 'Save Transaction'}
        </button>
      </div>
    </form>
  )
}

// ── Confirm dialog ────────────────────────────────────────────────────────────
function ConfirmDialog({ open, onClose, onConfirm, loading, transNo }) {
  return (
    <Modal open={open} onClose={onClose} title="Soft-Delete Transaction"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn-danger"    onClick={onConfirm} disabled={loading}>
            {loading ? <><Spinner size="sm" /> Deleting…</> : 'Yes, soft-delete'}
          </button>
        </>
      }
    >
      <p className="text-sm text-surface-600">
        Are you sure you want to soft-delete transaction{' '}
        <span className="font-mono font-semibold">{transNo}</span>?
      </p>
      <p className="text-sm text-surface-500 mt-2">
        All line items for this transaction will also be marked as INACTIVE.
        This can be recovered by an Admin.
      </p>
    </Modal>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function SalesListPage() {
  const { currentUser }                   = useAuth()
  const { isAdmin, isSuperAdmin, checkRight } = useRights()

  const [sales,     setSales]     = useState([])
  const [customers, setCustomers] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')
  const [search,    setSearch]    = useState('')

  // Modal state
  const [addOpen,    setAddOpen]    = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [delTarget,  setDelTarget]  = useState(null)
  const [saving,     setSaving]     = useState(false)
  const [deleting,   setDeleting]   = useState(false)
  const [recovering, setRecovering] = useState(null)

  // Suggested next transno
  const [nextTrans, setNextTrans] = useState('')

  const fetchSales = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await getSales()
    if (err) setError(err.message)
    else     setSales(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSales()
    getCustomers().then(({ data }) => setCustomers(data || []))
    getEmployees().then(({ data }) => setEmployees(data || []))
  }, [fetchSales])

  async function openAdd() {
    const { data } = await getLatestTransNo()
    setNextTrans(nextTransNo(data?.transno))
    setAddOpen(true)
  }

  async function handleCreate(form) {
    setSaving(true)
    const { error: err } = await createSale({ ...form, userId: currentUser.userId })
    if (err) setError(err.message)
    else {
      setSuccess(`Transaction ${form.transNo} created.`)
      setAddOpen(false)
      fetchSales()
    }
    setSaving(false)
  }

  async function handleEdit(form) {
    setSaving(true)
    const { error: err } = await updateSale(form.transNo, { ...form, userId: currentUser.userId })
    if (err) setError(err.message)
    else {
      setSuccess(`Transaction ${form.transNo} updated.`)
      setEditTarget(null)
      fetchSales()
    }
    setSaving(false)
  }

  async function handleDelete() {
    setDeleting(true)
    const { error: err } = await softDeleteSale(delTarget.transno, currentUser.userId)
    if (err) setError(err.message)
    else {
      setSuccess(`Transaction ${delTarget.transno} soft-deleted.`)
      setDelTarget(null)
      fetchSales()
    }
    setDeleting(false)
  }

  async function handleRecover(transno) {
    setRecovering(transno)
    const { error: err } = await recoverSale(transno, currentUser.userId)
    if (err) setError(err.message)
    else {
      setSuccess(`Transaction ${transno} and its line items recovered.`)
      fetchSales()
    }
    setRecovering(null)
  }

  // Filter by search — all view columns are now lowercase
  const filtered = sales.filter(s => {
    const q = search.toLowerCase()
    return (
      s.transno?.toLowerCase().includes(q)   ||
      s.custname?.toLowerCase().includes(q)  ||
      s.empname?.toLowerCase().includes(q)   ||
      s.salesdate?.includes(q)
    )
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Sales Transactions</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            {sales.length} active transaction{sales.length !== 1 ? 's' : ''}
          </p>
        </div>
        {/* Create button — gated by SALES_ADD */}
        {checkRight('SALES_ADD') && (
          <button className="btn-primary" onClick={openAdd}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Transaction
          </button>
        )}
      </div>

      {/* Feedback banners */}
      {error   && <AlertBanner type="error"   message={error}   onDismiss={() => setError('')}   />}
      {success && <AlertBanner type="success" message={success} onDismiss={() => setSuccess('')} />}

      {/* Search */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400"
             fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input
          className="input pl-9"
          placeholder="Search transactions…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            title="No transactions found"
            description={search ? 'Try a different search term.' : 'Create the first transaction to get started.'}
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
                <th>Sales Agent</th>
                <th>Items</th>
                <th>Total Amount</th>
                {isAdmin && <th>Status</th>}
                {isAdmin && <th>Stamp</th>}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.transno} className={s.record_status === 'INACTIVE' ? 'opacity-60' : ''}>
                  <td>
                    <Link to={`/sales/${s.transno}`}
                          className="font-mono text-brand-600 hover:text-brand-800 hover:underline font-medium">
                      {s.transno}
                    </Link>
                  </td>
                  <td className="text-surface-600">{formatDate(s.salesdate)}</td>
                  <td>
                    <span className="font-medium">{s.custname}</span>
                    <span className="text-xs text-surface-400 ml-1">({s.custno})</span>
                  </td>
                  <td className="text-surface-600">{s.empname}</td>
                  <td className="text-center">
                    <span className="badge badge-blue">{s.lineitemcount ?? 0}</span>
                  </td>
                  <td className="font-medium tabular-nums">
                    {s.totalamount ? formatCurrency(s.totalamount) : '—'}
                  </td>
                  {isAdmin && (
                    <td>
                      <span className={s.record_status === 'ACTIVE' ? 'badge-green badge' : 'badge-red badge'}>
                        {s.record_status}
                      </span>
                    </td>
                  )}
                  {isAdmin && (
                    <td className="max-w-xs truncate text-xs text-surface-400 font-mono">
                      {s.stamp || '—'}
                    </td>
                  )}
                  <td>
                    <div className="flex items-center gap-1 justify-end">
                      {/* View detail */}
                      <Link to={`/sales/${s.transno}`} className="btn-ghost btn-sm" title="View details">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      {/* Edit — gated by SALES_EDIT, ACTIVE only */}
                      {rights.SALES_EDIT === 1 && s.record_status === 'ACTIVE' && (
                        <button className="btn-ghost btn-sm" title="Edit" onClick={() => setEditTarget(s)}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      {/* Soft-delete — gated by SALES_DEL (SUPERADMIN only), ACTIVE only */}
                      {rights.SALES_DEL === 1 && s.record_status === 'ACTIVE' && (
                        <button className="btn-ghost btn-sm text-red-500 hover:text-red-700 hover:bg-red-50"
                                title="Soft-delete" onClick={() => setDelTarget(s)}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                      {/* Recover — INACTIVE rows only, ADMIN / SUPERADMIN */}
                      {isAdmin && s.record_status === 'INACTIVE' && (
                        <button
                          className="btn-ghost btn-sm text-green-600 hover:text-green-800 hover:bg-green-50"
                          title="Recover transaction"
                          onClick={() => handleRecover(s.transno)}
                          disabled={recovering === s.transno}
                        >
                          {recovering === s.transno ? <Spinner size="sm" /> : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="New Sales Transaction">
        <SaleForm
          initial={{ transno: nextTrans }}
          customers={customers}
          employees={employees}
          onSave={handleCreate}
          onCancel={() => setAddOpen(false)}
          saving={saving}
        />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Sales Transaction">
        <SaleForm
          initial={editTarget}
          customers={customers}
          employees={employees}
          onSave={handleEdit}
          onCancel={() => setEditTarget(null)}
          saving={saving}
        />
      </Modal>

      {/* Soft-delete confirm */}
      <ConfirmDialog
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        transNo={delTarget?.transno}
      />
    </div>
  )
}