import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Spinner from '../components/ui/Spinner'

/**
 * OAuth callback landing page.
 * Supabase redirects here after Google sign-in.
 * The AuthContext onAuthStateChange listener handles the session check;
 * this page just shows a loading UI while the session is being established.
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Give onAuthStateChange time to fire and validate the session.
    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      navigate(session ? '/sales' : '/login', { replace: true })
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="text-surface-600 text-sm font-medium">Completing sign-in…</p>
      <p className="text-surface-400 text-xs">Please wait while we verify your account.</p>
    </div>
  )
}
