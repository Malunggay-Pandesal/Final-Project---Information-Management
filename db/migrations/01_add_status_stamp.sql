-- ============================================================
-- Migration 01: Add record_status and stamp to sales & salesDetail
-- This migration adds:
-- 1. record_status - identifies if a record is ACTIVE or INACTIVE
-- 2. stamp -optional field for tracking/reference purposes
-- Run this AFTER importing the base HopeDB tables.
-- ============================================================

-- add columns to sales
ALTER TABLE sales
  ADD COLUMN IF NOT EXISTS record_status VARCHAR(10) DEFAULT 'ACTIVE'
    CHECK (record_status IN ('ACTIVE', 'INACTIVE')),
  ADD COLUMN IF NOT EXISTS stamp VARCHAR(60);

-- Add columns to salesDetail
ALTER TABLE "salesDetail"
  ADD COLUMN IF NOT EXISTS record_status VARCHAR(10) DEFAULT 'ACTIVE'
    CHECK (record_status IN ('ACTIVE', 'INACTIVE')),
  ADD COLUMN IF NOT EXISTS stamp VARCHAR(60);

-- Backfill existing rows
UPDATE sales         SET record_status = 'ACTIVE' WHERE record_status IS NULL;
UPDATE "salesDetail" SET record_status = 'ACTIVE' WHERE record_status IS NULL;
