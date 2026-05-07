-- ============================================================
-- Migration 03: Seed Modules and Rights
-- Description:
-- Seeds default system modules and access rights.
-- Safe to re-run because ON CONFLICT DO NOTHING is used.
-- ===========================================================
-- MODULES
INSERT INTO public."Module" (moduleCode, moduleName, record_status, stamp)
VALUES
  ('Sales_Mod',  'Sales Module',        'ACTIVE', 'SEEDED'),
  ('SD_Mod',     'Sales Detail Module', 'ACTIVE', 'SEEDED'),
  ('Lookup_Mod', 'Lookup Module',       'ACTIVE', 'SEEDED'),
  ('Adm_Mod',    'Admin Module',        'ACTIVE', 'SEEDED')
ON CONFLICT (moduleCode) DO NOTHING;

-- RIGHTS (13 total)
INSERT INTO public."rights" (rightCode, rightDesc, right_default, moduleCode, record_status, stamp)
VALUES
  ('SALES_VIEW',   'View Transactions',        1, 'Sales_Mod',  'ACTIVE', 'SEEDED'),
  ('SALES_ADD',    'Create Transaction',       1, 'Sales_Mod',  'ACTIVE', 'SEEDED'),
  ('SALES_EDIT',   'Edit Transaction',         1, 'Sales_Mod',  'ACTIVE', 'SEEDED'),
  ('SALES_DEL',    'Soft Delete Transaction',  1, 'Sales_Mod',  'ACTIVE', 'SEEDED'),
  ('SD_VIEW',      'View Sales Detail',        1, 'SD_Mod',     'ACTIVE', 'SEEDED'),
  ('SD_ADD',       'Add Line Item',            1, 'SD_Mod',     'ACTIVE', 'SEEDED'),
  ('SD_EDIT',      'Edit Line Item',           1, 'SD_Mod',     'ACTIVE', 'SEEDED'),
  ('SD_DEL',       'Soft Delete Line Item',    1, 'SD_Mod',     'ACTIVE', 'SEEDED'),
  ('CUST_LOOKUP',  'Look Up Customers',        1, 'Lookup_Mod', 'ACTIVE', 'SEEDED'),
  ('EMP_LOOKUP',   'Look Up Employees',        1, 'Lookup_Mod', 'ACTIVE', 'SEEDED'),
  ('PROD_LOOKUP',  'Look Up Products',         1, 'Lookup_Mod', 'ACTIVE', 'SEEDED'),
  ('PRICE_LOOKUP', 'Look Up Price History',    1, 'Lookup_Mod', 'ACTIVE', 'SEEDED'),
  ('ADM_USER',     'Admin Activate User',      1, 'Adm_Mod',    'ACTIVE', 'SEEDED')
ON CONFLICT (rightCode) DO NOTHING;
