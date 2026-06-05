# School Management System — Build Plan

> Phase-by-phase blueprint for building the School Management System.
> Stack: **MySQL (stored procedures)** + **Node/Express** backend + **React (Vite)** frontend.
> Author: Mayur Kapadi · Status: Planning

---

## 1. Project Overview

A multi-tenant School Management System where:

- A **Super Admin** owns the platform and registers **Schools** and their **School Admins**.
- A **School Admin** logs in and manages **Staff** for their own school, organized by **Department**.
- All login-capable users (super admin, school admins, department staff) live in **one `staff` table** and are distinguished by a **role**.

### Core rules (from requirements)

| Rule               | Meaning                                                                      |
| ------------------ | ---------------------------------------------------------------------------- |
| Roles are fixed    | `super_admin`, `school_admin`, `staff` live in a `roles` table               |
| One user table     | Everyone who can log in is a row in `staff` with a `role_id` FK              |
| Super Admin scope  | Can **only** create Schools + School Admins                                  |
| School Admin scope | Can log in, create departments, and register staff **for their school only** |
| Staff registration | Staff are added by a School Admin from their panel (register page)           |
| Tenancy            | Every School Admin and Staff row is tied to a `school_id`                    |

---

## 2. Tech Stack (grounded in current repo)

**Backend (`/server`)** — _to be installed_

- Express (HTTP server + routing)
- `mysql2` (DB driver, calls stored procedures)
- `jsonwebtoken` (JWT auth), `bcrypt` (password hashing)
- `zod` or `express-validator` (input validation)
- `cors`, `dotenv`, `cookie-parser`
- ESM modules (`"type": "module"` already set)

**Frontend (`/client`)** — _already installed_

- React 19 + Vite + React Router v7
- **Redux Toolkit + React-Redux + RTK Query** for all server state (data fetching, caching, invalidation) — a single `baseApi` with `injectEndpoints` per feature; `authSlice` holds the current user. No React Context for auth.
- RTK Query uses a **custom axios `baseQuery`** (not `fetchBaseQuery`) so auth rides on the httpOnly cookie (`withCredentials`); no token header is attached client-side.
- Tailwind v4 + shadcn/ui (radix-ui, lucide, sonner)
- react-hook-form + zod, axios, recharts

**Database**

- MySQL 8 via MySQL Workbench
- **All data access goes through stored procedures** (no raw inline SQL in app code)

---

## 3. Roles & Permission Matrix

| Action                         | Super Admin | School Admin |   Staff   |
| ------------------------------ | :---------: | :----------: | :-------: |
| Create / list schools          |     ✅      |      ❌      |    ❌     |
| Create school admin            |     ✅      |      ❌      |    ❌     |
| Log in                         |     ✅      |      ✅      |    ✅     |
| Create department (own school) |     ❌      |      ✅      |    ❌     |
| Register staff (own school)    |     ❌      |      ✅      |    ❌     |
| List staff (own school)        |     ❌      |      ✅      | view self |
| View own profile               |     ✅      |      ✅      |    ✅     |

Enforced by an **`authorize(...roles)` middleware** + **tenant scoping** (a school_admin can only touch rows where `school_id` matches their token).

---

## 4. Database Design

### 4.1 Tables

