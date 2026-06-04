---
name: unified-staff-table
description: All login users (super_admin, school_admin, staff) live in one staff table with role_id FK
metadata:
  type: project
---

Schema decision for School Management: **every login-capable user is a row in the `staff` table**, distinguished by `role_id` FK to a fixed `roles` table (`super_admin`, `school_admin`, `staff`).

- Super Admin → `school_id` NULL, `department_id` NULL (seeded once via seed.sql).
- School Admin → `school_id` set, `department_id` NULL.
- Staff → both `school_id` and `department_id` set.

Tenancy: school-scoped routes derive `school_id` from the JWT, never from the request body. Super admin creates schools + school admins; school admin creates departments + staff.

**Why:** User stated "admins will be staff table only" — single login path for everyone. Confirmed via AskUserQuestion.

**How to apply:** Don't create separate user/admin tables. See [[school-mgmt-stack]] and [[db-stored-procedures-only]].
