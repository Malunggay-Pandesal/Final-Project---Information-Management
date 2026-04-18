/**
 * Admin Service
 * ─────────────
 * RULE: ADMIN cannot alter a SUPERADMIN user. This is enforced at BOTH:
 *   1. UI level — buttons are disabled for SUPERADMIN rows
 *   2. RLS level — Supabase policy blocks UPDATE where user_type = 'SUPERADMIN'
 */
import { supabase } from '../lib/supabase'

/** Fetch all users (for Admin panel). */
export const getUsers = () =>
  supabase
    .from('user')
    .select('userId, username, user_type, record_status, stamp')
    .order('user_type')
    .order('username')

/** Activate a USER account (set record_status = 'ACTIVE'). */
export const activateUser = (userId, adminId) =>
  supabase
    .from('user')
    .update({
      record_status: 'ACTIVE',
      stamp: `ACTIVATED by ${adminId} ${new Date().toISOString()}`,
    })
    .eq('userId', userId)
    .neq('user_type', 'SUPERADMIN') // Belt-and-suspenders guard

/** Deactivate a USER account (set record_status = 'INACTIVE'). */
export const deactivateUser = (userId, adminId) =>
  supabase
    .from('user')
    .update({
      record_status: 'INACTIVE',
      stamp: `DEACTIVATED by ${adminId} ${new Date().toISOString()}`,
    })
    .eq('userId', userId)
    .neq('user_type', 'SUPERADMIN') // Belt-and-suspenders guard
