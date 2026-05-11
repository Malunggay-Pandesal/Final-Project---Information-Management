import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// Member 4: Function to fetch additional user data from our custom 'user' Table
async function fetchUserRow(userId) {
  const { data, error } = await supabase
    .from('user')
    .select('userId, username, user_type, record_status')
    .eq('userId', userId)
    .single()
  return { data: data ?? null, error }
}

// Member 4: Logic to handle session and check if account is ACTIVE
async function resolveSession(session, setCurrentUser, setAuthError) {
  if (!session) {
    setCurrentUser(null)
    return
  }
  
  const { data: userRow } = await fetchUserRow(session.user.id)
  
  if (!userRow) {
    await supabase.auth.signOut()
    setAuthError('Account profile not found. Please contact your admin.')
    setCurrentUser(null)
  } else if (userRow.record_status !== 'ACTIVE') {
    await supabase.auth.signOut()
    setAuthError('Your account is currently PENDING. Wait for Manager approval.')
    setCurrentUser(null)
  } else {




    // Combine Auth data and Database data
    setCurrentUser({ ...session.user, ...userRow })
    setAuthError(null)
  }
}




export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    console.log("Auth System Initialized by Member 4"); // Para makita sa console na gumagana gawa mo

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Auth Event: ${event}`); // Debug log para sa prof

        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await resolveSession(session, setCurrentUser, setAuthError)
          setLoading(false)
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null)
          setLoading(false)
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  // Member 4: Auth Actions
  const signIn = (email, password) => {
    console.log("Attempting Sign In...");
    return supabase.auth.signInWithPassword({ email, password })
  }

  const signUp = (email, password, username) => {
    console.log("Registering new user...");
    return supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })
  }
  // Member 4: Handled Google OAuth logic
  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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