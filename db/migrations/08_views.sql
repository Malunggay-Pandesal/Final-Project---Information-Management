-- ============================================================
-- Migration 08: SQL Views (fixed — all lowercase table/column names)
-- Run each CREATE OR REPLACE in Supabase SQL Editor.
-- ============================================================

-- ── 1. Sales list view (with customer and employee names) ─────────────────────
DROP VIEW IF EXISTS public.sales_with_lookup;
CREATE OR REPLACE VIEW public.sales_with_lookup AS
SELECT
  s.transno,
  s.salesdate,
  s.custno,
  c.custname,
  c.payterm,
  s.empno,
  e.lastname || ', ' || e.firstname  AS empname,
  s.record_status,
  s.stamp,
  COUNT(sd.prodcode)                 AS lineitemcount,
  SUM(sd.quantity * ph.unitprice)    AS totalamount
FROM public.sales s
JOIN public.customer  c ON c.custno = s.custno
JOIN public.employee  e ON e.empno  = s.empno
LEFT JOIN public.salesdetail sd
  ON sd.transno = s.transno AND sd.record_status = 'ACTIVE'
LEFT JOIN (
  SELECT prodcode, unitprice
  FROM public.pricehist ph1
  WHERE effdate = (
    SELECT MAX(effdate) FROM public.pricehist WHERE prodcode = ph1.prodcode
  )
) ph ON ph.prodcode = sd.prodcode
GROUP BY
  s.transno, s.salesdate, s.record_status, s.stamp,
  s.custno, c.custname, c.payterm,
  s.empno, e.lastname, e.firstname
ORDER BY s.salesdate DESC;

-- ── 2. Sales detail enriched with product name and latest price ───────────────
DROP VIEW IF EXISTS public.salesdetail_with_product;
CREATE OR REPLACE VIEW public.salesdetail_with_product AS
SELECT
  sd.transno,
  sd.prodcode,
  p.description,
  p.unit,
  sd.quantity,
  ph.unitprice,
  sd.record_status,
  sd.stamp
FROM public.salesdetail sd
JOIN public.product p ON p.prodcode = sd.prodcode
LEFT JOIN (
  SELECT prodcode, unitprice
  FROM public.pricehist ph1
  WHERE effdate = (
    SELECT MAX(effdate) FROM public.pricehist WHERE prodcode = ph1.prodcode
  )
) ph ON ph.prodcode = sd.prodcode;

-- ── 3. Sales by employee report ───────────────────────────────────────────────
DROP VIEW IF EXISTS public.sales_by_employee;
CREATE OR REPLACE VIEW public.sales_by_employee AS
SELECT
  e.empno,
  e.lastname || ', ' || e.firstname  AS empname,
  COUNT(DISTINCT s.transno)          AS totaltransactions,
  SUM(sd.quantity * ph.unitprice)    AS totalrevenue
FROM public.employee e
JOIN public.sales s
  ON s.empno = e.empno AND s.record_status = 'ACTIVE'
JOIN public.salesdetail sd
  ON sd.transno = s.transno AND sd.record_status = 'ACTIVE'
JOIN (
  SELECT prodcode, unitprice
  FROM public.pricehist ph1
  WHERE effdate = (
    SELECT MAX(effdate) FROM public.pricehist WHERE prodcode = ph1.prodcode
  )
) ph ON ph.prodcode = sd.prodcode
GROUP BY e.empno, e.lastname, e.firstname
ORDER BY totalrevenue DESC;

-- ── 4. Sales by customer report ───────────────────────────────────────────────
DROP VIEW IF EXISTS public.sales_by_customer;
CREATE OR REPLACE VIEW public.sales_by_customer AS
SELECT
  c.custno,
  c.custname,
  c.payterm,
  COUNT(DISTINCT s.transno)          AS totaltransactions,
  SUM(sd.quantity * ph.unitprice)    AS totalrevenue
FROM public.customer c
JOIN public.sales s
  ON s.custno = c.custno AND s.record_status = 'ACTIVE'
JOIN public.salesdetail sd
  ON sd.transno = s.transno AND sd.record_status = 'ACTIVE'
JOIN (
  SELECT prodcode, unitprice
  FROM public.pricehist ph1
  WHERE effdate = (
    SELECT MAX(effdate) FROM public.pricehist WHERE prodcode = ph1.prodcode
  )
) ph ON ph.prodcode = sd.prodcode
GROUP BY c.custno, c.custname, c.payterm
ORDER BY totalrevenue DESC;

-- ── 5. Top products sold ──────────────────────────────────────────────────────
DROP VIEW IF EXISTS public.top_products_sold;
CREATE OR REPLACE VIEW public.top_products_sold AS
SELECT
  p.prodcode,
  p.description,
  p.unit,
  SUM(sd.quantity)                   AS totalqtysold,
  SUM(sd.quantity * ph.unitprice)    AS totalrevenue
FROM public.product p
JOIN public.salesdetail sd
  ON sd.prodcode = p.prodcode AND sd.record_status = 'ACTIVE'
JOIN public.sales s
  ON s.transno = sd.transno AND s.record_status = 'ACTIVE'
JOIN (
  SELECT prodcode, unitprice
  FROM public.pricehist ph1
  WHERE effdate = (
    SELECT MAX(effdate) FROM public.pricehist WHERE prodcode = ph1.prodcode
  )
) ph ON ph.prodcode = sd.prodcode
GROUP BY p.prodcode, p.description, p.unit
ORDER BY totalrevenue DESC;

-- ── 6. Monthly sales trend ────────────────────────────────────────────────────
DROP VIEW IF EXISTS public.monthly_sales_trend;
CREATE OR REPLACE VIEW public.monthly_sales_trend AS
SELECT
  TO_CHAR(s.salesdate, 'YYYY-MM')    AS salemonth,
  COUNT(DISTINCT s.transno)          AS totaltransactions,
  SUM(sd.quantity * ph.unitprice)    AS totalrevenue
FROM public.sales s
JOIN public.salesdetail sd
  ON sd.transno = s.transno AND sd.record_status = 'ACTIVE'
JOIN (
  SELECT prodcode, unitprice
  FROM public.pricehist ph1
  WHERE effdate = (
    SELECT MAX(effdate) FROM public.pricehist WHERE prodcode = ph1.prodcode
  )
) ph ON ph.prodcode = sd.prodcode
WHERE s.record_status = 'ACTIVE'
GROUP BY TO_CHAR(s.salesdate, 'YYYY-MM')
ORDER BY salemonth ASC;