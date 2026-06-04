-- ============================================================
-- School Management System — Seed Data
-- Run AFTER schema.sql and procedures.sql.
--
-- Seeds:
--   1. The 3 fixed roles
--   2. The first Super Admin (the only user not created via the app)
--
-- Super Admin login:
--   email    : superadmin@sms.com
--   password : Admin@123        <-- change after first login
-- ============================================================

USE school_management_system;

-- 1. Roles ----------------------------------------------------
CALL sp_seed_roles();

-- 2. Super Admin ----------------------------------------------
-- school_id / department_id are NULL for the super admin.
-- password_hash is a bcrypt hash of 'Admin@123'.
-- INSERT IGNORE keeps this idempotent (email is UNIQUE).
INSERT IGNORE INTO staff
  (role_id, school_id, department_id, first_name, last_name,
   email, password_hash, phone, status)
SELECT
  r.role_id, NULL, NULL, 'Super', 'Admin',
  'superadmin@sms.com',
  '$2b$10$kPYRXvMaQgIUzT9vEBS/KOPKvtOkMcalw95hmbEwG.mSp1FNQ1IFu',
  NULL, 'active'
FROM roles r
WHERE r.role_name = 'super_admin';

-- Verify
SELECT staff_id, first_name, email, status
FROM staff
WHERE email = 'superadmin@sms.com';
