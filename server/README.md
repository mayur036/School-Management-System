# School Management System — Backend

REST API for the School Management System. Built with **Node.js + Express**, talking to **MySQL** exclusively through **stored procedures**, with **JWT** auth (httpOnly cookie), role-based access control, and multi-tenant scoping.

> Part of the [School Management System](../README.md). See [PROJECT_PLAN.md](../PROJECT_PLAN.md) for the full design.

---

## 🧰 Tech stack

- **Node.js + Express** — HTTP server & routing
- **mysql2** — DB driver (calls stored procedures exclusively)
- **jsonwebtoken + bcrypt** — JWT auth & password hashing
- **zod** — request validation middleware
- **nodemailer** — SMTP email (password reset + welcome emails)
- **cloudinary + multer** — avatar image uploads (buffer stream)
- **swagger-jsdoc + swagger-ui-express** — API documentation
- **dotenv, cors, cookie-parser, morgan** — config & middleware
- ESM modules (`"type": "module"`)

## 📁 Structure

```
server/
├─ index.js                    # Boots the server (DB verify → listen → graceful shutdown)
├─ database/
│  ├─ schema.sql               # 8 tables (roles, schools, departments, staff, schedules,
│  │                           #   attendance, leave_requests, staff_tasks) + FKs + indexes
│  ├─ procedures.sql           # 37 stored procedures (all sp_*)
│  └─ seed.sql                 # 3 roles + first super admin (idempotent)
└─ src/
   ├─ app.js                   # Express app: CORS, body parsers, cookies, morgan, swagger,
   │                           #   health check, API routes, error handlers
   ├─ routes.js                # Aggregates all feature routers under /api
   ├─ config/
   │  ├─ db.js                 # mysql2 pool + verifyDbConnection()
   │  ├─ env.js                # Centralized env config (required() checks for critical keys)
   │  ├─ cloudinary.js         # Cloudinary SDK initialization
   │  ├─ mailer.js             # Nodemailer SMTP transporter (sendEmail utility)
   │  └─ swagger.js            # Swagger/OpenAPI setup from JSDoc annotations
   ├─ middleware/
   │  ├─ auth.js               # JWT verify (cookie or Bearer), attaches req.user
   │  ├─ authorize.js          # Role guard: authorize('super_admin', ...)
   │  ├─ validate.js           # Zod schema validation middleware
   │  ├─ upload.js             # Multer memoryStorage for avatar uploads
   │  └─ error.js              # Central error handler (ApiError, ER_DUP_ENTRY → 409)
   ├─ controllers/
   │  ├─ auth.controller.js         # Login, logout, getMe, forgot/reset password
   │  ├─ school.controller.js       # School CRUD + create school admin
   │  ├─ schoolAdminManager.controller.js  # List/delete school admins (super admin)
   │  ├─ department.controller.js    # Department CRUD (school admin)
   │  └─ staff.controller.js        # Staff CRUD + profile + portal + school admin management
   ├─ services/                # Currently empty (controllers → models directly)
   ├─ models/
   │  ├─ auth.model.js         # sp_login_get_user, findUserByEmail
   │  ├─ school.model.js       # School CRUD procs
   │  ├─ department.model.js   # Department procs
   │  ├─ staff.model.js        # Staff CRUD + profile + avatar procs
   │  └─ staffActivity.model.js  # Staff portal + school admin management procs
   ├─ routes/
   │  ├─ auth.routes.js        # /api/auth/* (all roles)
   │  ├─ school.routes.js      # /api/schools/* (super_admin)
   │  ├─ schoolAdminManager.routes.js  # /api/school-admins/* (super_admin)
   │  ├─ department.routes.js  # /api/departments (school_admin)
   │  ├─ staff.routes.js       # /api/staff/* (profile: all, portal: staff, CRUD: school_admin)
   │  └─ schoolAdmin.routes.js # /api/school-admin/* (tasks, leaves, schedules — school_admin)
   ├─ schema/
   │  ├─ auth.schema.js        # Login + forgot/reset password schemas
   │  ├─ school.schema.js      # School create + school admin create schemas
   │  ├─ department.schema.js  # Department create schema
   │  └─ staff.schema.js       # Staff CRUD, profile, activities, admin management schemas
   ├─ utils/
   │  ├─ jwt.js                # Sign + verify JWT tokens
   │  ├─ password.js           # bcrypt hash + compare
   │  ├─ apiResponse.js        # ok(), created(), asyncHandler()
   │  ├─ callProcedure.js      # Global stored procedure caller (callProcedure + callProcedureOne)
   │  └─ cloudinary.js         # uploadAvatar() + destroyImage()
   ├─ templates/
   │  ├─ welcomeEmailTemplate.js     # HTML email for new staff/admin credentials
   │  └─ resetPasswordTemplate.js    # HTML email for password reset link
   └─ docs/
      ├─ auth.swagger.js       # Swagger annotations for auth endpoints
      ├─ school.swagger.js     # Swagger annotations for school endpoints
      ├─ department.swagger.js # Swagger annotations for department endpoints
      └─ staff.swagger.js      # Swagger annotations for staff endpoints
```

