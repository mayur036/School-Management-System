---
name: db-stored-procedures-only
description: All DB access in School Management goes through MySQL stored procedures, not inline SQL
metadata:
  type: project
---

In the School Management System, **all database reads/writes must go through MySQL stored procedures** (`sp_*`). The Node `models/` layer only calls procs via `pool.query('CALL sp_xxx(?)')` — no raw inline SQL in app code.

**Why:** User explicitly requested a stored-procedure-driven DB (built in MySQL Workbench).

**How to apply:** When building any data-access code, define/extend a stored procedure in `server/database/procedures.sql` and call it from a model wrapper. See [[school-mgmt-stack]].
