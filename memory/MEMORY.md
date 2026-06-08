# Memory Index

Project preferences and key decisions for the School Management System.

- [Uses Bun not npm](uses-bun-not-npm.md) — default to bun commands in this project, never npm
- [School Mgmt stack](school-mgmt-stack.md) — monorepo layout: React/Vite client + Express/MySQL server
- [DB stored procedures only](db-stored-procedures-only.md) — all DB access via MySQL stored procs, no inline SQL
- [Unified staff table](unified-staff-table.md) — all login users live in one staff table with role_id FK
- [Frontend guidelines](frontend-guidelines.md) — component-based, optimized, shadcn/ui, tailwind CSS, RTK Query
