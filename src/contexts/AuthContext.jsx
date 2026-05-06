import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

async function fetchUserRow(userId) {
  const { data, error } = await supabase
    .from('user')
    .select('userId, username, user_type, record_status')
    .eq('userId', userId)
    .single()
  return { data: data ?? null, error }
}

async function resolveSession(session, setCurrentUser, setAuthError) {
  if (!session) {
    setCurrentUser(null)
    return
  }
  const { data: userRow } = await fetchUserRow(session.user.id)
  if (!userRow) {
    await supabase.auth.signOut()
    setAuthError('Account not found. Please contact your administrator.')
    setCurrentUser(null)
  } else if (userRow.record_status !== 'ACTIVE') {
    await supabase.auth.signOut()
    setAuthError('Your account is pending activation by a Sales Manager.')
    setCurrentUser(null)
  } else {
    setCurrentUser({ ...session.user, ...userRow })
    setAuthError(null)
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [authError,   setAuthError]   = useState(null)

  useEffect(() => {
    // onAuthStateChange fires INITIAL_SESSION on mount with the stored session (or null).
    // This replaces getSession() and avoids the localStorage lock contention bug.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION') {
          await resolveSession(session, setCurrentUser, setAuthError)
          setLoading(false)
          return
        }
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await resolveSession(session, setCurrentUser, setAuthError)
          return
        }
        if (event === 'SIGNED_OUT') {
          setCurrentUser(null)
          return
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUp = (email, password, username) =>
    supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    })

  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, authError, signIn, signUp, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
// dones naman na