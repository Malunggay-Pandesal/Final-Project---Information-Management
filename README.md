# Hope SMS — Sales Management System

> **BS Information Technology Capstone · New Era University · AY 2025–2026**
> Developed for Hope, Inc. | 6-Week Sprint-Based Project

---

## 📋 Project Overview

Hope SMS is a full-stack web application for managing sales transactions and line items from the HopeDB database. It features:

- Full CRUD on **sales** and **salesDetail** (soft-delete only — no hard deletes ever)
- Read-only lookup of **customer**, **employee**, **product**, and **priceHist**
- **Role-based access control** with 3 user types and 13 granular rights
- **4 analytical reports** with charts (by employee, by customer, top products, monthly trend)
- **Admin panel** for activating/deactivating user accounts
- **Deleted Items panel** for recovering soft-deleted records
- Email/password + **Google OAuth** authentication via Supabase Auth

---

## 🏗️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Backend / DB | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Email + Google OAuth) |
| State | React Context API |
| Charts | Recharts |
| Testing | Vitest + React Testing Library |
| Version Control | Git + GitHub |
| Deployment | Vercel |

---

## 📁 Project Structure

```
hope-sms/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/         # AppShell, Sidebar, Navbar, ProtectedRoute, AdminRoute
│   │   └── ui/             # Modal, Spinner, AlertBanner, EmptyState
│   ├── contexts/
│   │   ├── AuthContext.jsx      # Supabase auth + login guard
│   │   └── RightsContext.jsx    # 13-right map loaded at login
│   ├── lib/
│   │   └── supabase.js          # Supabase client (reads .env)
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── AuthCallbackPage.jsx
│   │   ├── SalesListPage.jsx
│   │   ├── SalesDetailPage.jsx
│   │   ├── CustomerLookupPage.jsx
│   │   ├── EmployeeLookupPage.jsx
│   │   ├── ProductLookupPage.jsx
│   │   ├── PriceLookupPage.jsx
│   │   ├── ReportsPage.jsx
│   │   ├── DeletedItemsPage.jsx
│   │   ├── AdminPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── services/
│   │   ├── salesService.js
│   │   ├── salesDetailService.js
│   │   ├── lookupService.js
│   │   ├── reportService.js
│   │   └── adminService.js
│   ├── test/
│   │   ├── setup.js
│   │   ├── rights.test.js     # 39-case rights matrix
│   │   └── format.test.js
│   ├── utils/
│   │   └── format.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── db/
│   └── migrations/
│       ├── 01_add_status_stamp.sql
│       ├── 02_auth_tables.sql
│       ├── 03_seed_modules_rights.sql
│       ├── 04_seed_superadmin.sql
│       ├── 05_provision_trigger.sql
│       ├── 06_cascade_trigger.sql
│       ├── 07_rls_policies.sql
│       └── 08_views.sql
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## ⚙️ Local Setup (Step-by-Step)

### Prerequisites
- Node.js ≥ 18
- A Supabase project (free tier is fine)
- Git

### Step 1 — Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/hope-sms.git
cd hope-sms
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ **Never commit `.env` to Git.** It is already listed in `.gitignore`.

### Step 4 — Set up the Supabase database

In your Supabase project, go to **SQL Editor** and run the migration files **in order**:

| # | File | What it does |
|---|------|-------------|
| 01 | `01_add_status_stamp.sql` | Adds `record_status` + `stamp` to sales & salesDetail |
| 02 | `02_auth_tables.sql` | Creates user, Module, rights, UserModule_Rights tables |
| 03 | `03_seed_modules_rights.sql` | Seeds 4 modules and 13 rights |
| 04 | `04_seed_superadmin.sql` | Seeds SUPERADMIN (replace UID placeholder first) |
| 05 | `05_provision_trigger.sql` | Auto-provisions new users as USER/INACTIVE |
| 06 | `06_cascade_trigger.sql` | Cascade soft-delete / recovery trigger |
| 07 | `07_rls_policies.sql` | All Row Level Security policies |
| 08 | `08_views.sql` | 6 SQL views for list pages + reports |

> **Before running Migration 04:** Go to Supabase **Authentication → Users**, create the SUPERADMIN account with email `jcesperanza@neu.edu.ph`, then copy the UUID from that user and replace `SUPABASE_AUTH_UID_HERE` in `04_seed_superadmin.sql`.

### Step 5 — Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔗 Supabase Connection Guide

### Connecting to Supabase

The Supabase client is initialized in `src/lib/supabase.js`:

```js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

Vite exposes any variable prefixed with `VITE_` from your `.env` file to the browser.

