-- ============================================================
-- Migration 02: Authentication and Rights Management Tables
-- Tables Included:
--   1. user
--   2. Module
--   3. user_module
--   4. rights
--   5. UserModule_Rights
-- Purpose:
-- This migration creates the core authorization structure
-- for user access, module permissions, and rights management.
-- ============================================================
-- ============================================================
-- USER TABLE
-- Stores system users authenticated via Supabase
-- ============================================================

CREATE TABLE IF NOT EXISTS public."user" (
  "userId"       TEXT        NOT NULL PRIMARY KEY,  -- Supabase auth.uid()
  username       VARCHAR(60),
  user_type      VARCHAR(12) NOT NULL DEFAULT 'USER'
                   CHECK (user_type IN ('SUPERADMIN','ADMIN','USER')),
  record_status  VARCHAR(10) NOT NULL DEFAULT 'INACTIVE'
                   CHECK (record_status IN ('ACTIVE','INACTIVE')),
  stamp          VARCHAR(60)
);

CREATE TABLE IF NOT EXISTS public."Module" (
  moduleCode     VARCHAR(12) NOT NULL PRIMARY KEY,
  moduleName     VARCHAR(30),
  record_status  VARCHAR(10) DEFAULT 'ACTIVE',
  stamp          VARCHAR(60)
);

CREATE TABLE IF NOT EXISTS public."user_module" (
  "userId"       TEXT        NOT NULL REFERENCES public."user"("userId"),
  moduleCode     VARCHAR(12) NOT NULL REFERENCES public."Module"(moduleCode),
  rights_value   SMALLINT    NOT NULL DEFAULT 0 CHECK (rights_value IN (0,1)),
  PRIMARY KEY ("userId", moduleCode)
);

CREATE TABLE IF NOT EXISTS public."rights" (
  rightCode      VARCHAR(15) NOT NULL PRIMARY KEY,
  rightDesc      VARCHAR(40),
  right_default  SMALLINT    NOT NULL DEFAULT 0,
  moduleCode     VARCHAR(12) NOT NULL REFERENCES public."Module"(moduleCode),
  record_status  VARCHAR(10) DEFAULT 'ACTIVE',
  stamp          VARCHAR(60)
);

CREATE TABLE IF NOT EXISTS public."UserModule_Rights" (
  "userId"       TEXT        NOT NULL REFERENCES public."user"("userId"),
  rightCode      VARCHAR(15) NOT NULL REFERENCES public."rights"(rightCode),
  right_value    SMALLINT    NOT NULL DEFAULT 0 CHECK (right_value IN (0,1)),
  PRIMARY KEY ("userId", rightCode)
);