**Request flow:** `route → validate → controller → model → stored procedure → MySQL`

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

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management_system

# Auth
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d

# Cloudinary (avatar uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM="CampusCore <noreply@campuscore.com>"

# Client URL (for reset links in emails)
CLIENT_URL=http://localhost:5173
```

### 3. Run

```bash
bun run dev     # nodemon (hot reload, port 5000)
bun start       # production (node)
```

Health check: `GET http://localhost:5000/health`
API docs: `GET http://localhost:5000/api-docs` (Swagger UI)

---

## 📡 API overview

### Auth (`/api/auth/*`) — All Roles

| Method | Endpoint                    | Purpose                       |
| ------ | --------------------------- | ----------------------------- |
| POST   | `/api/auth/login`           | Log in (sets httpOnly cookie) |
| POST   | `/api/auth/logout`          | Log out (clears cookie)       |
| POST   | `/api/auth/forgot-password` | Request reset link email      |
| POST   | `/api/auth/reset-password`  | Reset password with token     |
| GET    | `/api/auth/me`              | Current user profile          |

### Schools (`/api/schools/*`) — Super Admin Only

| Method | Endpoint                  | Purpose               |
| ------ | ------------------------- | --------------------- |
| POST   | `/api/schools`            | Create school         |
| GET    | `/api/schools`            | List schools          |
| GET    | `/api/schools/:id`        | School detail         |
| PATCH  | `/api/schools/:id/status` | Activate / deactivate |
| POST   | `/api/schools/:id/admins` | Create school admin   |

### School Admins (`/api/school-admins/*`) — Super Admin Only

| Method | Endpoint                        | Purpose                |
| ------ | ------------------------------- | ---------------------- |
| GET    | `/api/school-admins`            | List all school admins |
| PATCH  | `/api/school-admins/:id/status` | Toggle admin status    |
| DELETE | `/api/school-admins/:id`        | Delete school admin    |

### Departments (`/api/departments`) — School Admin Only

| Method | Endpoint           | Purpose              |
| ------ | ------------------ | -------------------- |
| POST   | `/api/departments` | Create department    |
| GET    | `/api/departments` | List own departments |

### Staff (`/api/staff/*`) — Mixed Access

| Method | Endpoint                         | Access | Purpose               |
| ------ | -------------------------------- | ------ | --------------------- |
| GET    | `/api/staff/me`                  | all    | Own profile           |
| PATCH  | `/api/staff/me`                  | all    | Update own profile    |
| PATCH  | `/api/staff/me/password`         | all    | Change own password   |
| PATCH  | `/api/staff/me/avatar`           | all    | Upload/replace avatar |
| GET    | `/api/staff/me/dashboard-stats`  | staff  | Dashboard statistics  |
| GET    | `/api/staff/me/schedule`         | staff  | Weekly schedule       |
| GET    | `/api/staff/me/attendance`       | staff  | Attendance records    |
| POST   | `/api/staff/me/attendance/clock` | staff  | Clock in/out          |
| GET    | `/api/staff/me/leaves`           | staff  | Own leave requests    |
| POST   | `/api/staff/me/leaves`           | staff  | Apply for leave       |
| GET    | `/api/staff/me/tasks`            | staff  | Assigned tasks        |
| PATCH  | `/api/staff/me/tasks/:id/status` | staff  | Update task status    |
| POST   | `/api/staff`                     | school | Register staff        |
| GET    | `/api/staff`                     | school | List own staff        |
| GET    | `/api/staff/:id`                 | school | Staff detail          |
| PATCH  | `/api/staff/:id/status`          | school | Enable/disable staff  |

### School Admin Management (`/api/school-admin/*`) — School Admin Only

| Method | Endpoint                          | Purpose               |
| ------ | --------------------------------- | --------------------- |
| POST   | `/api/school-admin/tasks`         | Assign task to staff  |
| GET    | `/api/school-admin/tasks`         | List all school tasks |
| DELETE | `/api/school-admin/tasks/:id`     | Delete a task         |
| GET    | `/api/school-admin/leaves`        | List staff leaves     |
| PATCH  | `/api/school-admin/leaves/:id`    | Approve/reject leave  |
| POST   | `/api/school-admin/schedules`     | Create schedule entry |
| GET    | `/api/school-admin/schedules`     | List all schedules    |
| DELETE | `/api/school-admin/schedules/:id` | Delete schedule entry |

> `super` = `super_admin`, `school` = `school_admin`. School-scoped routes derive `school_id` from the JWT — never from the request body.

---

## 🧪 Scripts

```bash
bun run dev          # start with nodemon
bun start            # start with node
bun run lint         # eslint
bun run lint:fix     # eslint --fix
bun run format       # prettier --write
bun run check-format # prettier --check
```
