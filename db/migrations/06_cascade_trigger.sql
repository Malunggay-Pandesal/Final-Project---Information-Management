-- ============================================================
-- Migration 06: Cascade soft-delete trigger
-- When sales.record_status changes ACTIVE → INACTIVE,
--   all salesDetail rows for that transNo become INACTIVE.
-- When sales.record_status changes INACTIVE → ACTIVE (recovery),
--   all salesDetail rows are restored to ACTIVE.
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
