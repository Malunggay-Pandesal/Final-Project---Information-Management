-- ============================================================
-- Migration 04: Seed SUPERADMIN Account
--
-- Description:
-- Creates or updates the default SUPERADMIN user and
-- automatically grants access to all modules and rights.
--
-- IMPORTANT:
-- Before running this migration:
-- 1. Create the authentication account manually in Supabase.
-- 2. Copy the generated auth UID from:
--    Supabase Dashboard > Authentication > Users
-- 3. Replace 'SUPABASE_AUTH_UID_HERE' with the actual UID.
--
-- Safe to re-run because ON CONFLICT clauses are used.
-- ============================================================

-- Step 1: Insert the user row
INSERT INTO public."user" ("userId", username, user_type, record_status, stamp)
VALUES (
  'SUPABASE_AUTH_UID_HERE',   -- replace with actual UID from Supabase Auth
  'jcesperanza',
  'SUPERADMIN',
  'ACTIVE',
  'SEEDED SUPERADMIN'
)
ON CONFLICT ("userId") DO UPDATE
  SET user_type     = 'SUPERADMIN',
      record_status = 'ACTIVE',
      stamp         = 'SEEDED SUPERADMIN';

-- Step 2: Grant all 4 modules
INSERT INTO public."user_module" ("userId", moduleCode, rights_value)
SELECT 'SUPABASE_AUTH_UID_HERE', moduleCode, 1
FROM public."Module"
ON CONFLICT ("userId", moduleCode) DO UPDATE SET rights_value = 1;

-- Step 3: Grant all 13 rights = 1
INSERT INTO public."UserModule_Rights" ("userId", rightCode, right_value)
SELECT 'SUPABASE_AUTH_UID_HERE', rightCode, 1
FROM public."rights"
ON CONFLICT ("userId", rightCode) DO UPDATE SET right_value = 1;
