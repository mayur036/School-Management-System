# CampusCore — School Management System — Build Plan

> Phase-by-phase blueprint for building the School Management System.
> Stack: **MySQL (stored procedures)** + **Node/Express** backend + **React (Vite)** frontend.
> Author: Mayur Kapadi · Status: Active Development (Phase 9 in progress)
> Last Updated: 2026-06-15

---

## 1. Project Overview

A multi-tenant School Management System where:

- A **Super Admin** owns the platform and registers **Schools** and their **School Admins**.
- A **School Admin** logs in and manages **Staff** for their own school, organized by **Department**.
- **Staff** members log in to view schedules, clock in/out, request leaves, manage assigned tasks, and view their profile.
- All login-capable users (super admin, school admins, department staff) live in **one `staff` table** and are distinguished by a **role**.

### Core rules (from requirements)

| Rule               | Meaning                                                                      |
| ------------------ | ---------------------------------------------------------------------------- |
| Roles are fixed    | `super_admin`, `school_admin`, `staff` live in a `roles` table               |
| One user table     | Everyone who can log in is a row in `staff` with a `role_id` FK              |
| Super Admin scope  | Can **only** create Schools + School Admins                                  |
| School Admin scope | Can log in, create departments, register staff, assign tasks, manage leaves & schedules **for their school only** |
| Staff scope        | Can clock in/out, view schedule, request leave, update tasks, view/edit profile |
| Staff registration | Staff are added by a School Admin from their panel (register page)           |
| Tenancy            | Every School Admin and Staff row is tied to a `school_id`                    |

---

## 2. Tech Stack (grounded in current repo)

**Backend (`/server`)** — installed & active

- Express (HTTP server + routing)
- `mysql2` (DB driver, calls stored procedures)
- `jsonwebtoken` (JWT auth), `bcrypt` (password hashing)
- `zod` (input validation)
- `cors`, `dotenv`, `cookie-parser`, `morgan`
- `nodemailer` (SMTP email for password reset & welcome emails)
- `cloudinary` + `multer` (avatar image uploads)
- `swagger-jsdoc` + `swagger-ui-express` (API docs)
- ESM modules (`"type": "module"` already set)

**Frontend (`/client`)** — installed & active

- React 19 + Vite + React Router v7 (with React Compiler enabled)
- **Redux Toolkit + React-Redux + RTK Query** for all server state (data fetching, caching, invalidation) — a single `baseApi` with `injectEndpoints` per feature; `authSlice` holds the current user. No React Context for auth.
- RTK Query uses a **custom axios `baseQuery`** (not `fetchBaseQuery`) so auth rides on the httpOnly cookie (`withCredentials`); no token header is attached client-side.
- Tailwind v4 + shadcn/ui (radix-ui, lucide, sonner)
- react-hook-form + zod, axios, recharts

**Database**

- MySQL 8 via MySQL Workbench
- **All data access goes through stored procedures** (no raw inline SQL in app code)
- 8 tables: `roles`, `schools`, `departments`, `staff`, `staff_schedules`, `staff_attendance`, `leave_requests`, `staff_tasks`

---

## 3. Roles & Permission Matrix

| Action                                | Super Admin | School Admin |   Staff   |
| ------------------------------------ | :---------: | :----------: | :-------: |
| Create / list schools                |     ✅      |      ❌      |    ❌     |
| Create school admin                  |     ✅      |      ❌      |    ❌     |
| Manage school admins (list/delete)   |     ✅      |      ❌      |    ❌     |
| Log in                               |     ✅      |      ✅      |    ✅     |
| Create department (own school)       |     ❌      |      ✅      |    ❌     |
| Register staff (own school)          |     ❌      |      ✅      |    ❌     |
| List staff (own school)              |     ❌      |      ✅      | view self |
| Assign tasks to staff                |     ❌      |      ✅      |    ❌     |
| Manage staff schedules               |     ❌      |      ✅      |    ❌     |
| Review staff leaves                  |     ❌      |      ✅      |    ❌     |
| View own profile                     |     ✅      |      ✅      |    ✅     |
| Edit own profile / change password   |     ✅      |      ✅      |    ✅     |
| Upload avatar                        |     ✅      |      ✅      |    ✅     |
| View own schedule / classes          |     ❌      |      ❌      |    ✅     |
| Clock in / Clock out (Time logs)     |     ❌      |      ❌      |    ✅     |
| Request leave / View own leaves      |     ❌      |      ❌      |    ✅     |
| View / update own tasks              |     ❌      |      ❌      |    ✅     |
| View dashboard statistics            |     ✅      |      ✅      |    ✅     |

