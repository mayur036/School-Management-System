# CampusCore — School Management System

A multi-tenant **CampusCore** School Management System where a Super Admin onboards schools and their admins, each School Admin manages their own staff organized by department, and Staff members access their personalized portal for schedules, attendance, leaves, and tasks.

> **Stack:** MySQL (stored procedures) · Node.js / Express · React (Vite) · Tailwind + shadcn/ui
> **Author:** Mayur Kapadi

For the full architecture and phase-by-phase roadmap, see [PROJECT_PLAN.md](PROJECT_PLAN.md).

---

## ✨ Features

### Super Admin
- Register and manage schools (create, activate/deactivate)
- Create and manage school admins (create, list, toggle status, delete)
- Dashboard with platform-wide statistics and charts (recharts)

### School Admin
- Create and manage departments (with status toggle)
- Register staff (single or batch registration with welcome emails)
- Enable/disable staff status
- Assign tasks to staff members
- Create and manage weekly schedules/timetables for staff
- Review and approve/reject staff leave requests
- Dashboard with school-level analytics

### Staff Portal
- View personalized dashboard (today's classes, pending tasks, attendance stats, work hours)
- Clock in/out with automated status detection (present, late, half-day)
- View weekly schedule/timetable
- Track attendance records with monthly views
- Submit and track leave requests
- View and update assigned tasks

### All Roles
- Secure login with JWT (httpOnly cookie)
- Forgot/reset password via email
- View and edit profile (name, phone)
- Upload/change avatar (Cloudinary)
- Change password
- Dark/Light mode toggle

## 🧱 Roles at a glance

| Role           | Can do                                                                      |
| -------------- | --------------------------------------------------------------------------- |
| `super_admin`  | Create/manage schools, create/manage school admins, platform analytics      |
| `school_admin` | Create departments, register/manage staff, assign tasks, manage schedules & leaves |
| `staff`        | Clock in/out, view schedule, request leave, update tasks, manage profile     |

---

## 📁 Repository structure

```
School Management/
├─ client/           # React + Vite frontend (React 19 + Tailwind v4 + shadcn/ui)
├─ server/           # Node.js + Express backend (REST API + stored procedures)
│  └─ database/      # schema.sql, procedures.sql, seed.sql (run in MySQL Workbench)
├─ design-system/    # MASTER.md — UI design tokens, rules, and component conventions
├─ memory/           # Project decision logs and guidelines
├─ PROJECT_PLAN.md   # Full architecture, build phases, and future roadmap
├─ CLAUDE.md         # AI assistant guidance and codebase conventions
└─ README.md         # You are here
```

See [client/README.md](client/README.md) and [server/README.md](server/README.md) for app-specific setup.

---

## 🚀 Getting started

### Prerequisites

- **Node.js** 18+ (or **Bun** 1.x — recommended)
- **MySQL** 8 + MySQL Workbench

### 1. Set up the database

In MySQL Workbench, run the scripts in `server/database/` in order:

```
schema.sql       # creates 8 tables (roles, schools, departments, staff, schedules, attendance, leaves, tasks)
procedures.sql   # creates 37 stored procedures
seed.sql         # seeds the 3 roles + first super admin
```

### 2. Run the backend

```bash
cd server
bun install
cp .env.example .env   # fill in DB creds, JWT_SECRET, Cloudinary keys, SMTP creds
bun run dev
```

### 3. Run the frontend

```bash
cd client
bun install
cp .env.example .env   # set VITE_API_URL
bun run dev
```

The client runs on Vite's dev server (port 5173) and talks to the backend via `VITE_API_URL`.

### 4. Default credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `superadmin@sms.com` | `Admin@123` |

> Change the password after first login.

---

## 🔐 Environment

Secrets live in `.env` files (gitignored). Copy each `.env.example` and fill in:

- **server** — DB host/user/password/name, `JWT_SECRET`, `PORT`, `JWT_EXPIRES_IN`, Cloudinary keys (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`), SMTP creds (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`), `CLIENT_URL`
- **client** — `VITE_API_URL` (backend base URL)

---

## 🏗️ Architecture

```
React Frontend (RTK Query) ──► Express Router ──► Auth Middleware ──► Authorize ──► Zod Validate ──► Controller ──► Model ──► Stored Procedure ──► MySQL
```

Key architectural decisions:
- **Stored procedures only** — no inline SQL in application code
- **Unified staff table** — all users (super admin, school admin, staff) in one table
- **Tenant scoping** — school_id always derived from JWT, never from request body
- **httpOnly cookie JWT** — no token stored in localStorage or headers
- **Tag-driven cache** — RTK Query tag invalidation keeps UI in sync

---

## 🗺️ Roadmap

Development follows the phases in [PROJECT_PLAN.md](PROJECT_PLAN.md):

| Phase | Description | Status |
|-------|-------------|--------|
| 0–2 | Setup, Database, DB Connection | ✅ Complete |
| 3 | Authentication | ✅ Complete |
| 4 | Super Admin Module | ✅ Complete |
| 5 | School Admin Module | ✅ Complete |
| 6 | Staff & Profile | ✅ Complete |
| 7 | Frontend (React + RTK Query) | ✅ Complete |
| 8 | Polish (Email, Search, Charts) | ✅ Mostly Complete |
| 9 | Staff Portal & Admin Management | ✅ Mostly Complete |
| 10 | Future Roadmap | 📋 Planned |

See [PROJECT_PLAN.md §10](PROJECT_PLAN.md) for the full future roadmap with near-term, medium-term, and long-term feature plans.
