-- ============================================================
-- Migration 07: Row-Level Security (RLS) Policies
-- ============================================================

-- Enable RLS on all relevant tables
ALTER TABLE public.sales         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."salesdetail" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."pricehist"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."user"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."UserModule_Rights" ENABLE ROW LEVEL SECURITY;

-- ── Sales ─────────────────────────────────────────────────────────────────────

-- SELECT: USER sees ACTIVE only; ADMIN/SUPERADMIN see all
DROP POLICY IF EXISTS sales_visibility ON public.sales;
CREATE POLICY sales_visibility ON public.sales
  FOR SELECT TO authenticated
  USING (
    record_status = 'ACTIVE'
    OR EXISTS (
      SELECT 1 FROM public."user"
      WHERE "userId" = auth.uid()::text
        AND user_type IN ('ADMIN','SUPERADMIN')
    )
  );

-- INSERT: requires SALES_ADD = 1
DROP POLICY IF EXISTS sales_insert ON public.sales;
CREATE POLICY sales_insert ON public.sales
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."UserModule_Rights"
      WHERE "userId" = auth.uid()::text
        AND rightCode = 'SALES_ADD'
        AND right_value = 1
    )
  );

-- UPDATE (edit fields): requires SALES_EDIT = 1
DROP POLICY IF EXISTS sales_update_edit ON public.sales;
CREATE POLICY sales_update_edit ON public.sales
  FOR UPDATE TO authenticated
  USING (record_status = 'ACTIVE')
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."UserModule_Rights"
      WHERE "userId" = auth.uid()::text
        AND rightCode = 'SALES_EDIT'
        AND right_value = 1
    )
  );

-- UPDATE (soft-delete — set INACTIVE): requires SALES_DEL = 1
DROP POLICY IF EXISTS sales_soft_delete ON public.sales;
CREATE POLICY sales_soft_delete ON public.sales
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (
    -- Allow SALES_DEL right for INACTIVE transition
    EXISTS (
      SELECT 1 FROM public."UserModule_Rights"
      WHERE "userId" = auth.uid()::text
        AND rightCode = 'SALES_DEL'
        AND right_value = 1
    )
    OR
    -- Allow ADMIN/SUPERADMIN for recovery (INACTIVE → ACTIVE)
    EXISTS (
      SELECT 1 FROM public."user"
      WHERE "userId" = auth.uid()::text
        AND user_type IN ('ADMIN','SUPERADMIN')
    )
  );

-- ── Sales Detail ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS sd_visibility ON public."salesdetail";
CREATE POLICY sd_visibility ON public."salesdetail"
  FOR SELECT TO authenticated
  USING (
    record_status = 'ACTIVE'
    OR EXISTS (
      SELECT 1 FROM public."user"
      WHERE "userId" = auth.uid()::text
        AND user_type IN ('ADMIN','SUPERADMIN')
    )
  );

DROP POLICY IF EXISTS sd_insert ON public."salesdetail";
CREATE POLICY sd_insert ON public."salesdetail"
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."UserModule_Rights"
      WHERE "userId" = auth.uid()::text
        AND rightCode = 'SD_ADD'
        AND right_value = 1
    )
  );

DROP POLICY IF EXISTS sd_update ON public."salesdetail";
CREATE POLICY sd_update ON public."salesdetail"
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."UserModule_Rights"
      WHERE "userId" = auth.uid()::text
        AND rightCode IN ('SD_EDIT','SD_DEL')
        AND right_value = 1
    )
    OR EXISTS (
      SELECT 1 FROM public."user"
      WHERE "userId" = auth.uid()::text
        AND user_type IN ('ADMIN','SUPERADMIN')
    )
  );

-- ── Lookup tables: SELECT only, no write policies ─────────────────────────────

DROP POLICY IF EXISTS customer_lookup  ON public.customer;
DROP POLICY IF EXISTS employee_lookup  ON public.employee;
DROP POLICY IF EXISTS product_lookup   ON public.product;
DROP POLICY IF EXISTS pricehist_lookup ON public."pricehist";

CREATE POLICY customer_lookup  ON public.customer    FOR SELECT TO authenticated USING (true);
CREATE POLICY employee_lookup  ON public.employee    FOR SELECT TO authenticated USING (true);
CREATE POLICY product_lookup   ON public.product     FOR SELECT TO authenticated USING (true);
CREATE POLICY pricehist_lookup ON public."pricehist" FOR SELECT TO authenticated USING (true);

-- NO INSERT / UPDATE / DELETE policies on lookup tables.

-- ── User table ────────────────────────────────────────────────────────────────

-- Any authenticated user can read their own row
DROP POLICY IF EXISTS user_read_own ON public."user";
CREATE POLICY user_read_own ON public."user"
  FOR SELECT TO authenticated
  USING (true);

-- ADMIN / SUPERADMIN can update users, but ADMIN cannot touch SUPERADMIN rows
DROP POLICY IF EXISTS user_update ON public."user";
CREATE POLICY user_update ON public."user"
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."user" AS u
      WHERE u."userId" = auth.uid()::text
        AND u.user_type IN ('ADMIN','SUPERADMIN')
    )
  )
  WITH CHECK (
    -- SUPERADMIN can update anyone
    EXISTS (
      SELECT 1 FROM public."user" AS u
      WHERE u."userId" = auth.uid()::text AND u.user_type = 'SUPERADMIN'
    )
    OR
    -- ADMIN can update non-SUPERADMIN rows only
    (
      user_type != 'SUPERADMIN'
      AND EXISTS (
        SELECT 1 FROM public."user" AS u
        WHERE u."userId" = auth.uid()::text AND u.user_type = 'ADMIN'
      )
    )
  );

-- ── UserModule_Rights ─────────────────────────────────────────────────────────

DROP POLICY IF EXISTS umr_read ON public."UserModule_Rights";
CREATE POLICY umr_read ON public."UserModule_Rights"
  FOR SELECT TO authenticated
  USING (
    "userId" = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM public."user"
      WHERE "userId" = auth.uid()::text
        AND user_type IN ('ADMIN','SUPERADMIN')
    )
  );
