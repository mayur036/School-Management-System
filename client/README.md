# School Management System — Frontend

React single-page app for the School Management System. Provides the **Super Admin** and **School Admin** panels, with role-based routing and forms wired to the backend API.

> Part of the [School Management System](../README.md). See [PROJECT_PLAN.md](../PROJECT_PLAN.md) for the full design.

---

## 🧰 Tech stack

- **React 19 + Vite** — UI & dev tooling (with the React Compiler enabled)
- **React Router v7** — routing & role-based guards
- **Tailwind CSS v4 + shadcn/ui** — styling & components (radix-ui, lucide icons)
- **react-hook-form + zod** — forms & validation
- **axios** — API client
- **sonner** — toasts · **recharts** — dashboard charts

## 📁 Structure

```
client/src/
├─ app/           # route definitions / page entries
├─ components/
│  ├─ layouts/    # shells (super admin, school admin)
│  ├─ routes/     # route guards
│  ├─ shared/     # reusable composites
│  └─ ui/         # shadcn/ui primitives
├─ providers/     # context (auth, theme)
├─ hooks/         # custom hooks
├─ lib/           # axios instance, utils
├─ schemas/       # zod form schemas
├─ helper/        # helpers
├─ constant/      # constants
└─ assets/        # static assets
```

---

## 🚀 Setup

### Prerequisites

- Node.js 18+ (or Bun 1.x)
- Backend running (see [../server/README.md](../server/README.md))

### Install & configure

```bash
bun install
cp .env.example .env
```

Set the API base URL in `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

> Only `VITE_`-prefixed vars are exposed to the client — never put secrets here.

### Run

```bash
bun run dev       # start dev server (HMR)
bun run build     # production build → dist/
bun run preview   # preview the production build
```

---

## 🧭 App flow

1. **Login** → token stored, user redirected by role.
2. **Super Admin panel** → manage schools, create school admins.
3. **School Admin panel** → manage departments, register & list staff.

Routes are guarded by role; unauthorized users are redirected to login.

---

## 🧪 Scripts

```bash
bun run dev          # vite dev server
bun run build        # production build
bun run preview      # preview build
bun run lint         # eslint
bun run lint:fix     # eslint --fix
bun run format       # prettier --write
```