Enforced by an **`authorize(...roles)` middleware** + **tenant scoping** (a school_admin or staff member can only touch rows scoped to their own `school_id` derived from their token).

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
├─ avatar_url     VARCHAR(255) NULL
├─ avatar_public_id VARCHAR(255) NULL
├─ reset_token    VARCHAR(255) NULL
├─ reset_token_expiry DATETIME NULL
├─ status         ENUM('active','inactive') DEFAULT 'active'
├─ created_by     INT NULL -- FK -> staff.staff_id (who registered this user)
├─ created_at     TIMESTAMP
└─ updated_at     TIMESTAMP

staff_schedules   -- weekly teaching/work timetable
├─ schedule_id    INT PK AUTO_INCREMENT
├─ staff_id       INT NOT NULL  -- FK -> staff.staff_id
├─ subject_name   VARCHAR(100) NOT NULL
├─ class_name     VARCHAR(50) NOT NULL
├─ day_of_week    ENUM('Monday'...'Sunday') NOT NULL
├─ start_time     TIME NOT NULL
├─ end_time       TIME NOT NULL
├─ room           VARCHAR(50) NULL
└─ created_at     TIMESTAMP

staff_attendance  -- daily clock-in/out logs
├─ attendance_id  INT PK AUTO_INCREMENT
├─ staff_id       INT NOT NULL  -- FK -> staff.staff_id
├─ date           DATE NOT NULL
├─ clock_in       TIME NULL
├─ clock_out      TIME NULL
├─ status         ENUM('present','absent','late','leave','half_day') DEFAULT 'present'
└─ created_at     TIMESTAMP
   UNIQUE (staff_id, date)

leave_requests    -- staff leave applications
├─ leave_id       INT PK AUTO_INCREMENT
├─ staff_id       INT NOT NULL  -- FK -> staff.staff_id
├─ leave_type     VARCHAR(50) NOT NULL  -- 'Sick', 'Casual', 'Annual', etc.
├─ start_date     DATE NOT NULL
├─ end_date       DATE NOT NULL
├─ total_days     INT NOT NULL  -- auto-calculated
├─ reason         TEXT NOT NULL
├─ status         ENUM('pending','approved','rejected') DEFAULT 'pending'
├─ reviewed_by    INT NULL  -- FK -> staff.staff_id
├─ reviewed_at    TIMESTAMP NULL
├─ comments       TEXT NULL
└─ created_at     TIMESTAMP

staff_tasks       -- tasks assigned by school admin
├─ task_id        INT PK AUTO_INCREMENT
├─ staff_id       INT NOT NULL  -- FK -> staff.staff_id
├─ title          VARCHAR(150) NOT NULL
├─ description    TEXT NULL
├─ due_date       DATE NULL
├─ status         ENUM('pending','in_progress','completed') DEFAULT 'pending'
├─ created_by     INT NOT NULL  -- FK -> staff.staff_id
└─ created_at     TIMESTAMP
```

### 4.2 Relationships

```
roles (1) ───< (N) staff           role_id
schools (1) ──< (N) staff          school_id     (super_admin row has NULL)
schools (1) ──< (N) departments    school_id
departments (1) < (N) staff        department_id (admins have NULL)
staff (1) ────< (N) staff          created_by    (self-reference: who created whom)
staff (1) ────< (N) schools        created_by
staff (1) ────< (N) staff_schedules     staff_id
staff (1) ────< (N) staff_attendance    staff_id
staff (1) ────< (N) leave_requests      staff_id
staff (1) ────< (N) staff_tasks         staff_id
staff (1) ────< (N) leave_requests      reviewed_by
staff (1) ────< (N) staff_tasks         created_by
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
| `sp_get_school_by_email(email)`                                 | Check for duplicate school emails     | super admin  |
| `sp_update_school_status(id, status)`                           | Activate/deactivate                   | super admin  |
| `sp_create_school_admin(school_id, name, email, hash, ...)`     | Create school_admin in `staff`        | super admin  |
| `sp_list_all_school_admins()`                                   | List all admins globally              | super admin  |
| `sp_delete_school_admin(staff_id)`                              | Permanently delete admin              | super admin  |
| `sp_create_department(school_id, name)`                         | Add department                        | school admin |
| `sp_list_departments(school_id)`                                | Departments of a school               | school admin |
| `sp_update_department_status(school_id, dept_id, status)`       | Activate/deactivate department        | school admin |
| `sp_create_staff(school_id, dept_id, role_id, ..., created_by)` | Register staff                        | school admin |
| `sp_list_staff(school_id)`                                      | Staff of a school                     | school admin |
| `sp_get_staff(staff_id)`                                        | Staff detail / own profile            | all          |
| `sp_update_staff_status(staff_id, status)`                      | Enable/disable staff                  | school admin |
| `sp_update_password(staff_id, hash)`                            | Change own password                   | all          |
| `sp_update_avatar(staff_id, url, public_id)`                    | Update avatar URL + Cloudinary ID     | all          |
| `sp_update_profile(staff_id, first_name, last_name, phone)`     | Update own profile info               | all          |
| `sp_set_reset_token(email, token, expiry)`                      | Set reset token and expiry date       | auth         |
| `sp_get_user_by_reset_token(token)`                             | Get user details by active token      | auth         |
| `sp_reset_password_by_token(token, hash)`                       | Reset password and clear token fields | auth         |
| `sp_get_staff_dashboard_stats(staff_id)`                        | Get staff dashboard metrics           | staff        |
| `sp_get_staff_schedule(staff_id)`                               | Get staff weekly schedule             | staff        |
| `sp_get_staff_attendance(staff_id, start_date, end_date)`       | List attendance logs                  | staff        |
| `sp_clock_in_out(staff_id, date, time)`                         | Daily clock-in/out                    | staff        |
| `sp_create_leave_request(staff_id, type, start, end, reason)`   | Submit new leave request              | staff        |
| `sp_get_staff_leaves(staff_id)`                                 | View own leave history                | staff        |
| `sp_get_staff_tasks(staff_id)`                                  | List assigned tasks                   | staff        |
| `sp_update_task_status(task_id, staff_id, status)`              | Set task completion status            | staff        |
| `sp_assign_staff_task(staff_id, title, desc, due, created_by)`  | Assign task to a staff                | school admin |
| `sp_list_school_leave_requests(school_id)`                      | List leaves for approval              | school admin |
| `sp_review_leave_request(leave_id, status, comments, reviewer)` | Approve or reject leave               | school admin |
| `sp_create_staff_schedule(school_id, staff_id, sub, class, ...)`| Set timetable schedule for staff      | school admin |
| `sp_list_school_tasks(school_id)`                               | List all tasks in school              | school admin |
| `sp_list_school_schedules(school_id)`                           | List all schedules in school          | school admin |
| `sp_delete_staff_schedule(schedule_id, school_id)`              | Delete a schedule entry               | school admin |
| `sp_delete_staff_task(task_id, school_id)`                      | Delete an assigned task               | school admin |

