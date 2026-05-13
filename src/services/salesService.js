/** * Sales Service
 * ─────────────
 * RULE: Hard DELETE is NEVER used anywhere in this file.
 *       All "deletions" set record_status = 'INACTIVE'.
 *       The cascade trigger on Supabase handles salesdetail automatically.
 */
import { supabase } from '../lib/supabase'

/** Fetch all sales (USER sees ACTIVE only via RLS; ADMIN/SA see all). */
export const getSales = () =>
  supabase
    .from('sales_with_lookup')
    .select('*')
    .order('salesdate', { ascending: false })

/** Create a new sales transaction. */
export const createSale = ({ transNo, salesDate, custNo, empNo, userId }) =>
  supabase
    .from('sales')
    .insert([{
      transno: transNo,
      salesdate: salesDate,
      custno: custNo,
      empno: empNo,
      record_status: 'ACTIVE',
      stamp: `CREATE ${userId} ${new Date().toISOString()}`,
    }])
    .select()
    .single()

/** Edit an existing sales transaction (date, customer, employee). */
export const updateSale = (transNo, { salesDate, custNo, empNo, userId }) =>
  supabase
    .from('sales')
    .update({
      salesdate: salesDate,
      custno: custNo,
      empno: empNo,
      stamp: `EDIT ${userId} ${new Date().toISOString()}`,
    })
    .eq('transno', transNo)
    .select()
    .single()

/**
 * Soft-delete a sales transaction.
 * The DB trigger cascades INACTIVE to all salesdetail rows.
 * SALES_DEL right required (SUPERADMIN only per spec).
 */
export const softDeleteSale = (transNo, userId) =>
  supabase
    .from('sales')
    .update({
      record_status: 'INACTIVE',
      stamp: `DEL ${userId} ${new Date().toISOString()}`,
    })
    .eq('transno', transNo)

/**
 * Recover (un-delete) a sales transaction.
 * The DB trigger restores all salesdetail rows to ACTIVE.
 * ADMIN / SUPERADMIN only.
 */
export const recoverSale = (transNo, userId) =>
  supabase
    .from('sales')
    .update({
      record_status: 'ACTIVE',
      stamp: `RECOVER ${userId} ${new Date().toISOString()}`,
    })
    .eq('transno', transNo)

/** Fetch all INACTIVE sales for the Deleted Items panel (ADMIN / SUPERADMIN). */
export const getDeletedSales = () =>
  supabase
    .from('sales_with_lookup')
    .select('*')
    .eq('record_status', 'INACTIVE')
    .order('salesdate', { ascending: false })

/** Get the highest existing transno so the form can suggest the next one. */
export const getLatestTransNo = () =>
  supabase
    .from('sales')
    .select('transno')
    .order('transno', { ascending: false })
    .limit(1)
    .single()