```
roles
├─ role_id        INT PK AUTO_INCREMENT
├─ role_name      VARCHAR(50) UNIQUE   -- 'super_admin' | 'school_admin' | 'staff'
└─ created_at     TIMESTAMP

schools
├─ school_id      INT PK AUTO_INCREMENT
├─ name           VARCHAR(150) NOT NULL
├─ code           VARCHAR(30) UNIQUE          -- short school code
├─ email          VARCHAR(150)
├─ phone          VARCHAR(20)
├─ address        VARCHAR(255)
├─ status         ENUM('active','inactive') DEFAULT 'active'
├─ created_by     INT  -- FK -> staff.staff_id (the super admin)
└─ created_at     TIMESTAMP

departments
├─ department_id  INT PK AUTO_INCREMENT
├─ school_id      INT  -- FK -> schools.school_id
├─ name           VARCHAR(100) NOT NULL       -- 'Mathematics', 'Admin', 'Accounts'...
├─ status         ENUM('active','inactive') DEFAULT 'active'
└─ created_at     TIMESTAMP
   UNIQUE (school_id, name)

staff   -- unified login/user table for EVERYONE
├─ staff_id       INT PK AUTO_INCREMENT
├─ role_id        INT  -- FK -> roles.role_id   (REQUIRED)
├─ school_id      INT NULL -- FK -> schools.school_id  (NULL for super_admin)
├─ department_id  INT NULL -- FK -> departments.department_id (NULL for admins)
├─ first_name     VARCHAR(80)
├─ last_name      VARCHAR(80)
├─ email          VARCHAR(150) UNIQUE NOT NULL
├─ password_hash  VARCHAR(255) NOT NULL
├─ phone          VARCHAR(20)
├─ status         ENUM('active','inactive') DEFAULT 'active'
├─ created_by     INT NULL -- FK -> staff.staff_id (who registered this user)
├─ created_at     TIMESTAMP
└─ updated_at     TIMESTAMP
```

### 4.2 Relationships

```
roles (1) ───< (N) staff           role_id
schools (1) ──< (N) staff          school_id     (super_admin row has NULL)
schools (1) ──< (N) departments    school_id
departments (1) < (N) staff        department_id (admins have NULL)
staff (1) ────< (N) staff          created_by    (self-reference: who created whom)
staff (1) ────< (N) schools        created_by
```

### 4.3 Who lives where

| User             | role           | school_id | department_id |
| ---------------- | -------------- | --------- | ------------- |
| Super Admin      | `super_admin`  | NULL      | NULL          |
| School Admin     | `school_admin` | set       | NULL          |
| Department Staff | `staff`        | set       | set           |

### 4.4 Stored Procedures (the only DB interface)

| Proc                                                            | Purpose                               | Called by    |
| --------------------------------------------------------------- | ------------------------------------- | ------------ |
| `sp_seed_roles`                                                 | Insert the 3 fixed roles (idempotent) | setup        |
| `sp_login_get_user(email)`                                      | Return user row + role_name for auth  | auth         |
| `sp_create_school(...)`                                         | Insert school                         | super admin  |
| `sp_list_schools()`                                             | List all schools                      | super admin  |
| `sp_get_school(id)`                                             | School detail                         | super admin  |
| `sp_update_school_status(id, status)`                           | Activate/deactivate                   | super admin  |
| `sp_create_school_admin(school_id, name, email, hash, ...)`     | Create school_admin in `staff`        | super admin  |
| `sp_create_department(school_id, name)`                         | Add department                        | school admin |
| `sp_list_departments(school_id)`                                | Departments of a school               | school admin |
| `sp_create_staff(school_id, dept_id, role_id, ..., created_by)` | Register staff                        | school admin |
| `sp_list_staff(school_id)`                                      | Staff of a school                     | school admin |
| `sp_get_staff(staff_id)`                                        | Staff detail / own profile            | all          |
| `sp_update_staff_status(staff_id, status)`                      | Enable/disable staff                  | school admin |
| `sp_update_password(staff_id, hash)`                            | Change own password                   | all          |

> Each proc validates tenancy where relevant (e.g. staff must belong to the school_id passed in). App layer also re-checks via JWT claims.

---

## 5. Backend Folder Structure (`/server/src`)

Folders already exist — this maps each one's responsibility:

