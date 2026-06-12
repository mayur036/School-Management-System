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

-- 3. Optional Test Data ---------------------------------------
-- Useful for testing the staff and school admin features immediately.

-- A. Insert Test School
INSERT IGNORE INTO schools (school_id, name, code, email, phone, address, status)
VALUES (1, 'Greenwood High School', 'GWOOD', 'contact@greenwood.edu', '555-0199', '123 Academic Way', 'active');

-- B. Insert Test Departments
INSERT IGNORE INTO departments (department_id, school_id, name, status)
VALUES
  (1, 1, 'Mathematics', 'active'),
  (2, 1, 'Science', 'active');

-- C. Insert Test School Admin (password: Admin@123)
INSERT IGNORE INTO staff
  (staff_id, role_id, school_id, department_id, first_name, last_name,
   email, password_hash, phone, status)
SELECT
  2, r.role_id, 1, NULL, 'Sarah', 'Conner',
  'schooladmin@greenwood.edu',
  '$2b$10$kPYRXvMaQgIUzT9vEBS/KOPKvtOkMcalw95hmbEwG.mSp1FNQ1IFu',
  '555-0233', 'active'
FROM roles r
WHERE r.role_name = 'school_admin';

-- D. Insert Test Staff Member (password: Admin@123)
INSERT IGNORE INTO staff
  (staff_id, role_id, school_id, department_id, first_name, last_name,
   email, password_hash, phone, status, created_by)
SELECT
  3, r.role_id, 1, 1, 'John', 'Doe',
  'staff@greenwood.edu',
  '$2b$10$kPYRXvMaQgIUzT9vEBS/KOPKvtOkMcalw95hmbEwG.mSp1FNQ1IFu',
  '555-0244', 'active', 2
FROM roles r
WHERE r.role_name = 'staff';

-- E. Insert Test Staff Schedules
INSERT IGNORE INTO staff_schedules (schedule_id, staff_id, subject_name, class_name, day_of_week, start_time, end_time, room)
VALUES
  (1, 3, 'Algebra II', 'Grade 10-A', 'Monday', '08:30:00', '09:30:00', 'Room 101'),
  (2, 3, 'Calculus BC', 'Grade 12-B', 'Monday', '10:00:00', '11:30:00', 'Room 105'),
  (3, 3, 'Geometry', 'Grade 9-C', 'Tuesday', '09:00:00', '10:00:00', 'Room 102'),
  (4, 3, 'Algebra II', 'Grade 10-A', 'Wednesday', '08:30:00', '09:30:00', 'Room 101'),
  (5, 3, 'Calculus BC', 'Grade 12-B', 'Wednesday', '10:00:00', '11:30:00', 'Room 105'),
  (6, 3, 'Geometry', 'Grade 9-C', 'Thursday', '09:00:00', '10:00:00', 'Room 102');

-- F. Insert Test Staff Tasks
INSERT IGNORE INTO staff_tasks (task_id, staff_id, title, description, due_date, status, created_by)
VALUES
  (1, 3, 'Submit Math Syllabus', 'Upload final syllabus for Algebra and Geometry classes.', CURDATE() + INTERVAL 2 DAY, 'pending', 2),
  (2, 3, 'Grade Term Papers', 'Evaluate and record marks for Grade 12 Calculus papers.', CURDATE() - INTERVAL 1 DAY, 'in_progress', 2),
  (3, 3, 'Attend Faculty Meeting', 'Monthly department heads and staff assembly.', CURDATE() + INTERVAL 5 DAY, 'pending', 2);

-- G. Insert Test Leave Requests
INSERT IGNORE INTO leave_requests (leave_id, staff_id, leave_type, start_date, end_date, total_days, reason, status, reviewed_by, reviewed_at, comments)
VALUES
  (1, 6, 'Sick Leave', CURDATE() - INTERVAL 10 DAY, CURDATE() - INTERVAL 9 DAY, 2, 'Dental procedure and recovery.', 'approved', 2, NOW() - INTERVAL 10 DAY, 'Get well soon!'),
  (2, 6, 'Casual Leave', CURDATE() + INTERVAL 15 DAY, CURDATE() + INTERVAL 16 DAY, 2, 'Family gathering.', 'pending', NULL, NULL, NULL);

-- H. Insert Test Attendance Records
INSERT IGNORE INTO staff_attendance (attendance_id, staff_id, date, clock_in, clock_out, status)
VALUES
  (1, 6, CURDATE() - INTERVAL 3 DAY, '08:45:00', '16:00:00', 'present'),
  (2, 6, CURDATE() - INTERVAL 2 DAY, '09:20:00', '16:05:00', 'late'),
  (3, 6, CURDATE() - INTERVAL 1 DAY, '08:50:00', '15:55:00', 'present');

