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

-- C. Insert Test School Admin (password: Mayur@23)
INSERT IGNORE INTO staff
  (staff_id, role_id, school_id, department_id, first_name, last_name,
   email, password_hash, phone, status)
SELECT
  2, r.role_id, 1, NULL, 'Mayur', 'Kapadi',
  'mayurkapadi23@gmail.com',
  '$2b$10$kPYRXvMaQgIUzT9vEBS/KOPKvtOkMcalw95hmbEwG.mSp1FNQ1IFu',
  '555-0233', 'active'
FROM roles r
WHERE r.role_name = 'school_admin';

-- D. Insert Test Staff Member (password: Mayur@12)
INSERT IGNORE INTO staff
  (staff_id, role_id, school_id, department_id, first_name, last_name,
   email, password_hash, phone, status, created_by)
SELECT
  3, r.role_id, 1, 1, 'Mayur', 'Kapadi',
  'mayurkapadi12@gmail.com',
  '$2b$10$kPYRXvMaQgIUzT9vEBS/KOPKvtOkMcalw95hmbEwG.mSp1FNQ1IFu',
  '6274941815', 'active', 2
FROM roles r
WHERE r.role_name = 'staff';

-- D2. Insert Test School Periods
INSERT IGNORE INTO school_periods (period_id, school_id, period_name, period_order, start_time, end_time, is_break)
VALUES
  (1, 1, 'Period 1', 1, '08:30:00', '09:30:00', FALSE),
  (2, 1, 'Period 2', 2, '09:30:00', '10:30:00', FALSE),
  (3, 1, 'Break', 3, '10:30:00', '11:00:00', TRUE),
  (4, 1, 'Period 3', 4, '11:00:00', '12:00:00', FALSE),
  (5, 1, 'Period 4', 5, '12:00:00', '13:00:00', FALSE),
  (6, 1, 'Lunch', 6, '13:00:00', '14:00:00', TRUE),
  (7, 1, 'Period 5', 7, '14:00:00', '15:00:00', FALSE);

-- E. Insert Test Staff Schedules
INSERT IGNORE INTO staff_schedules (schedule_id, staff_id, period_id, subject_name, class_name, day_of_week, room)
VALUES
  (1, 3, 1, 'Algebra II', 'Grade 10-A', 'Monday', 'Room 101'),
  (2, 3, 4, 'Calculus BC', 'Grade 12-B', 'Monday', 'Room 105'),
  (3, 3, 2, 'Geometry', 'Grade 9-C', 'Tuesday', 'Room 102'),
  (4, 3, 1, 'Algebra II', 'Grade 10-A', 'Wednesday', 'Room 101'),
  (5, 3, 4, 'Calculus BC', 'Grade 12-B', 'Wednesday', 'Room 105'),
  (6, 3, 2, 'Geometry', 'Grade 9-C', 'Thursday', 'Room 102');

-- F. Insert Test Staff Tasks
INSERT IGNORE INTO staff_tasks (task_id, staff_id, title, description, due_date, status, created_by)
VALUES
  (1, 3, 'Submit Math Syllabus', 'Upload final syllabus for Algebra and Geometry classes.', CURDATE() + INTERVAL 2 DAY, 'pending', 2),
  (2, 3, 'Grade Term Papers', 'Evaluate and record marks for Grade 12 Calculus papers.', CURDATE() - INTERVAL 1 DAY, 'in_progress', 2),
  (3, 3, 'Attend Faculty Meeting', 'Monthly department heads and staff assembly.', CURDATE() + INTERVAL 5 DAY, 'pending', 2);

-- G. Insert Test Leave Requests
INSERT IGNORE INTO leave_requests (leave_id, staff_id, leave_type, start_date, end_date, total_days, reason, status, reviewed_by, reviewed_at, comments)
VALUES
  (1, 3, 'Sick Leave', CURDATE() - INTERVAL 10 DAY, CURDATE() - INTERVAL 9 DAY, 2, 'Dental procedure and recovery.', 'approved', 2, NOW() - INTERVAL 10 DAY, 'Get well soon!'),
  (2, 3, 'Casual Leave', CURDATE() + INTERVAL 15 DAY, CURDATE() + INTERVAL 16 DAY, 2, 'Family gathering.', 'pending', NULL, NULL, NULL);

-- H. Insert Test Attendance Records
INSERT IGNORE INTO staff_attendance (attendance_id, staff_id, date, clock_in, clock_out, status)
VALUES
  (1, 3, CURDATE() - INTERVAL 3 DAY, '08:45:00', '16:00:00', 'present'),
  (2, 3, CURDATE() - INTERVAL 2 DAY, '09:20:00', '16:05:00', 'late'),
  (3, 3, CURDATE() - INTERVAL 1 DAY, '08:50:00', '15:55:00', 'present');

-- ============================================================
-- Test Stored Procedure Calls (for Manual Verification)
-- ============================================================
-- Note: You can run these in MySQL Workbench to test the attendance flow.

-- 1. Test Clock In (Staff 3 clocks in today at 8:30 AM - should be 'present')
-- CALL sp_clock_in_out(3, CURDATE(), '08:30:00');

-- 2. Test Clock Out (Staff 3 clocks out today at 10:30 AM - worked 2 hours, should update status to 'half_day')
-- CALL sp_clock_in_out(3, CURDATE(), '10:30:00');

-- 3. Test Clock In/Out on another day with full shift (worked 8 hours - should keep status 'present' or 'late')
-- CALL sp_clock_in_out(3, CURDATE() - INTERVAL 3 DAY, '09:00:00');
-- CALL sp_clock_in_out(3, CURDATE() - INTERVAL 3 DAY, '12:00:00');

-- 4. Test Fetch Attendance History (includes work_duration)
-- CALL sp_get_staff_attendance(3, CURDATE() - INTERVAL 5 DAY, CURDATE());

-- 5. Test Fetch Dashboard Stats (includes total_work_hours)
-- CALL sp_get_staff_dashboard_stats(3);

-- Delete all attendance records for staff_id 3
-- DELETE FROM staff_attendance WHERE attendance_id = 1;