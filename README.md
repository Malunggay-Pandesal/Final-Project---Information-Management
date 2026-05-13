# Hope SMS — Sales Management System

## [Live Deployed App](https://improject-hope-sms.netlify.app/)

> BS Information Technology Capstone · New Era University · AY 2025–2026
> Developed for Hope, Inc. as a 6-week sprint project

Hope SMS is a full-stack sales management app for Hope, Inc. It supports sales and line-item tracking, role-based access control, reporting, and Supabase-backed authentication.

## Highlights

- Full CRUD for `sales` and `salesDetail` with soft-delete only
- Read-only lookup views for customers, employees, products, and price history
- Role-based access control for 3 user types and 13 granular rights
- 4 analytical reports with charts: by employee, by customer, top products, and monthly trend
- Admin tools for user activation and deactivation
- Deleted-items recovery for soft-deleted records
- Email/password and Google OAuth sign-in through Supabase Auth

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Backend / Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| State | React Context API |
| Charts | Recharts |
| Testing | Vitest + React Testing Library |
| Deployment | Vercel |

## Project Structure

```text
.
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
├── docs/
│   └── test/
├── public/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   ├── test/
│   └── utils/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 18 or newer
- A Supabase project
- Git

### 1. Install dependencies

```bash
npm install
```

### 2. Set environment variables

Create a local `.env` file and define:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Vite exposes `VITE_` variables to the browser, so keep secrets out of this file.

### 3. Run the database migrations

Open your Supabase project, go to SQL Editor, and run the migration files in order:

| # | File | Purpose |
|---|------|---------|
| 01 | `01_add_status_stamp.sql` | Adds `record_status` and `stamp` to sales tables |
| 02 | `02_auth_tables.sql` | Creates auth and rights tables |
| 03 | `03_seed_modules_rights.sql` | Seeds modules and rights |
| 04 | `04_seed_superadmin.sql` | Seeds the SUPERADMIN account |
| 05 | `05_provision_trigger.sql` | Auto-provisions new users |
| 06 | `06_cascade_trigger.sql` | Cascades soft-delete and recovery states |
| 07 | `07_rls_policies.sql` | Applies Row Level Security policies |
| 08 | `08_views.sql` | Creates SQL views for list pages and reports |

Before running migration 04, create the SUPERADMIN user in Supabase Authentication, then replace `SUPABASE_AUTH_UID_HERE` in `04_seed_superadmin.sql` with that user’s UUID.

### 4. Start the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Supabase and OAuth

The Supabase client is configured in `src/lib/supabase.js` and reads the two environment variables above.

To enable Google OAuth:

1. Create an OAuth 2.0 Client ID in Google Cloud Console.
2. Add redirect URIs for local and production callback routes.
3. Paste the Client ID and Client Secret into Supabase under Authentication → Providers → Google.

Suggested redirect URIs:

- `http://localhost:5173/auth/callback`
- `https://your-app.vercel.app/auth/callback`

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:ui` | Open the Vitest UI |
| `npm run lint` | Run ESLint |

## Testing

The test suite covers rights logic and utility formatting behavior.

- 39-case rights matrix for all user types and permission combinations
- Formatting helpers for currency, date, and transaction numbers
- Business rules around soft-delete gating and lookup-only enforcement

## Deployment

The app is deployed to Vercel.

1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel environment settings.
4. Deploy the project.
5. Add the production callback URL to Supabase Authentication URL configuration.

## Core Rules

- No hard deletes; records are soft-deleted only.
- Soft-deleting a sales header cascades to related `salesDetail` rows.
- Lookup tables are read-only for all users.
- `INACTIVE` records stay hidden from regular users.
- SUPERADMIN rows are protected from admin-level activation and deactivation.
- Stamp fields are hidden from regular users in the UI.

## Git Workflow

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `dev` | Stable integration branch |
| `feature/*` | Individual features |
## ERD
![](/docs/db_erd.jpg)
## Team

| # | Name |Role | Responsibilities |
|---|-------|-----|----------------|
| M1 |Lance Dwight Aguilar| Project Lead / Full-Stack | Sprint coordination, API wiring, routing, deployment |
| M2 |Jan-Neo Gloria| Frontend Developer | React pages, UI/UX, responsive design |
| M3 |Erick Ian Litao| DB Engineer | Schema, migrations, RLS policies, SQL views |
| M4 |Jun Angelo Uri | Rights & Auth Specialist | AuthContext, RightsContext, OAuth, login guard |
| M5 |Darwin Baysa| QA / Documentation | Test cases, user manual, sprint log, slides |

Hope, Inc. Sales Management System · New Era University CCS · AY 2025–2026