> Each proc validates tenancy where relevant (e.g. staff must belong to the school_id passed in). App layer also re-checks via JWT claims.

---

## 5. Backend Folder Structure (`/server/src`)

Folders already exist — this maps each one's responsibility:

```
server/
├─ index.js               -> boots the server (imports src/app.js)
├─ database/
│  ├─ schema.sql          -> CREATE TABLE statements (8 tables, run in Workbench)
│  ├─ procedures.sql      -> CREATE PROCEDURE statements (37 procs)
│  └─ seed.sql            -> roles + first super admin
└─ src/
   ├─ app.js              -> Express app: middleware, mount routes
   ├─ routes.js           -> aggregate all feature routers
   ├─ config/
   │  ├─ db.js            -> mysql2 connection pool from .env
   │  ├─ env.js           -> centralized env config with required() checks
   │  ├─ cloudinary.js    -> Cloudinary SDK config
   │  ├─ mailer.js        -> nodemailer SMTP transporter
   │  └─ swagger.js       -> Swagger/OpenAPI setup from JSDoc
   ├─ middleware/
   │  ├─ auth.js          -> verify JWT, attach req.user
   │  ├─ authorize.js     -> role guard authorize('super_admin')
   │  ├─ validate.js      -> zod schema runner
   │  ├─ upload.js        -> multer memoryStorage for avatar uploads
   │  └─ error.js         -> central error handler (ER_DUP_ENTRY → 409)
   ├─ controllers/
   │  ├─ auth.controller.js
   │  ├─ school.controller.js
   │  ├─ schoolAdminManager.controller.js
   │  ├─ department.controller.js
   │  └─ staff.controller.js   -> handles staff CRUD + staff activities + school admin management
   ├─ services/           -> currently empty (controllers call models directly)
   ├─ models/
   │  ├─ auth.model.js
   │  ├─ school.model.js
   │  ├─ department.model.js
   │  ├─ staff.model.js
   │  └─ staffActivity.model.js   -> wraps all staff portal + school admin management procs
   ├─ routes/
   │  ├─ auth.routes.js
   │  ├─ school.routes.js
   │  ├─ schoolAdmin.routes.js     -> school admin management routes (/api/school-admin/*)
   │  ├─ schoolAdminManager.routes.js -> super admin manages school admins (/api/school-admins/*)
   │  ├─ department.routes.js
   │  └─ staff.routes.js           -> staff profile + portal + school_admin staff CRUD
   ├─ schema/
   │  ├─ auth.schema.js
   │  ├─ school.schema.js
   │  ├─ department.schema.js
   │  └─ staff.schema.js          -> all staff-related schemas (CRUD, activities, admin management)
   ├─ utils/
   │  ├─ jwt.js
   │  ├─ password.js       -> bcrypt hash/compare
   │  ├─ apiResponse.js    -> ok/created/asyncHandler
   │  ├─ callProcedure.js  -> global proc caller (callProcedure + callProcedureOne)
   │  └─ cloudinary.js     -> uploadAvatar + destroyImage
   ├─ templates/
   │  ├─ welcomeEmailTemplate.js
   │  └─ resetPasswordTemplate.js
   └─ docs/
      ├─ auth.swagger.js
      ├─ school.swagger.js
      ├─ department.swagger.js
      └─ staff.swagger.js
```

