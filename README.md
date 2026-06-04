# School Management System

A multi-tenant **School Management System** where a Super Admin onboards schools and their admins, and each School Admin manages their own staff — organized by department.

> **Stack:** MySQL (stored procedures) · Node.js / Express · React (Vite) · Tailwind + shadcn/ui
> **Author:** Mayur Kapadi

For the full architecture and phase-by-phase roadmap, see [PROJECT_PLAN.md](PROJECT_PLAN.md).

---

## ✨ Features

- **Super Admin** — registers schools and creates each school's admin.
- **School Admin** — logs in, creates departments, and registers staff for their own school only.
- **Staff** — department-wise members added by their School Admin; can log in and view their profile.
- **Role-based access** — `super_admin`, `school_admin`, `staff` with tenant scoping (admins only touch their own school's data).
- **Stored-procedure-driven data layer** — all DB reads/writes go through MySQL stored procedures.

## 🧱 Roles at a glance

| Role           | Can do                                            |
| -------------- | ------------------------------------------------- |
| `super_admin`  | Create / list schools, create school admins       |
| `school_admin` | Create departments, register & manage own staff   |
| `staff`        | Log in, view own profile                          |

---

## 📁 Repository structure

```
School Management/
├─ client/          # React + Vite frontend
├─ server/          # Node.js + Express backend (REST API)
│  └─ database/     # schema.sql, procedures.sql, seed.sql (run in MySQL Workbench)
├─ PROJECT_PLAN.md  # full architecture + build phases
└─ README.md        # you are here
```

See [client/README.md](client/README.md) and [server/README.md](server/README.md) for app-specific setup.

---

## 🚀 Getting started

### Prerequisites

- **Node.js** 18+ (or **Bun** 1.x)
- **MySQL** 8 + MySQL Workbench

### 1. Set up the database

In MySQL Workbench, run the scripts in `server/database/` in order:

```
schema.sql       # creates roles, schools, departments, staff tables
procedures.sql   # creates all stored procedures
seed.sql         # seeds the 3 roles + first super admin
```

### 2. Run the backend

```bash
cd server
bun install
cp .env.example .env   # fill in DB creds + JWT_SECRET
bun run dev
```

### 3. Run the frontend

```bash
cd client
bun install
cp .env.example .env   # set VITE_API_URL
bun run dev
```

The client runs on Vite's dev server and talks to the backend via `VITE_API_URL`.

---

## 🔐 Environment

Secrets live in `.env` files (gitignored). Copy each `.env.example` and fill in:

- **server** — DB host/user/password/name, `JWT_SECRET`, `PORT`
- **client** — `VITE_API_URL` (backend base URL)

---

## 🗺️ Roadmap

Development follows the phases in [PROJECT_PLAN.md](PROJECT_PLAN.md):

1. Database (schema → procedures → seed)
2. Backend plumbing (DB pool, auth, middleware)
3. Super Admin module (schools + school admins)
4. School Admin module (departments + staff)
5. Frontend panels
6. Polish (email, search, dashboards)
