/**
 * Sales Detail Service
 * ─────────────────────
 * RULE: No hard DELETE. Soft-delete only via record_status = 'INACTIVE'.
 * NOTE: salesdetail has a composite PK (transno, prodcode).
 *       One product per transaction — to change qty, edit the existing row.
 */
import { supabase } from '../lib/supabase'

/** Fetch ACTIVE line items for a transaction (enriched view with product name + price). */
export const getDetailByTrans = (transNo) =>
  supabase
    .from('salesdetail_with_product')
    .select('*')
    .eq('transno', transNo)
    .eq('record_status', 'ACTIVE')
    .order('prodcode')

/** Add a new line item to a transaction. */
export const addDetailLine = ({ transNo, prodCode, quantity, userId }) =>
  supabase
    .from('salesdetail')
    .insert([{
      transno: transNo,
      prodcode: prodCode,
      quantity,
      record_status: 'ACTIVE',
      stamp: `CREATE ${userId} ${new Date().toISOString()}`,
    }])

/** Update quantity on an existing line item (composite PK: transno + prodcode). */
export const updateDetailLine = (transNo, prodCode, { quantity, userId }) =>
  supabase
    .from('salesdetail')
    .update({
      quantity,
      stamp: `EDIT ${userId} ${new Date().toISOString()}`,
    })
    .eq('transno',  transNo)
    .eq('prodcode', prodCode)

/** Soft-delete a line item. SD_DEL right required (SUPERADMIN only). */
export const softDeleteDetailLine = (transNo, prodCode, userId) =>
  supabase
    .from('salesdetail')
    .update({
      record_status: 'INACTIVE',
      stamp: `DEL ${userId} ${new Date().toISOString()}`,
    })
    .eq('transno',  transNo)
    .eq('prodcode', prodCode)

/** Recover a soft-deleted line item (ADMIN / SUPERADMIN). */
export const recoverDetailLine = (transNo, prodCode, userId) =>
  supabase
    .from('salesdetail')
    .update({
      record_status: 'ACTIVE',
      stamp: `RECOVER ${userId} ${new Date().toISOString()}`,
    })
    .eq('transno',  transNo)
    .eq('prodcode', prodCode)

/** Fetch all INACTIVE line items for the Deleted Items panel. */
export const getDeletedDetailLines = () =>
  supabase
    .from('salesdetail_with_product')
    .select('*')
    .eq('record_status', 'INACTIVE')
    .order('transno')