**Data flow:** `route → validate middleware → controller → model → stored procedure → MySQL`

> Note: The `services/` folder exists but is currently empty — controllers call models directly. Do not invent a service layer unless explicitly asked.

---

## 6. Authentication & Authorization

- Login posts `{ email, password }` → `sp_login_get_user` → verify `bcrypt` hash.
- Issue JWT (httpOnly cookie): `{ staff_id, role_name, school_id, department_id, first_name, last_name, email }`.
- `auth.js` middleware verifies token from cookie or Bearer header, sets `req.user`.
- `authorize('super_admin')` etc. guards routes.
- **Tenant guard:** for school_admin/staff routes, force `school_id = req.user.school_id` — never trust a school_id from the request body.
- **School status enforcement:** if a school is `inactive`, login and API access is blocked for all its staff (including school admins).
- Passwords hashed with bcrypt; super admin seeded once via `seed.sql`.
- **Password recovery:** forgot-password flow generates a timed reset token, sends an email via SMTP (nodemailer), and reset-password validates the token and updates the hash.

---

## 7. Build Phases

### Phase 0 — Setup & Tooling ✅

- [x] Install backend deps: `bun add express mysql2 jsonwebtoken bcrypt dotenv cors cookie-parser zod morgan`
- [x] Create `.env` (DB creds, `JWT_SECRET`, `PORT`) + update `.env.example`
- [x] Wire `index.js` → `src/app.js` with a `/health` route (+ `config/env.js`, `middleware/error.js`, `routes.js`)
- **Done when:** `bun run dev` serves `GET /health → 200` ✓ (verified: `/health`, `/api`, and 404 handler all respond)

### Phase 1 — Database (MySQL Workbench) ✅

- [x] Write `database/schema.sql` (roles, schools, departments, staff + FKs)
- [x] Write `database/procedures.sql` (all procs in §4.4)
- [x] Write `database/seed.sql` (seed 3 roles + 1 super admin with bcrypt hash)
- [x] Run all three, verify tables + procs exist (8 tables, 37 procs, idempotent re-runs)
- **Done when:** `CALL sp_login_get_user('superadmin@...')` returns the seeded row ✓
- **Seeded super admin:** `superadmin@sms.com` / `Admin@123` (change after first login)

### Phase 2 — DB Connection & Models ✅

- [x] `config/db.js` — mysql2 connection pool + `verifyDbConnection()` (ping on startup)
- [x] `utils/callProcedure.js` — **global** proc caller: builds `CALL name(?, ...)` from a params array (`callProcedure` for lists, `callProcedureOne` for single rows)
- [x] `models/` — thin wrappers via the global caller (auth, school, department, staff)
- [x] `utils/` — `password.js` (bcrypt), `jwt.js`, `apiResponse.js` (ok/created/asyncHandler)
- [x] `index.js` — verifies DB before listening; closes pool on shutdown
- **Done when:** a model can call a proc and return rows ✓ (verified: login lookup, password compare, list, jwt roundtrip)

### Phase 3 — Authentication ✅

