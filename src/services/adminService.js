/**
 * Admin Service
 * ─────────────
 * RULE: ADMIN cannot alter a SUPERADMIN user. This is enforced at BOTH:
 *   1. UI level — buttons are disabled for SUPERADMIN rows
 *   2. RLS level — Supabase policy blocks UPDATE where user_type = 'SUPERADMIN'
 *
 * NOTE: stamp column is VARCHAR(60) — keep stamp strings short.
 */
import { supabase } from '../lib/supabase'

// Short date string: "2026-04-18 03:16" — fits within stamp limit
const shortDate = () => new Date().toISOString().slice(0, 16).replace('T', ' ')

/** Fetch all users (for Admin panel). */
export const getUsers = () =>
  supabase
    .from('user')
    .select('*')
    .order('user_type')
    .order('username')

/** Activate a USER account (set record_status = 'ACTIVE'). */
export const activateUser = (userId, adminId) =>
  supabase
    .from('user')
    .update({
      record_status: 'ACTIVE',
      stamp: `ACTIVATED ${shortDate()}`,   // e.g. "ACTIVATED 2026-04-18 03:16" = 26 chars
    })
    .eq('userId', userId)
    .neq('user_type', 'SUPERADMIN')
    .select()

/** Deactivate a USER account (set record_status = 'INACTIVE'). */
export const deactivateUser = (userId, adminId) =>
  supabase
    .from('user')
    .update({
      record_status: 'INACTIVE',
      stamp: `DEACTIVATED ${shortDate()}`, // e.g. "DEACTIVATED 2026-04-18 03:16" = 28 chars
    })
    .eq('userId', userId)
    .neq('user_type', 'SUPERADMIN')
    .select()