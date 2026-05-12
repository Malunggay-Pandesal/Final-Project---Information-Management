import { NavLink } from 'react-router-dom'
import { useAuth }   from '../../contexts/AuthContext'
import { useRights } from '../../contexts/RightsContext'

const Icon = ({ path, className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.75}
       viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
)

const ICONS = {
  sales:    'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  reports:  'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  trash:    'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
  admin:    'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  customer: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  employee: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  product:  'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  price:    'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

function NavItem({ to, icon, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-100 ` +
        (isActive
          ? 'bg-white text-surface-900 font-semibold shadow-sm'
          : 'text-surface-400 font-medium hover:bg-white/10 hover:text-white')
      }
    >
      <Icon path={ICONS[icon]} />
      {label}
    </NavLink>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="px-3 pt-5 pb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-surface-600">
      {children}
    </p>
  )
}

// role colors for the badge with gold
const ROLE_STYLE = {
  SUPERADMIN: 'bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/30',
  ADMIN:      'bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/30',
  USER:       'bg-white/10 text-surface-300 ring-1 ring-white/20',
}

export default function Sidebar() {
  const { currentUser } = useAuth()
  const { isAdmin }     = useRights()


  const displayName = currentUser?.username

    || currentUser?.email?.split('@')[0]

    || 'User'


  return (
  
    <aside className="hidden md:flex flex-col w-60 bg-surface-900 shrink-0">

      {/* ── Brand header ── */}
      <div className="flex items-center gap-3 px-4 py-5">

        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm tracking-tight">H</span>
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-none">Hope SMS</p>

          <p className="text-surface-500 text-[11px] mt-0.5">Sales Management</p>
        </div>
      </div>




      {/* ── user info ── */}
      <div className="mx-3 mb-2 px-3 py-2.5 rounded-lg bg-white/5 border border-white/8">
        <p className="text-white text-xs font-semibold truncate">{displayName}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold
                            ${ROLE_STYLE[currentUser?.user_type] || ROLE_STYLE.USER}`}>
            {currentUser?.user_type}
          </span>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <SectionLabel>Transactions</SectionLabel>
        <NavItem to="/sales" icon="sales" label="Sales Transactions" end />

        <SectionLabel>Lookups</SectionLabel>
        <NavItem to="/lookups/customers" icon="customer" label="Customers" />
        <NavItem to="/lookups/employees" icon="employee" label="Employees" />
        <NavItem to="/lookups/products"  icon="product"  label="Products"  />
        <NavItem to="/lookups/prices"    icon="price"    label="Price History" />

        <SectionLabel>Analytics</SectionLabel>
        <NavItem to="/reports" icon="reports" label="Reports" />

        {/* Admin/SuperAdmin only */}
        {isAdmin && (
          <>
            <SectionLabel>Administration</SectionLabel>
            <NavItem to="/deleted-items" icon="trash" label="Deleted Items" />
            <NavItem to="/admin"         icon="admin" label="User Management" />
          </>
        )}
      </nav>

      {/* ── Footer ── */}
      <div className="px-4 py-3 border-t border-white/8">
        <p className="text-[11px] text-surface-600">Hope, Inc. © {new Date().getFullYear()}</p>
      </div>
    </aside>
  )
}