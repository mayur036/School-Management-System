---
name: school-mgmt-stack
description: School Management System tech stack and repo layout (monorepo: client + server + MySQL)
metadata:
  type: project
---

**School Management System** — multi-tenant app. Monorepo at `d:\School Management`:

- **client/** — React 19 + Vite + React Router v7 + Tailwind v4 + shadcn/ui + react-hook-form + zod + axios + sonner + recharts.
- **server/** — Node.js + Express (ESM, `"type": "module"`) + mysql2, JWT auth, bcrypt. Folders: controllers, services, models, routes, middleware, schema, config, utils, templates, docs. `server/database/` holds schema.sql, procedures.sql, seed.sql.
- **DB** — MySQL 8 via MySQL Workbench.

Package manager is Bun — see [[uses-bun-not-npm]]. Architecture & build phases documented in `PROJECT_PLAN.md`. Key decisions: [[db-stored-procedures-only]], [[unified-staff-table]].
