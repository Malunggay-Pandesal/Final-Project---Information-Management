import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center gap-4 p-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-surface-200">404</p>
        <h1 className="text-2xl font-bold text-surface-800 mt-4">Page not found</h1>
        <p className="text-surface-500 mt-2">The page you're looking for doesn't exist.</p>
        <Link to="/sales" className="btn-primary mt-6 inline-flex">
          Back to Sales
        </Link>
      </div>
    </div>
  )
}
