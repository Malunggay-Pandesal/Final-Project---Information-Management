-- ============================================================
-- Migration 06: Cascade Soft-Delete for Sales Details
-- ============================================================
-- Purpose:
-- Automatically synchronizes the record_status of
-- salesDetail rows whenever the parent sales record
-- changes status.
--
-- Cascade Rules:
--
-- ACTIVE -> INACTIVE
--   - All related salesDetail rows become INACTIVE
--   - Used for soft-delete operations
--
-- INACTIVE -> ACTIVE
--   - All related salesDetail rows become ACTIVE
--   - Used for recovery / restore operations
--
-- Trigger:
--   on_sales_status_change
--   Fires AFTER UPDATE OF record_status on public.sales
--
-- Benefits:
-- - Maintains parent-child data consistency
-- - Prevents orphan active detail records
-- - Supports reversible soft-delete workflow
-- - Automatically restores child records on recovery
--
-- Notes:
-- - Updates only rows sharing the same transNo
-- - Adds audit stamps for delete/recovery actions
-- - Safe to recreate using DROP TRIGGER IF EXISTS
-- ============================================================


-- ============================================================
-- Function: cascade_sales_soft_delete
-- ============================================================
-- Handles automatic status propagation from:
--   public.sales
-- to:
--   public."salesDetail"
-- ============================================================
CREATE OR REPLACE FUNCTION public.cascade_sales_soft_delete()
RETURNS TRIGGER
LANGUAGE plpgsql AS
$$
BEGIN
  -- Soft-delete cascade
  IF NEW.record_status = 'INACTIVE' AND OLD.record_status = 'ACTIVE' THEN
    UPDATE public."salesDetail"
    SET record_status = 'INACTIVE',
        stamp = 'CASCADE-DEL ' || NEW."transNo" || ' ' || NOW()::text
    WHERE "transNo" = NEW."transNo";
  END IF;

  -- Recovery cascade
  IF NEW.record_status = 'ACTIVE' AND OLD.record_status = 'INACTIVE' THEN
    UPDATE public."salesDetail"
    SET record_status = 'ACTIVE',
        stamp = 'CASCADE-RECOVER ' || NEW."transNo" || ' ' || NOW()::text
    WHERE "transNo" = NEW."transNo";
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_sales_status_change ON public.sales;
CREATE TRIGGER on_sales_status_change
  AFTER UPDATE OF record_status ON public.sales
  FOR EACH ROW EXECUTE FUNCTION public.cascade_sales_soft_delete();

-- Verification query (run manually to confirm trigger works):
-- UPDATE public.sales SET record_status = 'INACTIVE' WHERE "transNo" = 'TR000001';
-- SELECT "transNo", "prodCode", record_status FROM public."salesDetail" WHERE "transNo" = 'TR000001';
-- -- All rows should show INACTIVE
-- UPDATE public.sales SET record_status = 'ACTIVE'   WHERE "transNo" = 'TR000001';
-- SELECT "transNo", "prodCode", record_status FROM public."salesDetail" WHERE "transNo" = 'TR000001';
-- -- All rows should show ACTIVE again
