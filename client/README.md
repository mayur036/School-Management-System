# School Management System — Frontend

React single-page app for the School Management System. Provides **Super Admin**, **School Admin**, and **Staff** panels with role-based routing, forms, dashboards, and real-time data via RTK Query.

> Part of the [School Management System](../README.md). See [PROJECT_PLAN.md](../PROJECT_PLAN.md) for the full design.

---

## 🧰 Tech stack

- **React 19 + Vite** — UI & dev tooling (with the React Compiler enabled)
- **React Router v7** — routing & role-based guards (`ProtectedRoute`, `GuestRoute`, `RoleRoute`)
- **Redux Toolkit + RTK Query** — state management & data fetching (custom axios `baseQuery`)
- **Tailwind CSS v4 + shadcn/ui** — styling & components (radix-ui, lucide icons, next-themes)
- **react-hook-form + zod** — forms & validation
- **axios** — API client (httpOnly cookie auth, no manual token headers)
- **sonner** — toasts · **recharts** — dashboard charts

## 📁 Structure

```
client/src/
├─ app/                    # Redux store + RTK Query baseApi
│  ├─ baseApi.js           # Custom axios baseQuery with tag types
│  └─ store.js             # configureStore (baseApi.reducer + authSlice)
├─ components/
│  ├─ layouts/             # Per-role shells (super_admin, school_admin, staff, shared)
│  │  ├─ super_admin/      # SA sidebar + header + layout
│  │  ├─ school_admin/     # SchA sidebar + header + layout
│  │  ├─ staff/            # Staff sidebar + header + layout
│  │  └─ shared/           # Shared layout utilities
│  ├─ routes/              # Route guards (ProtectedRoute, GuestRoute, RoleRoute)
│  ├─ shared/              # Reusable composites (StatCard, StatusBadge, EmptyTableState,
│  │                       #   AppBreadcrumb, AppPagination, PagePlaceholder)
│  └─ ui/                  # shadcn/ui primitives (Button, Card, Dialog, Table, etc.)
├─ features/
│  ├─ auth/                # Login, forgot/reset password (auth.api.js, authSlice.js)
│  ├─ guest/               # Home/landing page
│  ├─ profile/             # Profile view/edit, avatar, password (profile.api.js)
│  ├─ super_admin/         # Schools + School Admins (schools.api.js, schoolAdmins.api.js)
│  ├─ school_admin/        # Departments, Staff, Schedules, Leaves (departments.api.js, staff.api.js)
│  └─ staff/               # Staff portal: dashboard, schedule, attendance/leaves (staffActivity.api.js)
├─ hooks/                  # useAuth, useLogout, useDataTable, use-mobile
├─ lib/
│  ├─ icons/               # Centralized icon library (base, ui, superAdmin, schoolAdmin, staff)
│  ├─ axios.js             # Axios instance (withCredentials)
│  ├─ roles.js             # ROLES enum + roleHome() redirect mapping
│  └─ utils.js             # Shared utilities (cn, formatDate, etc.)
├─ providers/              # AppProviders (Redux store + theme + SessionBootstrap)
├─ schemas/                # Client-side Zod validation schemas
├─ pages/                  # Standalone pages (ErrorPage)
├─ helper/                 # FullScreenLoader, utility helpers
├─ constant/               # App-wide constants
├─ assets/                 # Static assets (images, logos)
├─ App.jsx                 # Router config with lazy-loaded pages
├─ main.jsx                # Entry point
└─ index.css               # Global styles + CSS custom properties (oklch tokens)
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
bun run dev       # start dev server (HMR, port 5173)
bun run build     # production build → dist/
bun run preview   # preview the production build
```

---

## 🧭 App flow

1. **Guest Routes** — Login, Forgot Password, Reset Password (redirects to home if already authenticated)
2. **Super Admin panel** (`/super/*`) — Dashboard, Schools, Admins, Profile
3. **School Admin panel** (`/school/*`) — Dashboard, Departments, Staff, Staff Registration, Schedules, Leaves, Profile
4. **Staff panel** (`/staff/*`) — Dashboard (clock in/out, stats), Schedule, Attendance & Leaves, Profile

Routes are guarded by role; unauthorized users are redirected to login. Each role has a dedicated sidebar + header layout.

### Key Pages

| Route                    | Role         | Page                                  |
| ------------------------ | ------------ | ------------------------------------- |
| `/super/dashboard`       | Super Admin  | Platform statistics + charts          |
| `/super/schools`         | Super Admin  | Schools list + create dialog          |
| `/super/admins`          | Super Admin  | School admins list + management       |
| `/school/dashboard`      | School Admin | School-level statistics               |
| `/school/departments`    | School Admin | Departments list + create             |
| `/school/staff`          | School Admin | Staff list + status toggle            |
| `/school/staff/register` | School Admin | Single/batch staff registration       |
| `/school/schedules`      | School Admin | Manage staff timetables               |
| `/school/leaves`         | School Admin | Review/approve staff leaves           |
| `/staff/dashboard`       | Staff        | Clock in/out, today's schedule, stats |
| `/staff/schedule`        | Staff        | Weekly timetable grid                 |
| `/staff/attendance`      | Staff        | Attendance log + leave requests       |
| `*/profile`              | All          | Profile view/edit, avatar, password   |

---

## 🔄 State Management

- **RTK Query** (`baseApi.js`): All API calls. Custom axios `baseQuery` with `withCredentials`.
- **Tag types**: `User`, `School`, `Department`, `Staff`, `SchoolAdmin`, `StaffSchedule`, `StaffAttendance`, `StaffLeave`
- **`authSlice`**: Holds `{ user, isAuthenticated }`. Updated by `getMe`/`login`/`logout`.
- **Feature APIs** inject endpoints into `baseApi` — no separate API slices.
- **Cache invalidation**: Every mutation uses `invalidatesTags` to auto-refetch related lists.

---

## 🧪 Scripts

```bash
bun run dev          # vite dev server
bun run build        # production build
bun run preview      # preview build
bun run lint         # eslint
bun run lint:fix     # eslint --fix
bun run format       # prettier --write
bun run check-format # prettier --check
```
