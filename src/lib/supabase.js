import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// ── NEW: Validation & Logger (Non-destructive) ──
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = 'Missing Supabase credentials. Ensure .env is configured.'
  console.warn(`[HOPE-SMS CONFIG]: ${errorMsg}`)
  // We keep the throw only for production safety
  if (import.meta.env.PROD) throw new Error(errorMsg)
}

// ── Master Client Configuration ──
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    lock: async (name, acquireTimeout, fn) => {
      // Bypass the Web Locks API which hangs on slow networks
      return fn()
    },
  },
})

// ── NEW: Helper for Health Checks (Non-destructive) ──
// This lets your teammates check if the DB is "Up" without writing a full query
export const checkDbConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    if (error) throw error
    return { status: 'online', connected: true }
  } catch (err) {
    return { status: 'offline', error: err.message }
  }
}