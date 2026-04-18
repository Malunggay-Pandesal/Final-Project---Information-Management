/**
 * Lookup Service
 * ──────────────
 * RULE: These four tables are SELECT-ONLY.
 *       No INSERT / UPDATE / DELETE is ever called on customer,
 *       employee, product, or pricehist.
 */
import { supabase } from '../lib/supabase'

export const getCustomers = () =>
  supabase
    .from('customer')
    .select('custno, custname, address, payterm')
    .order('custname')

export const getEmployees = () =>
  supabase
    .from('employee')
    .select('empno, lastname, firstname, gender, birthdate, hiredate, sepdate')
    .order('lastname')

export const getProducts = () =>
  supabase
    .from('product')
    .select('prodcode, description, unit')
    .order('description')

export const getPriceHistory = () =>
  supabase
    .from('pricehist')
    .select('prodcode, effdate, unitprice')
    .order('prodcode')
    .order('effdate', { ascending: false })

/**
 * Get the most recent unit price for a specific product.
 * Used for auto-filling unit price on the salesdetail form.
 */
export const getCurrentPrice = (prodCode) =>
  supabase
    .from('pricehist')
    .select('unitprice, effdate')
    .eq('prodcode', prodCode)
    .order('effdate', { ascending: false })
    .limit(1)
    .single()