### Testing the connection

In the Supabase SQL Editor, run:

```sql
SELECT COUNT(*) FROM public.sales;
SELECT COUNT(*) FROM public.customer;
```

Both should return row counts from your seeded data.

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create an **OAuth 2.0 Client ID** (Web application type)
3. Add authorized redirect URIs:
   - `http://localhost:5173/auth/callback` (development)
   - `https://your-app.vercel.app/auth/callback` (production)
4. Copy the **Client ID** and **Client Secret**
5. In Supabase: **Authentication → Providers → Google** → paste credentials → Enable

---

## 🚀 Deployment to Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial project scaffold"
git remote add origin https://github.com/YOUR_USERNAME/hope-sms.git
git push -u origin main
```

### Step 2 — Import project in Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Vercel will auto-detect Vite — keep default settings

### Step 3 — Set environment variables in Vercel

In Vercel project settings → **Environment Variables**, add:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://your-project-id.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `your-anon-key` |

### Step 4 — Deploy

Click **Deploy**. Vercel builds and publishes your app. Your live URL will be something like `https://hope-sms.vercel.app`.

### Step 5 — Update Supabase redirect URLs

In Supabase: **Authentication → URL Configuration** → add your Vercel URL:
- Site URL: `https://hope-sms.vercel.app`
- Redirect URLs: `https://hope-sms.vercel.app/auth/callback`

---

## 🌿 Git Workflow

```
main          ← production only (release PRs merge here)
dev           ← stable base; all feature branches fork from here
feature/*     ← individual features
```

### Branch naming

| Prefix | Use |
|--------|-----|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `db/` | Database changes |
| `test/` | Test files |
| `docs/` | Documentation |
| `chore/` | Config/tooling |

### Example commit messages

```bash
git commit -m "feat: add soft-delete with cascade for sales transactions"
git commit -m "fix: price auto-fill not triggering on product change"
git commit -m "db: add cascade trigger for salesDetail recovery"
git commit -m "test: add 39-case rights matrix test suite"
```

---

## 🔑 User Types & Rights

| Right | SUPERADMIN | ADMIN | USER |
|-------|:---:|:---:|:---:|
| SALES_VIEW | ✅ | ✅ | ✅ |
| SALES_ADD | ✅ | ✅ | ❌ |
| SALES_EDIT | ✅ | ✅ | ❌ |
| SALES_DEL (soft) | ✅ | ❌ | ❌ |
| SD_VIEW | ✅ | ✅ | ✅ |
| SD_ADD | ✅ | ✅ | ❌ |
| SD_EDIT | ✅ | ✅ | ❌ |
| SD_DEL (soft) | ✅ | ❌ | ❌ |
| All 4 LOOKUPs | ✅ | ✅ | ✅ |
| ADM_USER | ✅ | ✅ | ❌ |

---

## 🧪 Running Tests

```bash
npm run test        # watch mode
npm run test:run    # single run (for CI)
```

The test suite includes:
- **39-case rights matrix** — verifies all 3 user types × 13 rights
- **Format utility tests** — currency, date, transNo generation
- Business rule assertions (soft-delete gating, lookup-only enforcement)

---

## 📌 Critical Rules Enforced

1. **No hard deletes** — `DELETE` SQL never appears anywhere in the codebase
2. **Soft-delete cascade** — setting `sales.record_status = INACTIVE` triggers all `salesDetail` rows to INACTIVE automatically via a DB trigger
3. **Lookup tables are read-only** — customer, employee, product, priceHist have no add/edit/delete UI for any user type; RLS restricts them to SELECT only
4. **INACTIVE records are invisible to USER** — enforced at both RLS (SELECT policy) and React query level
5. **SUPERADMIN is protected** — ADMIN cannot activate/deactivate SUPERADMIN rows; enforced at UI, service, and RLS levels
6. **Stamp hidden from USER** — stamp columns are only shown in the UI when user_type is ADMIN or SUPERADMIN

---

## 👥 Team

| # | Role | Responsibilities |
|---|------|----------------|
| M1 | Project Lead / Full-Stack | Sprint coordination, API wiring, routing, deployment |
| M2 | Frontend Developer | All React pages, UI/UX, responsive design |
| M3 | DB Engineer | Schema, migrations, RLS policies, SQL views |
| M4 | Rights & Auth Specialist | AuthContext, RightsContext, OAuth, login guard |
| M5 | QA / Documentation | Test cases, user manual, sprint log, slides |

---

*Hope, Inc. Sales Management System · New Era University CCS · AY 2025–2026*
