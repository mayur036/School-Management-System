# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A multi-tenant **CampusCore** School Management System. Roles live in a single `staff` table:

- **Super Admin (`super_admin`)**: Manages schools and school admins.
- **School Admin (`school_admin`)**: Tenant admin. Manages departments/staff, creates schedules, assigns duties/tasks, reviews leaves.
- **Staff (`staff`)**: School/departmental employees. Can clock in/out, view weekly schedule, request leave, update assigned tasks, view policies/payslips.

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

1. `schema.sql` — 9 tables: `roles`, `schools`, `departments`, `staff`, `school_periods`, `staff_schedules`, `staff_attendance`, `leave_requests`, `staff_tasks` + FKs + indexes
2. `procedures.sql` — 49 stored procedures (all `sp_*`)
3. `seed.sql` — 3 roles + first super admin (`superadmin@sms.com` / `Admin@123`)

All three are idempotent and safe to re-run.

## Architecture

### The stored-procedure rule (most important)

**Every DB read/write goes through a MySQL stored procedure. There is no inline SQL anywhere in app code except inside `procedures.sql`.** When you add a data operation:

1. Write the `sp_*` procedure in `server/database/procedures.sql` (and re-run it in Workbench).
2. Add a thin wrapper in `server/src/models/<feature>.model.js` that calls it via `callProcedure` (returns rows) or `callProcedureOne` (returns one row / null) from `utils/callProcedure.js`.
3. Models never contain logic — they only map named args to the procedure's positional params.

Procedures also validate tenancy where relevant (e.g. staff must belong to the passed `school_id`, preventing cross-school staff registration while allowing multiple staff per department); the app layer re-checks via JWT claims.

### Server request flow

`route → validate middleware → controller → model → stored procedure → MySQL`

