import { useEffect, useState, useRef } from 'react'
import {
  getSalesByEmployee, getSalesByCustomer, getTopProducts, getMonthlySalesTrend,
} from '../services/reportService'
import { formatCurrency } from '../utils/format'
import Spinner     from '../components/ui/Spinner'
import AlertBanner from '../components/ui/AlertBanner'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts'

const TABS = [
  { key: 'employee', label: 'By Employee' },
  { key: 'customer', label: 'By Customer' },
  { key: 'product',  label: 'Top Products' },
  { key: 'monthly',  label: 'Monthly Trend' },
]

const CustomTooltip = ({ active, payload, label, valueFormatter }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'white',
      border: '1px solid #e5e5e5',
      borderRadius: '10px',
      padding: '10px 14px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      fontSize: '13px',
    }}>
      <p style={{ fontWeight: 600, color: '#171717', marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: 0 }}>
          {p.name}: <strong>{valueFormatter ? valueFormatter(p.value, p.name) : p.value}</strong>
        </p>
      ))}
    </div>
  )
}
// report report
// ── Reusable styled table ─────────────────────────────────────────────────────
function ReportTable({ columns, rows, keyField }) {
  if (!rows.length) return (
    <div className="py-12 text-center text-surface-400 text-sm">No data available.</div>
  )
  return (
    <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e5e5e5' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
        <thead>
          <tr style={{ background: '#fafafa', borderBottom: '1px solid #e5e5e5' }}>
            {columns.map((c, i) => (
              <th key={c.key} style={{
                padding: '11px 16px',
                textAlign: c.align === 'right' ? 'right' : 'left',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#737373',
                whiteSpace: 'nowrap',
                width: c.width || 'auto',
              }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row[keyField] ?? i} style={{
              borderBottom: i < rows.length - 1 ? '1px solid #f5f5f5' : 'none',
              transition: 'background 0.1s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              {columns.map((c, ci) => (
                <td key={c.key} style={{
                  padding: '12px 16px',
                  textAlign: c.align === 'right' ? 'right' : 'left',
                  color: ci === 0 ? '#525252' : '#404040',
                  fontVariantNumeric: c.align === 'right' ? 'tabular-nums' : 'normal',
                  whiteSpace: c.noWrap ? 'nowrap' : 'normal',
                }}>
                  {c.format ? c.format(row[c.key]) : (row[c.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Summary stat strip ────────────────────────────────────────────────────────
function StatStrip({ stats }) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          flex: '1 1 120px',
          background: s.bg || '#f5f5f5',
          borderRadius: '10px',
          padding: '14px 18px',
          minWidth: '120px',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: s.labelColor || '#737373', marginBottom: 4 }}>{s.label}</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: s.valueColor || '#171717', letterSpacing: '-0.02em' }}>{s.value}</div>
        </div>
      ))}
    </div>
  )
}

// ── By Employee ───────────────────────────────────────────────────────────────
function ByEmployeeReport() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    getSalesByEmployee().then(({ data: d, error: e }) => {
      if (e) setError(e.message); else setData(d || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  if (error)   return <AlertBanner type="error" message={error} />

  const totalRev = data.reduce((s, d) => s + parseFloat(d.totalrevenue || 0), 0)
  const totalTx  = data.reduce((s, d) => s + parseInt(d.totaltransactions || 0), 0)

  const chartData = data.slice(0, 10).map(d => ({
    name:    d.empname?.split(',')[0],
    Revenue: parseFloat(d.totalrevenue || 0),
  }))

  return (
    <div className="space-y-5">
      <StatStrip stats={[
        { label: 'Total Revenue',      value: formatCurrency(totalRev), bg: '#eff6ff', labelColor: '#3b82f6', valueColor: '#1d4ed8' },
        { label: 'Total Transactions', value: totalTx.toLocaleString(), bg: '#f0fdf4', labelColor: '#10b981', valueColor: '#065f46' },
        { label: 'Employees',          value: data.length,              bg: '#fafafa', labelColor: '#737373', valueColor: '#171717' },
      ]} />
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} width={48} />
            <Tooltip content={<CustomTooltip valueFormatter={v => formatCurrency(v)} />} />
            <Bar dataKey="Revenue" fill="#3b82f6" radius={[6,6,0,0]} maxBarSize={44} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ReportTable
        keyField="empno"
        columns={[
          { key: 'empno',             label: 'Emp No.',      width: '96px',  noWrap: true, format: v => <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#525252' }}>{v}</span> },
          { key: 'empname',           label: 'Name' },
          { key: 'totaltransactions', label: 'Transactions', width: '130px', align: 'right', noWrap: true },
          { key: 'totalrevenue',      label: 'Total Revenue', width: '150px', align: 'right', noWrap: true, format: formatCurrency },
        ]}
        rows={data}
      />
    </div>
  )
}

// ── By Customer ───────────────────────────────────────────────────────────────
function ByCustomerReport() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    getSalesByCustomer().then(({ data: d, error: e }) => {
      if (e) setError(e.message); else setData(d || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  if (error)   return <AlertBanner type="error" message={error} />

  const totalRev = data.reduce((s, d) => s + parseFloat(d.totalrevenue || 0), 0)
  const totalTx  = data.reduce((s, d) => s + parseInt(d.totaltransactions || 0), 0)

  const chartData = data.slice(0, 10).map(d => ({
    name:    d.custname?.length > 14 ? d.custname.slice(0,14)+'…' : d.custname,
    Revenue: parseFloat(d.totalrevenue || 0),
  }))

  return (
    <div className="space-y-5">
      <StatStrip stats={[
        { label: 'Total Revenue',      value: formatCurrency(totalRev), bg: '#f0fdf4', labelColor: '#10b981', valueColor: '#065f46' },
        { label: 'Total Transactions', value: totalTx.toLocaleString(), bg: '#eff6ff', labelColor: '#3b82f6', valueColor: '#1d4ed8' },
        { label: 'Customers',          value: data.length,              bg: '#fafafa', labelColor: '#737373', valueColor: '#171717' },
      ]} />
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} width={48} />
            <Tooltip content={<CustomTooltip valueFormatter={v => formatCurrency(v)} />} />
            <Bar dataKey="Revenue" fill="#10b981" radius={[6,6,0,0]} maxBarSize={44} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ReportTable
        keyField="custno"
        columns={[
          { key: 'custno',            label: 'Cust No.',    width: '96px',  noWrap: true, format: v => <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#525252' }}>{v}</span> },
          { key: 'custname',          label: 'Customer' },
          { key: 'totaltransactions', label: 'Transactions', width: '130px', align: 'right', noWrap: true },
          { key: 'totalrevenue',      label: 'Total Spend',  width: '150px', align: 'right', noWrap: true, format: formatCurrency },
        ]}
        rows={data}
      />
    </div>
  )
}

// ── Top Products ──────────────────────────────────────────────────────────────
function TopProductsReport() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    getTopProducts().then(({ data: d, error: e }) => {
      if (e) setError(e.message); else setData(d || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  if (error)   return <AlertBanner type="error" message={error} />

  const totalRev = data.reduce((s, d) => s + parseFloat(d.totalrevenue || 0), 0)
  const totalQty = data.reduce((s, d) => s + parseFloat(d.totalqtysold || 0), 0)

  const chartData = data.slice(0, 10).map(d => ({
    name:    d.description?.length > 22 ? d.description.slice(0,22)+'…' : d.description,
    Revenue: parseFloat(d.totalrevenue || 0),
  }))

  return (
    <div className="space-y-5">
      <StatStrip stats={[
        { label: 'Total Revenue',  value: formatCurrency(totalRev), bg: '#faf5ff', labelColor: '#8b5cf6', valueColor: '#5b21b6' },
        { label: 'Total Qty Sold', value: Math.round(totalQty).toLocaleString(), bg: '#fafafa', labelColor: '#737373', valueColor: '#171717' },
        { label: 'Products',       value: data.length,              bg: '#fafafa', labelColor: '#737373', valueColor: '#171717' },
      ]} />
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, left: 160, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#374151' }} axisLine={false} tickLine={false} width={156} />
            <Tooltip content={<CustomTooltip valueFormatter={v => formatCurrency(v)} />} />
            <Bar dataKey="Revenue" fill="#8b5cf6" radius={[0,6,6,0]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ReportTable
        keyField="prodcode"
        columns={[
          { key: 'prodcode',     label: 'Code',     width: '96px',  noWrap: true, format: v => <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#525252' }}>{v}</span> },
          { key: 'description',  label: 'Description' },
          { key: 'totalqtysold', label: 'Qty Sold', width: '110px', align: 'right', noWrap: true, format: v => parseFloat(v||0).toLocaleString() },
          { key: 'totalrevenue', label: 'Revenue',  width: '150px', align: 'right', noWrap: true, format: formatCurrency },
        ]}
        rows={data}
      />
    </div>
  )
}

// ── Monthly Trend ─────────────────────────────────────────────────────────────
function MonthlyTrendReport() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    getMonthlySalesTrend().then(({ data: d, error: e }) => {
      if (e) setError(e.message); else setData(d || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  if (error)   return <AlertBanner type="error" message={error} />

  const totalRev = data.reduce((s, d) => s + parseFloat(d.totalrevenue || 0), 0)
  const totalTx  = data.reduce((s, d) => s + parseInt(d.totaltransactions || 0), 0)
  const avgRev   = data.length ? totalRev / data.length : 0

  const chartData = data.map(d => ({
    month:        d.salemonth,
    Revenue:      parseFloat(d.totalrevenue || 0),
    Transactions: parseInt(d.totaltransactions || 0),
  }))

  return (
    <div className="space-y-5">
      <StatStrip stats={[
        { label: 'Total Revenue',      value: formatCurrency(totalRev), bg: '#eff6ff', labelColor: '#3b82f6', valueColor: '#1d4ed8' },
        { label: 'Total Transactions', value: totalTx.toLocaleString(), bg: '#fffbeb', labelColor: '#f59e0b', valueColor: '#92400e' },
        { label: 'Avg / Month',        value: formatCurrency(avgRev),   bg: '#fafafa', labelColor: '#737373', valueColor: '#171717' },
        { label: 'Months',             value: data.length,              bg: '#fafafa', labelColor: '#737373', valueColor: '#171717' },
      ]} />
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 40, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="rev" orientation="left"  tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} width={48} />
            <YAxis yAxisId="tx"  orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={32} />
            <Tooltip content={<CustomTooltip valueFormatter={(v, name) => name === 'Revenue' ? formatCurrency(v) : v} />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Line yAxisId="rev" type="monotone" dataKey="Revenue"      stroke="#3b82f6" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
            <Line yAxisId="tx"  type="monotone" dataKey="Transactions" stroke="#f59e0b" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <ReportTable
        keyField="salemonth"
        columns={[
          { key: 'salemonth',         label: 'Month',       width: '130px', noWrap: true },
          { key: 'totaltransactions', label: 'Transactions', width: '150px', align: 'right', noWrap: true },
          { key: 'totalrevenue',      label: 'Revenue',     width: '150px', align: 'right', noWrap: true, format: formatCurrency },
        ]}
        rows={data}
      />
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('employee')
  const contentRef = useRef(null)

  function switchTab(key) {
    if (key === activeTab) return
    if (contentRef.current) {
      contentRef.current.classList.remove('tab-enter')
      void contentRef.current.offsetWidth
      contentRef.current.classList.add('tab-enter')
    }
    setActiveTab(key)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Sales Reports</h1>
        <p className="text-sm text-surface-500 mt-0.5">Analytics based on active transactions only.</p>
      </div>

      <div className="flex gap-1 border-b border-surface-200">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => switchTab(tab.key)}
            className={
              `px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 ` +
              (activeTab === tab.key
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300')
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div ref={contentRef} className="card p-6 tab-enter">
        {activeTab === 'employee' && <ByEmployeeReport />}
        {activeTab === 'customer' && <ByCustomerReport />}
        {activeTab === 'product'  && <TopProductsReport />}
        {activeTab === 'monthly'  && <MonthlyTrendReport />}
      </div>
    </div>
  )
}