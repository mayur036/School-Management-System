# CampusCore (School Management System) - AI Agent Guidelines

This document provides instructions and context for GitHub Copilot Workspace, Copilot Agents, and other AI coding assistants interacting with this repository.

## 📌 Project Overview
CampusCore is a multi-tenant SaaS application designed to manage school operations, staff, and students.
The system supports multiple schools on the same database instance by using strict Tenant Guarding (`school_id`).

## 🛠️ Tech Stack
- **Frontend**: React (Vite), React Router, TailwindCSS, Shadcn UI, React Hook Form, Zod.
- **Backend**: Node.js, Express, MySQL.
- **Validation**: Zod (Shared identical schema rules on frontend & backend).

## 🏗️ Architecture & Coding Standards

### 1. Database & Models (CRITICAL)
- **NO RAW SQL QUERIES** are allowed anywhere in the Node.js application. 
- All database interactions MUST occur through **Stored Procedures** (`server/database/procedures.sql`).
- The `server/src/models/` files act purely as thin wrappers that invoke these procedures using `callProcedure` or `callProcedureOne` from `../utils/callProcedure.js`.

### 2. Tenant Isolation / Security (CRITICAL)
- **Never trust the client for tenant context.**
- Actions performed by School Admins or Staff must derive their context (`school_id`, `department_id`, `staff_id`) strictly from the verified JWT payload (`req.user`), NOT from `req.body` or URL parameters.
- Only the "Super Admin" role is permitted to specify a `school_id` explicitly in requests.

### 3. Backend Controllers
- Controllers reside in `server/src/controllers/`.
- All asynchronous route handlers must be wrapped in the `asyncHandler` utility.
- Responses must be sent using standard utility functions from `server/src/utils/apiResponse.js` (e.g., `ok(res, data, message)`, `created(res, data, message)`).
- Throw `ApiError` from `server/src/middleware/error.js` for exceptions.

### 4. Frontend Structure (Feature-Sliced Design)
- The React application resides in `client/`.
- Code is organized by domain features in `client/src/features/` (e.g., `super_admin/`, `school_admin/`).
- Components within a feature folder should be highly cohesive. Generic, reusable UI components belong in `client/src/components/`.
- API integration utilizes RTK Query / custom hooks grouped near their respective features.
- Strict enforcement of `zod` for all form validations. Make sure no fields are erroneously marked `.optional()` if they are required database columns.

### 5. UI/UX Aesthetics
- Use a **Premium Minimalist / Trust Blue** design language.
- Avoid generic, unstyled interfaces. Leverage Tailwind classes, Shadcn components, soft box-shadows, and micro-interactions (hover states, loaders) for a highly polished experience.

### 6. Linting & Formatting
- The project enforces ESLint and Prettier. Run `npm run format` and `npm run lint:fix` before finalizing commits.
