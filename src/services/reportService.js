/**
 * Report Service
 * ──────────────
 * Queries the 4 SQL views created in Supabase.
 * All order column names match the lowercase view column aliases.
 */
import { supabase } from '../lib/supabase'

export const getSalesByEmployee = () =>
  supabase
    .from('sales_by_employee')
    .select('*')
    .order('totalrevenue', { ascending: false })

export const getSalesByCustomer = () =>
  supabase
    .from('sales_by_customer')
    .select('*')
    .order('totalrevenue', { ascending: false })

export const getTopProducts = () =>
  supabase
    .from('top_products_sold')
    .select('*')
    .order('totalrevenue', { ascending: false })

export const getMonthlySalesTrend = () =>
  supabase
    .from('monthly_sales_trend')
    .select('*')
    .order('salemonth', { ascending: true })