(The `services/` folder exists in the plan but is currently empty — controllers call models directly. Don't invent a service layer unless asked.)

- **Routes** (`src/routes/*.routes.js`) are aggregated in `src/routes.js`, mounted under `/api` in `src/app.js`. `index.js` verifies the DB connection before listening and closes the pool on shutdown.
- **Route files and their responsibilities:**
  - `auth.routes.js` — login, logout, forgot-password, reset-password, getMe
  - `school.routes.js` — CRUD schools + create school admin + update details (super_admin only)
  - `schoolAdminManager.routes.js` — list/delete school admins (super_admin only)
  - `department.routes.js` — create/list departments (school_admin only)
  - `staff.routes.js` — profile endpoints (all roles), staff portal endpoints (staff only), staff CRUD (school_admin only)
  - `schoolAdmin.routes.js` — task assignment, leave review, schedule periods + working-days settings, school-wide schedule grid (single + bulk), school settings profile (school_admin only)
- **Auth/guards**: `protect` (middleware/auth.js) reads the JWT from the `token` httpOnly cookie _or_ a `Bearer` header, verifies it, and attaches `req.user` (claims: `staff_id`, `role_name`, `school_id`, `department_id`, names, email). `authorize('super_admin' | 'school_admin' | ...)` guards by role.
- **Tenant scoping is mandatory and never trusts the request body.** For school_admin/staff routes, the `school_id` comes from `req.user.school_id` (the token), never from params/body. Cross-school access returns 404.
- **Validation**: `validate(zodSchema)` middleware runs zod schemas from `src/schema/*.schema.js`.
- **School Status Enforcement**: If a school is marked as `inactive`, login and API access is actively blocked for all its staff (including school admins) via the auth controllers.
- **Responses**: always use the envelope helpers in `utils/apiResponse.js` — `ok(res, data, message)`, `created(...)`, and wrap every async handler in `asyncHandler(...)` so throws reach the central handler. Throw `new ApiError(status, message)` for expected errors. `ER_DUP_ENTRY` is auto-mapped to 409 in `middleware/error.js`.
- **Route ordering gotcha**: in `staff.routes.js`, `/me` and `/me/password` and all `/me/*` endpoints are declared _before_ the `router.use(protect, authorize('school_admin'))` guard and before `/:id`, so any authenticated user can hit them and `me` isn't captured as an `:id`. Preserve this ordering when editing.
- Config comes from `src/config/env.js` (`env` object). Several keys are **`required()`** and the server throws on boot if any is missing: `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. Swagger docs are wired via `src/config/swagger.js` from JSDoc in `src/docs/*.swagger.js`.

### Security Middleware (server)

- **Helmet**: Helmet is integrated in `src/app.js` to set secure HTTP headers (CSP is adjusted for Swagger in dev, COEP is disabled for Cloudinary images).
- **Rate Limiting**: Tiered rate limiters:
  - Global limiter: 100 req/15min on all `/api` routes (app.js).
  - Auth limiter: 5 req/15min on `/api/auth/login` and `/api/auth/forgot-password` (auth.routes.js).
  - Upload limiter: 5 req/15min on `/api/staff/me/avatar` (staff.routes.js).
- **Input Sanitization**: Custom middleware `sanitize.js` recursively strips HTML tags/script strings and escapes HTML characters (`<>&`) from `req.body`, `req.query`, and `req.params` (excluding sensitive fields like `password` and `token`). Registered globally in `app.js`. Uses `Object.defineProperty` for Express 5 compatibility.
- **File Upload Validation**: Multer middleware `upload.js` verifies file magic bytes (headers) to ensure real JPEG/PNG/WebP files, validates file extensions, limits file sizes to 2MB, and restricts to a single file.

### External integrations (email + image uploads)

- **Email**: `config/mailer.js` exposes `sendEmail({ to, subject, html })` over a nodemailer SMTP transporter (`SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS`, `MAIL_FROM`; port 465 ⇒ secure). HTML bodies are built from `src/templates/*.js` (`resetPasswordTemplate.js`, `welcomeEmailTemplate.js`). Used by the forgot/reset-password flow and welcome credential emails; reset links are built against `CLIENT_URL`.
- **Avatar uploads**: multer `memoryStorage` → `utils/cloudinary.js` (`config/cloudinary.js`) streams the buffer to Cloudinary. Old avatars are deleted on replacement. Drives `PATCH /api/staff/me/avatar`.

### Client state — Redux Toolkit + RTK Query (no React Context for data/auth)

All server state flows through **one** `baseApi` (`src/app/baseApi.js`) using a **custom axios `baseQuery`** (not `fetchBaseQuery`), so auth rides on the httpOnly cookie via `withCredentials` — no token header is attached client-side. Each feature adds endpoints with `baseApi.injectEndpoints(...)` in its own `feature.api.js`.

- **Tag types registered**: `'User'`, `'School'`, `'Department'`, `'Staff'`, `'SchoolAdmin'`, `'StaffSchedule'`, `'StaffAttendance'`, `'StaffLeave'`, `'SchoolPeriod'`, `'SchoolSettings'`
- **Cache coherence is tag-driven**: every list query sets `providesTags`; every mutation sets `invalidatesTags` for the matching `tagType` so lists refetch automatically. Add new `tagTypes` to `baseApi` as features land.
- `authSlice` holds `{ user, isAuthenticated }`. `app/store.js` combines `baseApi.reducer` + `auth`. `providers/AppProviders.jsx` wires the store, theme, and a `SessionBootstrap` that calls `getMe` on load.
- **Routing** (`App.jsx`): role-based, namespaced URLs `/super/*`, `/school/*`, `/staff/*`. Guards: `GuestRoute` (logged-out only) → `ProtectedRoute` (any auth) → `RoleRoute allow={[ROLES...]}` → per-role layout. `lib/roles.js` `roleHome(role)` is the single source for post-login redirect targets. `useAuth` must finish the first `/auth/me` before guards decide (`isAuthLoading`).
- **Per-role layouts** live in `src/components/layouts/<role>/` (each with its own `Sidebar` + `Header`; mobile uses a `Sheet` drawer). Shared `useLogout` hook.
- **Feature folders**: `src/features/<feature>/{<feature>.api.js, <feature>Slice.js?, pages/, components/, constants/, utils/}`. Pages are `lazy`-loaded in `App.jsx`.
- **Feature API files:**
  - `features/auth/auth.api.js` — login, getMe, logout
  - `features/super_admin/schools.api.js` — school CRUD + status toggle + update school
  - `features/super_admin/schoolAdmins.api.js` — school admin creation
  - `features/school_admin/school.api.js` — school settings endpoints (profile + preferences)
  - `features/school_admin/schedule.api.js` — period CRUD, working-days settings, and school-wide schedule grid (single + bulk create)
  - `features/school_admin/departments.api.js` — department CRUD
  - `features/school_admin/staff.api.js` — staff CRUD + status toggle
  - `features/profile/profile.api.js` — avatar upload, profile update, password change
  - `features/staff/staffActivity.api.js` — staff portal (dashboard stats, schedule, attendance, clock, leaves, tasks) + school admin management (leave review, schedule management)
- **Forms**: `react-hook-form` + `zod` (`@hookform/resolvers`) with schemas separated in `src/schemas/`. Submit calls the RTK Query mutation and `.unwrap()`s. Feedback via `sonner` toasts; `Skeleton` while `isLoading`.
- **UI**: shadcn/ui (`src/components/ui/`, configured via `components.json`) + Tailwind v4 + lucide. React 19 with the React Compiler enabled (babel preset in `vite.config.js`).
- **Icons**: Icons are centralized in `src/lib/icons/`. Always use `COMMON` and role-specific icon dictionaries (e.g., `SUPER_ADMIN`, `SCHOOL_ADMIN`, `STAFF`) rather than importing directly from `lucide-react`. Icon modules: `base.icons.jsx`, `ui.icons.jsx`, `superAdmin.icons.jsx`, `schoolAdmin.icons.jsx`, `staff.icons.jsx`.
- **Shared components** (`src/components/shared/`): `StatCard`, `StatusBadge`, `EmptyTableState`, `AppBreadcrumb`, `AppPagination`, `PagePlaceholder`.
- **Custom hooks** (`src/hooks/`): `useAuth`, `useLogout`, `useDataTable` (filtering, pagination, search), `use-mobile` (responsive breakpoint detection).
- **Import alias**: `@/` → `src/` (set in both `vite.config.js` and `jsconfig.json`).

## Conventions

- **ESM everywhere** (`"type": "module"` in both packages). Use `.js` extensions in server relative imports.
- Imports are auto-sorted by `eslint-plugin-simple-import-sort` — run `lint:fix` rather than hand-ordering.
- Prettier config is at the repo root (`.prettierrc`) and shared by both packages; `prettier-plugin-tailwindcss` orders Tailwind classes.
- Secrets live in gitignored `.env` files. Server needs DB creds, the required keys above (`JWT_SECRET` + the three `CLOUDINARY_*`), SMTP creds for email, and `CLIENT_URL` (used in reset links) (+ optional `PORT`, `JWT_EXPIRES_IN`, `NODE_ENV`); client needs `VITE_API_URL`. In dev the client proxies `/api`; in prod it calls `${VITE_API_URL}/api` directly.
- **Never use React Context for auth or data sharing** — use Redux slices and RTK Query hooks.
- **Never use inline SQL in app code** — always go through stored procedures.
- **Never trust `school_id` from request body** — always derive from `req.user.school_id` in the JWT.
- **Always use the centralized icon library** — never import directly from `lucide-react` in pages/components.
- **Always validate with Zod** — every endpoint that accepts input must have a schema in `src/schema/`.
- **Always send welcome emails** — when creating school admins or staff, fire-and-forget a welcome email with credentials.

## API surface

See PROJECT_PLAN.md §8 for the full endpoint map. Shape:

- `/api/auth/*` (all roles: login, logout, forgot-password, reset-password, me)
- `/api/schools/*` (super_admin only)
- `/api/school-admins/*` (super_admin only: list, status toggle, delete)
- `/api/departments` (school_admin only)
- `/api/staff/*` (school_admin CRUD; plus `/me`, `/me/password`, `/me/avatar` for all; and `/me/dashboard-stats`, `/me/schedule`, `/me/attendance/*`, `/me/leaves`, `/me/tasks/*` for staff)
- `/api/school-admin/*` (school_admin management: tasks, leaves, schedule periods, working-days settings, schedules grid — CRUD + review)

## Current implementation status

- **Fully implemented**: Auth, Schools, School Admins, Departments, Staff CRUD, Profile/Avatar/Password, Forgot/Reset Password, Staff Dashboard, Schedule, Attendance/Clocking, Leaves (submit + review), Tasks (assign + status update), School Admin Schedules/Leaves management, School Settings (profile + preferences), Super Admin school overrides
- **Partially implemented**: Staff Tasks page (backend ready, needs dedicated frontend page)
- **Not yet started**: Documents/Payslips page, Audit fields/soft delete, Activity logs, Notifications, Student module