```
server/
├─ index.js               -> boots the server (imports src/app.js)
├─ database/
│  ├─ schema.sql          -> CREATE TABLE statements (run in Workbench)
│  ├─ procedures.sql      -> CREATE PROCEDURE statements
│  └─ seed.sql            -> roles + first super admin
└─ src/
   ├─ app.js              -> Express app: middleware, mount routes
   ├─ routes.js           -> aggregate all feature routers
   ├─ config/
   │  └─ db.js            -> mysql2 connection pool from .env
   ├─ middleware/
   │  ├─ auth.js          -> verify JWT, attach req.user
   │  ├─ authorize.js     -> role guard authorize('super_admin')
   │  ├─ validate.js      -> zod schema runner
   │  └─ error.js         -> central error handler
   ├─ controllers/        -> auth, school, schoolAdmin, department, staff
   ├─ services/           -> business logic, calls models
   ├─ models/             -> thin wrappers that CALL stored procedures
   ├─ routes/             -> auth.routes, school.routes, staff.routes...
   ├─ schema/             -> zod request validators
   ├─ utils/              -> jwt.js, password.js, apiResponse.js
   ├─ templates/          -> email templates (welcome / credentials)
   └─ docs/               -> API docs / postman collection
```

**Data flow:** `route → validate middleware → controller → service → model → stored procedure → MySQL`

---

## 6. Authentication & Authorization

- Login posts `{ email, password }` → `sp_login_get_user` → verify `bcrypt` hash.
- Issue JWT: `{ staff_id, role_name, school_id }`.
- `auth.js` middleware verifies token, sets `req.user`.
- `authorize('super_admin')` etc. guards routes.
- **Tenant guard:** for school_admin/staff routes, force `school_id = req.user.school_id` — never trust a school_id from the request body.
- Passwords hashed with bcrypt; super admin seeded once via `seed.sql`.

---

## 7. Build Phases

### Phase 0 — Setup & Tooling ✅

- [x] Install backend deps: `bun add express mysql2 jsonwebtoken bcrypt dotenv cors cookie-parser zod morgan`
- [x] Create `.env` (DB creds, `JWT_SECRET`, `PORT`) + update `.env.example`
- [x] Wire `index.js` → `src/app.js` with a `/health` route (+ `config/env.js`, `middleware/error.js`, `routes.js`)
- **Done when:** `bun run dev` serves `GET /health → 200` ✓ (verified: `/health`, `/api`, and 404 handler all respond)

### Phase 1 — Database (MySQL Workbench) ✅

- [x] Write `database/schema.sql` (roles, schools, departments, staff + FKs)
- [x] Write `database/procedures.sql` (all 13 procs in §4.4)
- [x] Write `database/seed.sql` (seed 3 roles + 1 super admin with bcrypt hash)
- [x] Run all three, verify tables + procs exist (4 tables, 13 procs, idempotent re-runs)
- **Done when:** `CALL sp_login_get_user('superadmin@...')` returns the seeded row ✓
- **Seeded super admin:** `superadmin@sms.com` / `Admin@123` (change after first login)

### Phase 2 — DB Connection & Models ✅

- [x] `config/db.js` — mysql2 connection pool + `verifyDbConnection()` (ping on startup)
- [x] `utils/callProcedure.js` — **global** proc caller: builds `CALL name(?, ...)` from a params array (`callProcedure` for lists, `callProcedureOne` for single rows)
- [x] `models/` — thin wrappers via the global caller (auth, school, department, staff)
- [x] `utils/` — `password.js` (bcrypt), `jwt.js`, `apiResponse.js` (ok/created/asyncHandler)
- [x] `index.js` — verifies DB before listening; closes pool on shutdown
- **Done when:** a model can call a proc and return rows ✓ (verified: login lookup, password compare, list, jwt roundtrip)

### Phase 3 — Authentication

- [x] `auth.controller` + `auth.routes`: `POST /api/auth/login`, `GET /api/auth/me`
- [x] `middleware/auth.js` + `middleware/authorize.js`
- [x] `middleware/error.js` central handler
- **Done when:** super admin can log in and hit a protected route

### Phase 4 — Super Admin module ✅

- [x] Schools: `POST/GET /api/schools`, `GET /api/schools/:id`, `PATCH /api/schools/:id/status`
- [x] School Admins: `POST /api/schools/:id/admins` (creates `school_admin` in staff)
- [x] All guarded by `protect` + `authorize('super_admin')`; zod validation; ER_DUP_ENTRY → 409; Swagger docs
- **Done when:** super admin creates a school + its admin via API