- [x] `auth.controller` + `auth.routes`: `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- [x] `middleware/auth.js` + `middleware/authorize.js`
- [x] `middleware/error.js` central handler
- **Done when:** super admin can log in and hit a protected route ✓

### Phase 4 — Super Admin module ✅

- [x] Schools: `POST/GET /api/schools`, `GET /api/schools/:id`, `PATCH /api/schools/:id/status`
- [x] School Admins: `POST /api/schools/:id/admins` (creates `school_admin` in staff)
- [x] All guarded by `protect` + `authorize('super_admin')`; zod validation; ER_DUP_ENTRY → 409; Swagger docs
- **Done when:** super admin creates a school + its admin via API ✓

### Phase 5 — School Admin module ✅

- [x] Departments: `POST/GET /api/departments` (scoped to token's school_id)
- [x] Staff: `POST /api/staff` (register staff), `GET /api/staff`, `GET /api/staff/:id`, `PATCH /api/staff/:id/status`
- [x] Guarded by `protect` + `authorize('school_admin')` + tenant scoping (school_id from token only; cross-school staff → 404; department must belong to own school)
- **Done when:** a school admin logs in, adds a department, registers staff ✓

### Phase 6 — Staff & Profile ✅

- [x] `GET /api/staff/me` profile for any logged-in user (declared before the school_admin guard + `/:id` route)
- [x] `PATCH /api/staff/me/password` — change own password (verifies current password; `sp_update_password` proc)
- [x] `PATCH /api/staff/me/avatar` — upload/replace own avatar photo using Cloudinary (buffered upload, deletes old image)
- [x] `PATCH /api/staff/me` — update own profile (first_name, last_name, phone)
- **Done when:** registered staff can log in, view their profile, upload a profile photo, edit profile info, and change their password ✓

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
- [x] Tag types registered: `'User'`, `'School'`, `'Department'`, `'Staff'`, `'SchoolAdmin'`, `'StaffSchedule'`, `'StaffAttendance'`, `'StaffLeave'`

#### Phase 7.1 — Auth & shell ✅

- [x] `features/auth/auth.api.js`: `login`, `getMe`, `logout` mutations/queries
- [x] `LoginPage`, `ProtectedRoute` / `GuestRoute`, `useAuth` hook, super/school admin layouts
- [x] Bootstrap `getMe` on app load (`SessionBootstrap` in `AppProviders`); **role-based redirect** via `lib/roles.js` `roleHome()` (super_admin → `/super/dashboard`, school_admin → `/school/dashboard`, staff → `/staff/profile`)
- [x] `RoleRoute` guard branches in `App.jsx`; per-role `logout` wired in each role's own header
- [x] Fixed `useAuth` field bug (`loading` → `isAuthLoading`) so guards wait for the first `/auth/me`
- [x] **Separate layouts per role** — namespaced URLs (`/super/*`, `/school/*`, `/staff/*`); each role has its own `Sidebar` + `Header` (desktop sidebar + mobile `Sheet` drawer) under `components/layouts/<role>/`; shared `useLogout` hook
- [x] Shared `features/profile/ProfileView` rendered inside each role's layout (its sidebar + header); old standalone `ProfilePage` + shared `AppHeader` removed
- [x] Forgot Password + Reset Password pages (`ForgotPasswordPage`, `ResetPasswordPage`) with guest-only routing
- **Done when:** logging in lands each role on its correct home; refresh keeps the session ✓ (lint + build pass)

#### Phase 7.2 — Super Admin: Schools ✅

- [x] `features/super_admin/schools.api.js`: `getSchools` (`providesTags: ['School']`), `getSchool`, `createSchool`, `updateSchoolStatus` (`invalidatesTags: ['School']`)
- [x] Schools list page (table, status badge, activate/deactivate toggle)
- [x] Create-school dialog (rhf + zod) → `POST /api/schools`
- **Done when:** super admin lists, creates, and toggles a school's status from the UI ✓

#### Phase 7.3 — Super Admin: School Admins ✅

- [x] Extend schools api (or `schoolAdmins.api.js`): `createSchoolAdmin` → `POST /api/schools/:id/admins`
- [x] "Add admin" form from a school's detail/row; surface the created credentials
- [x] Create `schoolAdminManager` routes and controllers (`GET`, `PATCH`, `DELETE` `/api/school-admins`)
- [x] Build `AdminsPage` with search, filtering, `AdminStatusToggle`, and `DeleteAdminAlert`
- **Done when:** super admin creates, lists, updates, and deletes a school admin via the UI ✓

#### Phase 7.4 — School Admin: Departments ✅

- [x] `features/school_admin/departments.api.js`: `getDepartments` (`providesTags: ['Department']`), `createDepartment` (`invalidatesTags: ['Department']`)
- [x] Departments list + create dialog (tenant `school_id` comes from the cookie/token, never the form)
- **Done when:** school admin lists and adds departments ✓

#### Phase 7.5 — School Admin: Staff ✅

- [x] `features/school_admin/staff.api.js`: `getStaff` (`providesTags: ['Staff']`), `getStaffById`, `createStaff`, `updateStaffStatus` (`invalidatesTags: ['Staff']`)
- [x] Staff register page (rhf + zod, department `<Select>` fed by `getDepartments`) → `POST /api/staff`
- [x] Staff list (table + enable/disable) and staff detail
- [x] Allowed multiple staff registration in the same department but implemented DB validations to prevent cross-school registrations.
- [x] Batch registration support (multiple staff at once)
- **Done when:** school admin registers staff into a department and toggles their status ✓

#### Phase 7.6 — Profile & password (all roles) ✅

- [x] `features/profile/profile.api.js`: `uploadAvatar` (PATCH `/staff/me/avatar`) ✅, `getMyProfile` → `GET /api/staff/me` ✅, `changePassword` → `PATCH /api/staff/me/password` ✅
- [x] Profile page wired to live data (avatar upload, details display, and change-password form) ✅
- [x] Profile Edit Dialog fields integrated with react-hook-form and schema validations extracted to a separate file.
- [x] Forgot & Reset Password flow: global SMTP `mailer.js` setup, template `resetPasswordTemplate.js`, recovery API routers/controllers (`POST /api/auth/forgot-password`, `POST /api/auth/reset-password`), client-side forms and page triggers.
- **Done when:** any logged-in user views/edits their profile, uploads an avatar, and changes their password, and guest users can trigger forgot password links and reset passwords securely. ✓

#### Phase 7.7 — Cross-cutting polish ✅

- [x] Centralized RTK Query error → toast handling; consistent loading skeletons / empty states (implemented in SchoolsTable, StaffTable, and ErrorPage redesign)
- [x] Verify tag invalidation matrix end-to-end (mutations refresh the right lists)
- [x] Accessibility / responsive pass on the new pages (stats cards made mobile-friendly with shadcn components)
- [x] UI Refactoring (ProfileView extracted to ProfileTabContent, standardized StatCard usage across School Admin and Super Admin dashboards)
- [x] Enforced strict school-level inactive status blocking logins for all school users.
- [x] Consolidated icons into a unified library (`lib/icons/`) with base, UI, and role-specific icon dictionaries for easier maintenance.
- **Done when (Phase 7 overall):** full flow works in the browser end-to-end ✓

### Phase 8 — Polish ✅

- [x] Email credentials to new admins/staff (templates/)
- [x] Pagination/search on lists (implemented client-side filtering, searching, pagination, and CSV export on StaffPage, SchoolsPage, and AdminsPage)
- [x] Code optimization (extracted `useDataTable` custom hook and `EmptyTableState` shared component)
- [x] Strict Validation (enforced required fields and unique emails across all schemas and API routes)
- [x] Dashboard charts (recharts) (Implemented for Super Admin & School Admin dashboards)
- [ ] Audit fields / soft delete
- [ ] Activity Logs & tracking (Upcoming on Profile page)
- [x] API docs (docs/ — Swagger/OpenAPI JSDoc annotations for auth, schools, departments, staff)
- [x] Security Hardening (helmet, global/auth/upload rate-limiters, input sanitization, file upload magic bytes validation)

### Phase 9 — Staff Portal & School Admin Management ✅ (Partially Complete)

Implementation of the staff portal and school admin management for schedules, attendance, leaves, and tasks.

#### Phase 9.1 — Schema & Database Migration ✅
- [x] Added `staff_schedules`, `staff_attendance`, `leave_requests`, and `staff_tasks` tables to `schema.sql`.
- [x] Created all stored procedures in `procedures.sql` (37 total procs).
- [x] Seed records available for testing.
- [x] Migration scripts run in MySQL Workbench.

#### Phase 9.2 — Backend Models & API Routes ✅
- [x] Created Zod schemas in `schema/staff.schema.js` for leaves, clock-in, task status, schedules, assign task, review leave, and create schedule.
- [x] Created thin model wrapper in `models/staffActivity.model.js` invoking procedures via `callProcedure`.
- [x] Implemented staff portal controllers in `controllers/staff.controller.js` for `/api/staff/me/*` endpoints.
- [x] Implemented School Admin management endpoints in `routes/schoolAdmin.routes.js` for tasks, leaves, and schedules.

#### Phase 9.3 — Frontend RTK Query & Sidebar ✅
- [x] Created `features/staff/staffActivity.api.js` with RTK Query endpoints and tag invalidations (`StaffSchedule`, `StaffAttendance`, `StaffLeave`).
- [x] Registered routes inside `/staff/*` in `client/src/App.jsx` (dashboard, schedule, attendance).
- [x] Updated sidebar navigation items in staff layout using `STAFF` icons.

#### Phase 9.4 — Dashboard & Time Clocking ✅
- [x] Built `StaffDashboard.jsx` with stat cards (today's classes, pending tasks, present days, leave days, work hours).
- [x] Built Clock In/Out panel with status toggle.
- [x] Interactive schedule and task widgets on dashboard.

#### Phase 9.5 — Schedule Page ✅
- [x] Built `SchedulePage.jsx` displaying a weekly timetable grid.

#### Phase 9.6 — Attendance & Leaves ✅
- [x] Built `AttendanceLeavePage.jsx` with dual-tab layout.
- [x] Tab 1 (Attendance): Monthly table showing daily status marks, clock times, and work duration.
- [x] Tab 2 (Leaves): Leave request history with status badges + `LeaveRequestDialog` modal form.
- [x] Attendance and Leave stat cards (`StaffAttendanceStatCard`, `StaffLeaveStatCard`).

#### Phase 9.7 — School Admin: Schedules & Leaves Management ✅
- [x] Built `SchedulesPage.jsx` for school admin to create/view/delete staff schedules.
- [x] Built `LeavesPage.jsx` for school admin to view/approve/reject staff leave requests.

#### Phase 9.8 — Documents & Payslips 🔴 Pending
- [ ] Build `DocumentsPage.jsx` listing downloadable school policies/materials and payslip records.

**Done when:** A staff member logs in and can clock in/out, submit leave requests, view schedule, and view dashboard stats; a school admin can assign tasks, view/approve leaves, and manage schedules. ✓ (Partially — documents/payslips pending)

---

## 8. API Endpoint Map

```
POST   /api/auth/login                 all        login
POST   /api/auth/logout                all        logout (clear cookie)
POST   /api/auth/forgot-password       all        request reset email
POST   /api/auth/reset-password        all        set new password using token
GET    /api/auth/me                    all        current user

POST   /api/schools                    super      create school
GET    /api/schools                    super      list schools
GET    /api/schools/:id                super      school detail
PATCH  /api/schools/:id/status         super      activate/deactivate
POST   /api/schools/:id/admins         super      create school admin

GET    /api/school-admins              super      list all school admins
PATCH  /api/school-admins/:id/status   super      toggle admin status
DELETE /api/school-admins/:id          super      delete school admin

POST   /api/departments                school     create department
GET    /api/departments                school     list (own school)

POST   /api/staff                      school     register staff (single or batch)
GET    /api/staff                      school     list (own school)
GET    /api/staff/:id                  school     staff detail
PATCH  /api/staff/:id/status           school     enable/disable

GET    /api/staff/me                   all        own profile
PATCH  /api/staff/me                   all        update own profile
PATCH  /api/staff/me/password          all        change own password
PATCH  /api/staff/me/avatar            all        upload / replace avatar (Cloudinary)

GET    /api/staff/me/dashboard-stats   staff      get dashboard statistics
GET    /api/staff/me/schedule          staff      get weekly schedule
GET    /api/staff/me/attendance        staff      list attendance records
POST   /api/staff/me/attendance/clock  staff      perform clock-in/out
GET    /api/staff/me/leaves            staff      list own leave requests
POST   /api/staff/me/leaves            staff      apply for a new leave
GET    /api/staff/me/tasks             staff      list own assigned tasks
PATCH  /api/staff/me/tasks/:id/status  staff      update task status

POST   /api/school-admin/tasks         school     assign task to staff member
GET    /api/school-admin/tasks         school     list all school tasks
DELETE /api/school-admin/tasks/:id     school     delete a task

GET    /api/school-admin/leaves        school     list staff leaves for review
PATCH  /api/school-admin/leaves/:id    school     approve/reject leave request

POST   /api/school-admin/schedules     school     create staff schedule entry
GET    /api/school-admin/schedules     school     list all school schedules
DELETE /api/school-admin/schedules/:id school     delete a schedule entry
```

---

## 9. Suggested Build Order (TL;DR)

1. **DB first** (schema → procedures → seed) in Workbench ✅
2. **Backend plumbing** (db pool → auth → middleware) ✅
3. **Super Admin** APIs (schools + school admins) ✅
4. **School Admin** APIs (departments + staff) ✅
5. **Staff Portal** Database Schema + Stored Procedures ✅
6. **Staff Portal** Backend APIs (clock-in, leaves, tasks, schedules) ✅
7. **School Admin** Management APIs (assign tasks, review leaves, set schedules) ✅
8. **Staff Portal** Frontend Pages (dashboard, schedule, attendance/leaves) ✅
9. **Polish** (email notifications, charts, PDF downloads) ⏳

> Principle: every DB read/write goes through a **stored procedure**; the Node layer only orchestrates, validates, and authorizes.

---

## 10. Future Roadmap

### 🟢 Near-Term (0–2 months) — Immediate Priorities

Features that complete existing gaps and polish the current product.

| # | Feature | Description | Affected Areas |
|---|---------|-------------|----------------|
| N1 | **Staff Tasks Page** | Build `TasksPage.jsx` separating assigned duties into To-Do, In Progress, and Completed tabs/cards with quick status toggles. (Backend ready; needs frontend page.) | `client/features/staff/pages/` |
| N2 | **Documents & Payslips Page** | Build `DocumentsPage.jsx` listing downloadable school policies/materials and simulated payslip records with download action. | `client/features/staff/pages/`, `server/database/` |
| N3 | **Audit Fields / Soft Delete** | Add `deleted_at` timestamp column to key tables (`staff`, `schools`, `departments`) for soft-delete instead of hard-delete. Update stored procedures to filter deleted rows. | `server/database/schema.sql`, `procedures.sql`, all models |
| N4 | **Tag Invalidation Verification** | End-to-end verify tag invalidation matrix — ensure every mutation refetches the correct lists (e.g., schedule creation invalidates both staff and admin schedule views). | `client/features/*/api.js` |
| N5 | **School Admin Tasks Page** | Complete the school admin tasks management UI — list assigned tasks with filtering, view task details, and task deletion confirmation. | `client/features/school_admin/pages/` |
| N6 | **Department Status Toggle** | Wire the `sp_update_department_status` stored procedure (already exists) to the frontend UI. Add activate/deactivate toggle on the Departments page. | `client/features/school_admin/`, `server/routes/department.routes.js` |
| N7 | **Swagger Docs for Staff Portal** | Extend Swagger/OpenAPI annotations to cover the new staff portal and school-admin management endpoints. | `server/src/docs/` |

### 🟡 Medium-Term (3–6 months) — Feature Expansion

Features that deepen functionality and improve operational efficiency.

| # | Feature | Description | Affected Areas |
|---|---------|-------------|----------------|
| M1 | **Activity Logs & Audit Trail** | Track user actions (login, profile edit, leave request, schedule change) in an `activity_logs` table. Display a filterable activity timeline on each user's profile. | New table + stored procs, new model, controller, frontend component |
| M2 | **Notifications System** | In-app notification bell (unread count, dropdown list) for events like leave approval, task assignment, schedule change. Server-sent events (SSE) or polling. | New table `notifications`, server SSE endpoint, client notification dropdown |
| M3 | **Bulk Operations** | Enable school admins to bulk-enable/disable staff, bulk-assign tasks, bulk-approve leaves. Add `SelectAll` checkbox to tables. | `client/components/shared/`, `server/database/procedures.sql` |
| M4 | **Advanced Dashboard Analytics** | Expand dashboards with trend charts (attendance over time, leave patterns, task completion rates). Add date-range pickers and department-level filters. | `client/features/*/Dashboard.jsx`, recharts, new stored procs |
| M5 | **PDF Export** | Generate downloadable PDF reports for attendance records, leave summaries, payslips. Use a library like `pdfmake` or `jsPDF` on the client or `pdfkit` on the server. | New util/library, server endpoint or client-side generation |
| M6 | **School Settings Page** | Allow school admins to configure school-level settings: working hours (late threshold), leave policy (annual leave quota), academic calendar, school logo upload. | New table `school_settings`, stored procs, model, frontend page |
| M7 | **Email Notifications** | Send automated email notifications for key events: leave approved/rejected, new task assigned, schedule updated, password changed. Extend existing mailer.js + templates. | `server/config/mailer.js`, new templates, controller hooks |
| M8 | **Server-Side Pagination** | Replace client-side filtering with server-side paginated queries (`LIMIT/OFFSET` in stored procedures). Add `?page=&limit=&search=&sort=` query params. | `server/database/procedures.sql`, models, controllers, client pagination |
| M9 | **Test Suite (Backend)** | Add unit tests for models and integration tests for API routes using Vitest or Jest. Mock the database pool and test each endpoint's auth, validation, and response. | New `server/__tests__/` directory, test config |

### 🔴 Long-Term (6–12+ months) — Platform Evolution

Features that transform the product into a comprehensive school operations platform.

| # | Feature | Description | Affected Areas |
|---|---------|-------------|----------------|
| L1 | **Student Management Module** | New tables (`students`, `enrollments`, `grades`, `classes`). School admins register students, assign to classes. Staff can view/manage their class students. | Major: new schema, procedures, models, controllers, frontend feature |
| L2 | **Parent / Guardian Portal** | New role `parent`. Parents log in to view their child's attendance, grades, schedule, and communicate with teachers. | New role, auth changes, new frontend layout + feature module |
| L3 | **Fee Management & Billing** | Track student fee structures, payment records, generate invoices. Integrate with payment gateways (Stripe/Razorpay). | New tables, payment gateway integration, PDF invoices |
| L4 | **Timetable Auto-Generation** | Algorithm to auto-generate conflict-free weekly timetables based on teacher availability, room capacity, and subject requirements. | New service layer logic, constraint-solving algorithm |
| L5 | **Real-Time Chat / Messaging** | WebSocket-based chat between staff members, or between parents and teachers. Message history, read receipts. | WebSocket server (Socket.IO), new tables, real-time frontend |
| L6 | **Mobile App (React Native)** | Native mobile companion app for staff clock-in/out (with GPS), push notifications, and quick task updates. | New `mobile/` package, shared API, push notification service |
| L7 | **Multi-Language (i18n)** | Internationalize the frontend with `react-i18next`. Support English, Hindi, and other regional languages. | `client/` — locale files, translation keys, language switcher |
| L8 | **Role-Based Dashboard Builder** | Allow super admins to configure custom dashboard widgets per role. Drag-and-drop layout with saved preferences. | New table `dashboard_configs`, dynamic dashboard rendering |
| L9 | **Exam & Grade Management** | Create exam schedules, record grades/marks, generate report cards. Class-wise and student-wise performance analytics. | New tables, stored procs, frontend module |
| L10 | **Security Hardening (Completed)** | Global/auth/upload rate limiting, helmet headers, custom input sanitization, and strict file magic-bytes/extension checks implemented. | `server/src/app.js`, new middlewares, custom sanitization, enhanced multer |
| L11 | **CI/CD & Deployment** | GitHub Actions pipeline: lint → test → build → deploy. Containerize with Docker. Deploy to Vercel (frontend) + Railway/Render (backend). | `.github/workflows/`, `Dockerfile`, `docker-compose.yml` |
| L12 | **Super Admin Platform Analytics** | Platform-wide analytics dashboard: total schools, total users, active vs inactive trends, revenue metrics (if billing enabled). | New stored procs, super admin dashboard expansion |
