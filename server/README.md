# School Management System — Backend

REST API for the School Management System. Built with **Node.js + Express**, talking to **MySQL** exclusively through **stored procedures**, with **JWT** auth and role-based access control.

> Part of the [School Management System](../README.md). See [PROJECT_PLAN.md](../PROJECT_PLAN.md) for the full design.

---

## 🧰 Tech stack

- **Node.js + Express** — HTTP server & routing
- **mysql2** — DB driver (calls stored procedures)
- **jsonwebtoken + bcrypt** — auth & password hashing
- **zod** — request validation
- **dotenv, cors, cookie-parser** — config & middleware
- ESM modules (`"type": "module"`)

## 📁 Structure

```
server/
├─ index.js               # boots the server (imports src/app.js)
├─ database/
│  ├─ schema.sql          # CREATE TABLE statements
│  ├─ procedures.sql      # CREATE PROCEDURE statements
│  └─ seed.sql            # roles + first super admin
└─ src/
   ├─ app.js              # Express app: middleware + route mounting
   ├─ routes.js           # aggregates all feature routers
   ├─ config/             # db.js (mysql2 pool)
   ├─ middleware/         # auth, authorize, validate, error
   ├─ controllers/        # request handlers
   ├─ services/           # business logic
   ├─ models/             # thin wrappers that CALL stored procedures
   ├─ routes/             # feature routers (auth, school, staff...)
   ├─ schema/             # zod request validators
   ├─ utils/              # jwt, password, apiResponse
   ├─ templates/          # email templates
   └─ docs/               # API docs
```

**Request flow:** `route → validate → controller → service → model → stored procedure → MySQL`

---

## 🚀 Setup

### Prerequisites

- Node.js 18+ (or Bun 1.x)
- MySQL 8 (with MySQL Workbench)

### 1. Database

Run the scripts in `database/` in order via MySQL Workbench:

```
schema.sql  →  procedures.sql  →  seed.sql
```

### 2. Install & configure

```bash
bun install
cp .env.example .env
```

Fill in `.env`:

```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
JWT_SECRET=change_me
JWT_EXPIRES_IN=1d
```

### 3. Run

```bash
bun run dev     # nodemon (hot reload)
bun start       # production
```

Health check: `GET http://localhost:5000/health`

---

## 📡 API overview

| Method | Endpoint                    | Role   | Purpose                   |
| ------ | --------------------------- | ------ | ------------------------- |
| POST   | `/api/auth/login`           | all    | Log in                    |
| POST   | `/api/auth/forgot-password` | all    | Request reset link email  |
| POST   | `/api/auth/reset-password`  | all    | Reset password with token |
| GET    | `/api/auth/me`              | all    | Current user              |
| POST   | `/api/schools`              | super  | Create school             |
| GET    | `/api/schools`              | super  | List schools              |
| PATCH  | `/api/schools/:id/status`   | super  | Activate / deactivate     |
| POST   | `/api/schools/:id/admins`   | super  | Create school admin       |
| POST   | `/api/departments`          | school | Create department         |
| GET    | `/api/departments`          | school | List own departments      |
| POST   | `/api/staff`                | school | Register staff            |
| GET    | `/api/staff`                | school | List own staff            |
| PATCH  | `/api/staff/:id/status`     | school | Enable / disable staff    |
| GET    | `/api/staff/me`             | all    | Own profile               |

> `super` = `super_admin`, `school` = `school_admin`. School-scoped routes derive `school_id` from the JWT — never from the request body.

---

## 🧪 Scripts

```bash
bun run dev          # start with nodemon
bun start            # start with node
bun run lint         # eslint
bun run lint:fix     # eslint --fix
bun run format       # prettier --write
```