### Phase 5 — School Admin module ✅

- [x] Departments: `POST/GET /api/departments` (scoped to token's school_id)
- [x] Staff: `POST /api/staff` (register staff), `GET /api/staff`, `GET /api/staff/:id`, `PATCH /api/staff/:id/status`
- [x] Guarded by `protect` + `authorize('school_admin')` + tenant scoping (school_id from token only; cross-school staff → 404; department must belong to own school)
- **Done when:** a school admin logs in, adds a department, registers staff

### Phase 6 — Staff & Profile ✅

- [x] `GET /api/staff/me` profile for any logged-in user (declared before the school_admin guard + `/:id` route)
- [x] `PATCH /api/staff/me/password` — change own password (verifies current password; new `sp_update_password` proc)
- **Done when:** registered staff can log in and view their profile

### Phase 7 — Frontend (React + RTK Query)

State management is **Redux Toolkit + RTK Query** (not React Context). All server
data flows through one `baseApi` (`src/app/baseApi.js`) with a custom axios
`baseQuery`; each feature adds endpoints via `baseApi.injectEndpoints(...)` in its
own `feature.api.js`. Cache coherence is driven by `tagTypes` + `providesTags` /
`invalidatesTags`. Local UI/auth state lives in slices (`authSlice`).

**Conventions**

- Feature folder layout: `src/features/<feature>/{<feature>.api.js, <feature>Slice.js?, pages/, components/}`
- Every list endpoint `providesTags`; every mutation `invalidatesTags` the matching tag so lists refetch automatically.
- Forms: `react-hook-form` + `zod` (`@hookform/resolvers`); submit calls the RTK Query mutation and `.unwrap()`s.
- Feedback: `sonner` toast on mutation success/error; `Skeleton` while `isLoading`.
- Routing: role-based guards (`ProtectedRoute`, `GuestRoute`) already exist; add per-role layouts + nested routes in `App.jsx`.

#### Phase 7.0 — State & app foundation ✅

- [x] `app/store.js` (configureStore: `baseApi.reducer` + `auth`), `app/baseApi.js` (axios baseQuery, `tagTypes: ['User']`)
- [x] `providers/AppProviders.jsx` wires `<Provider store>` + theme; `authSlice` holds `{ user, isAuthenticated }`
- [x] Add remaining `tagTypes` to `baseApi` as features land: `'School'`, `'Department'`, `'Staff'`

#### Phase 7.1 — Auth & shell ✅

- [x] `features/auth/auth.api.js`: `login`, `getMe`, `logout` mutations/queries
- [x] `LoginPage`, `ProtectedRoute` / `GuestRoute`, `useAuth` hook, super/school admin layouts
- [x] Bootstrap `getMe` on app load (`SessionBootstrap` in `AppProviders`); **role-based redirect** via `lib/roles.js` `roleHome()` (super_admin → `/super/dashboard`, school_admin → `/school/dashboard`, staff → `/staff/profile`)
- [x] `RoleRoute` guard branches in `App.jsx`; per-role `logout` wired in each role's own header
- [x] Fixed `useAuth` field bug (`loading` → `isAuthLoading`) so guards wait for the first `/auth/me`
- [x] **Separate layouts per role** — namespaced URLs (`/super/*`, `/school/*`, `/staff/*`); each role has its own `Sidebar` + `Header` (desktop sidebar + mobile `Sheet` drawer) under `components/layouts/<role>/`; shared `useLogout` hook
- [x] Shared `features/profile/ProfileView` rendered inside each role's layout (its sidebar + header); old standalone `ProfilePage` + shared `AppHeader` removed
- **Done when:** logging in lands each role on its correct home; refresh keeps the session ✓ (lint + build pass)

#### Phase 7.2 — Super Admin: Schools

- [ ] `features/super_admin/schools.api.js`: `getSchools` (`providesTags: ['School']`), `getSchool`, `createSchool`, `updateSchoolStatus` (`invalidatesTags: ['School']`)
- [ ] Schools list page (table, status badge, activate/deactivate toggle)
- [ ] Create-school dialog (rhf + zod) → `POST /api/schools`
- **Done when:** super admin lists, creates, and toggles a school's status from the UI

#### Phase 7.3 — Super Admin: School Admins

- [ ] Extend schools api (or `schoolAdmins.api.js`): `createSchoolAdmin` → `POST /api/schools/:id/admins`
- [ ] "Add admin" form from a school's detail/row; surface the created credentials
- **Done when:** super admin creates a school admin for a school via the UI

#### Phase 7.4 — School Admin: Departments

- [ ] `features/school_admin/departments.api.js`: `getDepartments` (`providesTags: ['Department']`), `createDepartment` (`invalidatesTags: ['Department']`)
- [ ] Departments list + create dialog (tenant `school_id` comes from the cookie/token, never the form)
- **Done when:** school admin lists and adds departments

#### Phase 7.5 — School Admin: Staff

- [ ] `features/school_admin/staff.api.js`: `getStaff` (`providesTags: ['Staff']`), `getStaffById`, `createStaff`, `updateStaffStatus` (`invalidatesTags: ['Staff']`)
- [ ] Staff register page (rhf + zod, department `<Select>` fed by `getDepartments`) → `POST /api/staff`
- [ ] Staff list (table + enable/disable) and staff detail
- **Done when:** school admin registers staff into a department and toggles their status

#### Phase 7.6 — Profile & password (all roles)

- [ ] `features/profile/profile.api.js`: `getMyProfile` → `GET /api/staff/me`, `changePassword` → `PATCH /api/staff/me/password`
- [ ] Profile page wired to live data; change-password form (rhf + zod)
- **Done when:** any logged-in user views their profile and changes their password

#### Phase 7.7 — Cross-cutting polish

- [ ] Centralized RTK Query error → toast handling; consistent loading skeletons / empty states
- [ ] Verify tag invalidation matrix end-to-end (mutations refresh the right lists)
- [ ] Accessibility / responsive pass on the new pages

- **Done when (Phase 7 overall):** full flow works in the browser end-to-end — super admin creates a school + admin; that admin logs in, adds a department, registers staff; staff logs in and views/edits their profile

### Phase 8 — Polish (optional)

- [ ] Email credentials to new admins/staff (templates/)
- [ ] Pagination/search on lists
- [ ] Dashboard charts (recharts)
- [ ] Audit fields / soft delete
- [ ] API docs (docs/)

---

## 8. API Endpoint Map

```
POST   /api/auth/login                 all        login
GET    /api/auth/me                    all        current user

POST   /api/schools                    super      create school
GET    /api/schools                    super      list schools
GET    /api/schools/:id                super      school detail
PATCH  /api/schools/:id/status         super      activate/deactivate
POST   /api/schools/:id/admins         super      create school admin

POST   /api/departments                school     create department
GET    /api/departments                school     list (own school)

POST   /api/staff                      school     register staff
GET    /api/staff                      school     list (own school)
GET    /api/staff/:id                  school     staff detail
PATCH  /api/staff/:id/status           school     enable/disable
GET    /api/staff/me                   all        own profile
PATCH  /api/staff/me/password          all        change own password
```

---

## 9. Suggested Build Order (TL;DR)

1. **DB first** (schema → procedures → seed) in Workbench
2. **Backend plumbing** (db pool → auth → middleware)
3. **Super Admin** APIs (schools + school admins)
4. **School Admin** APIs (departments + staff)
5. **Frontend** (RTK Query) in sub-phases: state foundation → auth/shell → schools → school admins → departments → staff → profile/password → polish
6. **Polish** (email, search, dashboards)

> Principle: every DB read/write goes through a **stored procedure**; the Node layer only orchestrates, validates, and authorizes.
