import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AlertBanner from '../components/ui/AlertBanner'
import Spinner from '../components/ui/Spinner'

export default function RegisterPage() {
  const { signUp, signInWithGoogle } = useAuth()

  const [username, setUsername] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [gLoading, setGLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8)  { setError('Password must be at least 8 characters.'); return }

    setLoading(true)
    const { error: err } = await signUp(email, password, username)
    if (err) setError(err.message)
    else     setSuccess(
      'Account created! Check your email to confirm, then a Sales Manager will activate your account.'
    )
    setLoading(false)
  }

  async function handleGoogle() {
    setError('')
    setGLoading(true)
    const { error: err } = await signInWithGoogle()
    if (err) {
      setError(err.message)
      setGLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl
                          bg-surface-900 mb-4">
            <span className="text-white font-bold text-base">H</span>
          </div>
          <h1 className="text-xl font-bold text-surface-900 tracking-tight">Hope SMS</h1>
          <p className="text-sm text-surface-500 mt-0.5">Create your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-surface-200 shadow-card-md p-7">
          <h2 className="text-base font-semibold text-surface-900 mb-1">Register</h2>
          <p className="text-xs text-surface-400 mb-5 leading-relaxed">
            New accounts require activation by a Sales Manager before sign-in.
          </p>

          {error   && <div className="mb-4"><AlertBanner type="error"   message={error}   onDismiss={() => setError('')}   /></div>}
          {success && <div className="mb-4"><AlertBanner type="success" message={success} onDismiss={() => setSuccess('')} /></div>}

          {!success && (
            <>
              {/* Google first */}
              <button
                onClick={handleGoogle}
                disabled={gLoading || loading}
                className="btn-secondary w-full justify-center py-2.5 mb-4 gap-2.5"
              >
                {gLoading ? <Spinner size="sm" /> : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {gLoading ? 'Redirecting…' : 'Sign up with Google'}
              </button>

              <div className="divider mb-4">or with email</div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                  <label className="label" htmlFor="username">Display name</label>
                  <input id="username" type="text" className="input"
                         placeholder="Jane Smith" value={username}
                         onChange={e => setUsername(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="reg-email">Email</label>
                  <input id="reg-email" type="email" className="input"
                         placeholder="you@example.com" value={email}
                         onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="reg-password">Password</label>
                  <input id="reg-password" type="password" className="input"
                         placeholder="Min. 8 characters" value={password}
                         onChange={e => setPassword(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="confirm">Confirm password</label>
                  <input id="confirm" type="password" className="input"
                         placeholder="Repeat password" value={confirm}
                         onChange={e => setConfirm(e.target.value)} required />
                </div>

                <button type="submit" className="btn-primary w-full justify-center py-2.5 mt-1"
                        disabled={loading || gLoading}>
                  {loading ? <><Spinner size="sm" /> Creating…</> : 'Create account'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-surface-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-surface-900 font-semibold hover:underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}