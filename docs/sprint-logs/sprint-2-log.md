# Sprint 2 Log

**Project:** HopeSMS — Final Project — Information Management

**Sprint:** 2

## Overview
This document records the Sprint 2 PRs and scope by module (M1–M5). Sprint 2 focuses on core API implementation, UI components for sales workflows, rights enforcement, and comprehensive testing. Total of 23 PRs across 2 weeks (Week 3 & 4).

---

## M1 – Project Lead
- Week 2: W2 PR-01 — feat/sales-api — getSales, createSale, updateSale, softDelete, recover service functions
- Week 2: W2 PR-02 — feat/salesdetail-api — getDetailByTrans, addDetailLine, updateDetailLine, softDelete, recover
- Week 2: W2 PR-03 — feat/lookup-api — getCustomers, getEmployees, getProducts, getCurrentPrice (read-only)
- Week 3: W3 PR-04 — feat/rights-context-route-guard — UserRightsContext wired at root + /deleted-items guard
- Week 3: W3 PR-05 — feat/error-loading-states — Error boundary + loading components for all pages

## M2 – Frontend Developer
- Week 2: W2 PR-01 — feat/ui-sales-list — SalesListPage with stamp gating + INACTIVE filter
- Week 2: W2 PR-02 — feat/ui-sales-crud — AddSaleModal + EditSaleModal + SoftDeleteSaleDialog with lookup dropdowns
- Week 2: W2 PR-03 — feat/ui-salesdetail-panel — SalesDetailPage + line items table + AddLineItemModal + EditLineItemModal + price autofill
- Week 2: W2 PR-04 — feat/ui-lookup-pages — All 4 read-only lookup pages (customer, employee, product, priceHistory)
- Week 3: W3 PR-05 — feat/ui-deleted-items — DeletedItemsPage (2 tabs: Transactions + Line Items) + sidebar gating
- Week 3: W3 PR-06 — fix/ui-responsive-forms — Mobile responsive fixes for modals and detail page

## M4 – Rights & Auth
- Week 2: W2 PR-01 — feat/rights-context — UserRightsContext + useRights hook (13 rights)
- Week 2: W2 PR-02 — feat/rights-sales-gating — SALES_ADD/EDIT/DEL + SD_ADD/EDIT/DEL button gating
- Week 2: W2 PR-03 — feat/rights-stamp-sidebar — Stamp visibility gating + sidebar link gating
- Week 2: W2 PR-04 — feat/rights-lookup-confirmation — Code review confirming lookup pages are mutation-free

## M5 – QA / Docs
- Week 2: W2 PR-01 — test/sprint2-rights-39-cases — Full 39-case rights test matrix
- Week 2: W2 PR-02 — test/sprint2-cascade-visibility — Cascade soft-delete, recovery, RLS bypass tests
- Week 3: W3 PR-03 — test/sprint2-lookup-price-autofill — Lookup-only enforcement + price auto-fill tests

---

Created: 2026-05-11
