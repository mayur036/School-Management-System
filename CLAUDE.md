# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A multi-tenant **CampusCore** School Management System. A Super Admin onboards schools and creates each school's admin; each School Admin manages departments and staff for their own school only. Three roles — `super_admin`, `school_admin`, `staff` — all live in one `staff` table distinguished by `role_id`.
It's a two-package repo (no workspace tooling): `client/` (React + Vite) and `server/` (Express). The root only holds shared Prettier config and docs. **`PROJECT_PLAN.md` is the source of truth** for the data model, the full stored-procedure list, the API endpoint map, and the phase-by-phase roadmap — read it before adding features.

The package manager is **Bun** (`bun.lock` in each package), though npm scripts work too.

## Commands

Run these from inside `client/` or `server/` (not the repo root).

**Server** (`server/`):

- `bun run dev` — start with nodemon (port 5000 by default)
- `bun run start` — start without watch
- `bun run lint` / `bun run lint:fix`
- `bun run format` / `bun run check-format`

**Client** (`client/`):

- `bun run dev` — Vite dev server on port 5173 (proxies `/api` → `VITE_API_URL`)
- `bun run build` — production build
- `bun run lint` / `bun run lint:fix`
- `bun run format` / `bun run check-format`

There is **no test suite** in this repo yet. "Done when" checks in PROJECT_PLAN.md are manual (lint + build pass, plus exercising the flow in the browser / via API).

## Database — run manually in MySQL Workbench

The DB is **not** migrated by app code. Run the three scripts in `server/database/` **in order**, in MySQL Workbench:

1. `schema.sql` — `roles`, `schools`, `departments`, `staff` tables + FKs
2. `procedures.sql` — all stored procedures
3. `seed.sql` — 3 roles + first super admin (`superadmin@sms.com` / `Admin@123`)

All three are idempotent and safe to re-run.

## Architecture

### The stored-procedure rule (most important)

**Every DB read/write goes through a MySQL stored procedure. There is no inline SQL anywhere in app code except inside `procedures.sql`.** When you add a data operation:

1. Write the `sp_*` procedure in `server/database/procedures.sql` (and re-run it in Workbench).
2. Add a thin wrapper in `server/src/models/<feature>.model.js` that calls it via `callProcedure` (returns rows) or `callProcedureOne` (returns one row / null) from `utils/callProcedure.js`.
3. Models never contain logic — they only map named args to the procedure's positional params.

Procedures also validate tenancy where relevant (e.g. staff must belong to the passed `school_id`); the app layer re-checks via JWT claims.

### Server request flow

`route → validate middleware → controller → model → stored procedure → MySQL`

