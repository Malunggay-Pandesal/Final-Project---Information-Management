import { useAuth } from '../../contexts/AuthContext'

export default function Navbar() {
  const { currentUser, signOut } = useAuth()

  const displayName = currentUser?.username
    || currentUser?.email?.split('@')[0]
    || 'User'

  return (
    <header className="h-13 bg-white border-b border-surface-200 flex items-center
                       justify-between px-6 shrink-0" style={{ height: '52px' }}>
      {/* Page context — breadcrumb style */}
      <p className="text-sm font-semibold text-surface-700 hidden md:block tracking-tight">
        Hope, Inc.
        <span className="mx-2 text-surface-300">/</span>
        <span className="text-surface-400 font-normal">Sales Management System</span>
      </p>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Avatar + name */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-surface-200 flex items-center justify-center">
            <span className="text-xs font-semibold text-surface-600 uppercase">
              {displayName.charAt(0)}
            </span>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-surface-800 leading-none">{displayName}</p>
            <p className="text-[10px] text-surface-400 mt-0.5">{currentUser?.user_type}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-surface-200 hidden sm:block" />

        {/* Sign out */}
        <button
          onClick={signOut}
          className="btn-ghost btn-sm gap-1.5 text-surface-500"
          title="Sign out"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2}
               viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  )
}