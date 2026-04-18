import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, footer, maxWidth = 'max-w-lg' }) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={`modal-box w-full ${maxWidth}`} role="dialog" aria-modal="true">
        {/* Header */}
        <div className="modal-header">
          <h2 className="text-base font-semibold text-surface-800">{title}</h2>
          <button
            onClick={onClose}
            className="btn-icon btn-ghost text-surface-400 hover:text-surface-700 -mr-2"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">{children}</div>

        {/* Footer */}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}