(The `services/` folder exists in the plan but is currently empty — controllers call models directly. Don't invent a service layer unless asked.)

- **Routes** (`src/routes/*.routes.js`) are aggregated in `src/routes.js`, mounted under `/api` in `src/app.js`. `index.js` verifies the DB connection before listening and closes the pool on shutdown.
- **Auth/guards**: `protect` (middleware/auth.js) reads the JWT from the `token` httpOnly cookie _or_ a `Bearer` header, verifies it, and attaches `req.user` (claims: `staff_id`, `role_name`, `school_id`, `department_id`, names, email). `authorize('super_admin' | 'school_admin' | ...)` guards by role.
- **Tenant scoping is mandatory and never trusts the request body.** For school_admin/staff routes, the `school_id` comes from `req.user.school_id` (the token), never from params/body. Cross-school access returns 404.
- **Validation**: `validate(zodSchema)` middleware runs zod schemas from `src/schema/*.schema.js`.
- **Responses**: always use the envelope helpers in `utils/apiResponse.js` — `ok(res, data, message)`, `created(...)`, and wrap every async handler in `asyncHandler(...)` so throws reach the central handler. Throw `new ApiError(status, message)` for expected errors. `ER_DUP_ENTRY` is auto-mapped to 409 in `middleware/error.js`.
- **Route ordering gotcha**: in `staff.routes.js`, `/me` and `/me/password` are declared _before_ the `router.use(protect, authorize('school_admin'))` guard and before `/:id`, so any authenticated user can hit them and `me` isn't captured as an `:id`. Preserve this ordering when editing.
- Config comes from `src/config/env.js` (`env` object; `JWT_SECRET` is required, throws if missing). Swagger docs are wired via `src/config/swagger.js` from JSDoc in `src/docs/*.swagger.js`.

### Client state — Redux Toolkit + RTK Query (no React Context for data/auth)

All server state flows through **one** `baseApi` (`src/app/baseApi.js`) using a **custom axios `baseQuery`** (not `fetchBaseQuery`), so auth rides on the httpOnly cookie via `withCredentials` — no token header is attached client-side. Each feature adds endpoints with `baseApi.injectEndpoints(...)` in its own `feature.api.js`.

- **Cache coherence is tag-driven**: every list query sets `providesTags`; every mutation sets `invalidatesTags` for the matching `tagType` so lists refetch automatically. Add new `tagTypes` (`'School'`, `'Department'`, `'Staff'`, …) to `baseApi` as features land.
- `authSlice` holds `{ user, isAuthenticated }`. `app/store.js` combines `baseApi.reducer` + `auth`. `providers/AppProviders.jsx` wires the store, theme, and a `SessionBootstrap` that calls `getMe` on load.
- **Routing** (`App.jsx`): role-based, namespaced URLs `/super/*`, `/school/*`, `/staff/*`. Guards: `GuestRoute` (logged-out only) → `ProtectedRoute` (any auth) → `RoleRoute allow={[ROLES...]}` → per-role layout. `lib/roles.js` `roleHome(role)` is the single source for post-login redirect targets. `useAuth` must finish the first `/auth/me` before guards decide (`isAuthLoading`).
- **Per-role layouts** live in `src/components/layouts/<role>/` (each with its own `Sidebar` + `Header`; mobile uses a `Sheet` drawer). Shared `useLogout` hook.
- **Feature folders**: `src/features/<feature>/{<feature>.api.js, <feature>Slice.js?, pages/, components/}`. Pages are `lazy`-loaded in `App.jsx`.
- **Forms**: `react-hook-form` + `zod` (`@hookform/resolvers`); submit calls the RTK Query mutation and `.unwrap()`s. Feedback via `sonner` toasts; `Skeleton` while `isLoading`.
- **UI**: shadcn/ui (`src/components/ui/`, configured via `components.json`) + Tailwind v4 + lucide. React 19 with the React Compiler enabled (babel preset in `vite.config.js`).
- **Import alias**: `@/` → `src/` (set in both `vite.config.js` and `jsconfig.json`).

## Conventions

- **ESM everywhere** (`"type": "module"` in both packages). Use `.js` extensions in server relative imports.
- Imports are auto-sorted by `eslint-plugin-simple-import-sort` — run `lint:fix` rather than hand-ordering.
- Prettier config is at the repo root (`.prettierrc`) and shared by both packages; `prettier-plugin-tailwindcss` orders Tailwind classes.
- Secrets live in gitignored `.env` files. Server needs DB creds + `JWT_SECRET` (+ optional `PORT`, `JWT_EXPIRES_IN`); client needs `VITE_API_URL`. In dev the client proxies `/api`; in prod it calls `${VITE_API_URL}/api` directly.

## API surface

See PROJECT_PLAN.md §8 for the full endpoint map. Shape: `/api/auth/*` (all roles, including login, logout, forgot-password, reset-password), `/api/schools/*` (super_admin, incl. `POST /:id/admins`), `/api/departments` (school_admin, tenant-scoped), `/api/staff/*` (school_admin, plus `/me`, `/me/password`, and `/me/avatar` for everyone).
