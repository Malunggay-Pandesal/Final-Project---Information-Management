-- ============================================================
-- Migration 05: Auto-Provision New Users
-- ============================================================
-- Purpose:
-- Automatically creates application-level user records
-- whenever a new account is created in auth.users.
--
-- Features:
-- - Auto-creates records in public."user"
-- - Assigns default modules and rights
-- - Detects predefined SUPERADMIN emails
-- - Grants SUPERADMIN users full system access
-- - Provisions regular users as USER / INACTIVE
--
-- SUPERADMIN Emails:
--   - jcesperanza@neu.edu.ph
--   - janneogloria22@gmail.com
--   - blumber14@gmail.com
--
-- Regular User Defaults:
--   user_type      = USER
--   record_status  = INACTIVE
--
-- SUPERADMIN Defaults:
--   user_type      = SUPERADMIN
--   record_status  = ACTIVE
--
-- Trigger:
--   on_auth_user_created
--   Fires AFTER INSERT on auth.users
--
-- Additional Notes:
-- - Safe to re-run
-- - Uses ON CONFLICT handling to prevent duplicates
-- - Includes one-time SUPERADMIN upgrade fix
--   for existing accounts
-- ============================================================
CREATE OR REPLACE FUNCTION public.provision_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_type     TEXT;
  v_record_status TEXT;
  v_stamp         TEXT;
BEGIN
  -- Auto-assign SUPERADMIN to known emails; everyone else is USER/INACTIVE
  IF NEW.email IN ('jcesperanza@neu.edu.ph', 'janneogloria22@gmail.com', 'blumber14@gmail.com') THEN
    v_user_type     := 'SUPERADMIN';
    v_record_status := 'ACTIVE';
    v_stamp         := 'AUTO-PROVISIONED SUPERADMIN ' || NOW()::text;
  ELSE
    v_user_type     := 'USER';
    v_record_status := 'INACTIVE';
    v_stamp         := 'AUTO-PROVISIONED ' || NOW()::text;
  END IF;

  -- Insert (or upgrade) app user row
  -- Google OAuth provides full_name/name; email/password provides username
  INSERT INTO public."user" ("userId", username, user_type, record_status, stamp)
  VALUES (
    NEW.id::text,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'username',
      split_part(NEW.email, '@', 1)
    ),
    v_user_type,
    v_record_status,
    v_stamp
  )
  ON CONFLICT ("userId") DO UPDATE
    SET user_type     = EXCLUDED.user_type,
        record_status = EXCLUDED.record_status,
        stamp         = EXCLUDED.stamp
    WHERE public."user".user_type != 'SUPERADMIN'
       OR EXCLUDED.user_type = 'SUPERADMIN';

  -- Modules
  INSERT INTO public."user_module" ("userId", moduleCode, rights_value)
  VALUES
    (NEW.id::text, 'Sales_Mod',  1),
    (NEW.id::text, 'SD_Mod',     1),
    (NEW.id::text, 'Lookup_Mod', 1),
    (NEW.id::text, 'Adm_Mod',    CASE WHEN v_user_type = 'SUPERADMIN' THEN 1 ELSE 0 END)
  ON CONFLICT ("userId", moduleCode) DO NOTHING;

  -- Rights
  IF v_user_type = 'SUPERADMIN' THEN
    INSERT INTO public."UserModule_Rights" ("userId", rightCode, right_value)
    SELECT NEW.id::text, rightCode, 1
    FROM public."rights"
    ON CONFLICT ("userId", rightCode) DO UPDATE SET right_value = 1;
  ELSE
    INSERT INTO public."UserModule_Rights" ("userId", rightCode, right_value)
    VALUES
      (NEW.id::text, 'SALES_VIEW',   1),
      (NEW.id::text, 'SALES_ADD',    0),
      (NEW.id::text, 'SALES_EDIT',   0),
      (NEW.id::text, 'SALES_DEL',    0),
      (NEW.id::text, 'SD_VIEW',      1),
      (NEW.id::text, 'SD_ADD',       0),
      (NEW.id::text, 'SD_EDIT',      0),
      (NEW.id::text, 'SD_DEL',       0),
      (NEW.id::text, 'CUST_LOOKUP',  1),
      (NEW.id::text, 'EMP_LOOKUP',   1),
      (NEW.id::text, 'PROD_LOOKUP',  1),
      (NEW.id::text, 'PRICE_LOOKUP', 1),
      (NEW.id::text, 'ADM_USER',     0)
    ON CONFLICT ("userId", rightCode) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Re-attach trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.provision_new_user();

-- ============================================================
-- ONE-TIME FIX: Upgrade janneogloria22@gmail.com if the account
-- already exists in auth.users and was provisioned as USER.
-- Safe to re-run; does nothing if the account doesn't exist yet.
-- ============================================================
DO $$
DECLARE v_uid TEXT;
BEGIN
  SELECT id::text INTO v_uid FROM auth.users
  WHERE email = 'janneogloria22@gmail.com' LIMIT 1;

  IF v_uid IS NOT NULL THEN
    UPDATE public."user"
    SET user_type = 'SUPERADMIN', record_status = 'ACTIVE',
        stamp = 'UPGRADED TO SUPERADMIN ' || NOW()::text
    WHERE "userId" = v_uid;

    INSERT INTO public."user_module" ("userId", moduleCode, rights_value)
    VALUES (v_uid,'Sales_Mod',1),(v_uid,'SD_Mod',1),(v_uid,'Lookup_Mod',1),(v_uid,'Adm_Mod',1)
    ON CONFLICT ("userId", moduleCode) DO UPDATE SET rights_value = 1;

    INSERT INTO public."UserModule_Rights" ("userId", rightCode, right_value)
    SELECT v_uid, rightCode, 1 FROM public."rights"
    ON CONFLICT ("userId", rightCode) DO UPDATE SET right_value = 1;

    RAISE NOTICE 'Upgraded janneogloria22@gmail.com to SUPERADMIN (uid: %)', v_uid;
  ELSE
    RAISE NOTICE 'janneogloria22@gmail.com not in auth.users yet — will auto-provision as SUPERADMIN on first login.';
  END IF;
END;
$$;
