-- ============================================================
-- School Management System — Stored Procedures
-- Run AFTER schema.sql. Run this whole file in MySQL Workbench.
-- All app DB access goes through these procedures.
-- ============================================================

USE school_management_system;

DELIMITER $$

-- ------------------------------------------------------------
-- sp_seed_roles : insert the 3 fixed roles (idempotent)
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_seed_roles $$
CREATE PROCEDURE sp_seed_roles()
BEGIN
  INSERT IGNORE INTO roles (role_name) VALUES
    ('super_admin'),
    ('school_admin'),
    ('staff');
END $$

-- ------------------------------------------------------------
-- sp_login_get_user : fetch a user + role_name by email (for auth)
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_login_get_user $$
CREATE PROCEDURE sp_login_get_user(IN p_email VARCHAR(150))
BEGIN
  SELECT
    s.staff_id, s.role_id, r.role_name, s.school_id, sch.name AS school_name,sch.status AS school_status, s.department_id,
    s.first_name, s.last_name, s.email, s.password_hash, s.phone,
    s.avatar_url, s.status
  FROM staff s
  JOIN roles r ON r.role_id = s.role_id
  LEFT JOIN schools sch ON sch.school_id = s.school_id
  WHERE s.email = p_email
  LIMIT 1;
END $$

-- ============================================================
-- SCHOOLS  (super admin)
-- ============================================================

-- sp_create_school : insert a school, return the created row
DROP PROCEDURE IF EXISTS sp_create_school $$
CREATE PROCEDURE sp_create_school(
  IN p_name       VARCHAR(150),
  IN p_code       VARCHAR(30),
  IN p_email      VARCHAR(150),
  IN p_phone      VARCHAR(20),
  IN p_address    VARCHAR(255),
  IN p_created_by INT
)
BEGIN
  INSERT INTO schools (name, code, email, phone, address, created_by)
  VALUES (p_name, p_code, p_email, p_phone, p_address, p_created_by);

  SELECT * FROM schools WHERE school_id = LAST_INSERT_ID();
END $$

-- sp_list_schools : all schools (newest first)
DROP PROCEDURE IF EXISTS sp_list_schools $$
CREATE PROCEDURE sp_list_schools()
BEGIN
  SELECT * FROM schools ORDER BY created_at DESC;
END $$

-- sp_get_school : single school by id
DROP PROCEDURE IF EXISTS sp_get_school $$
CREATE PROCEDURE sp_get_school(IN p_school_id INT)
BEGIN
  SELECT * FROM schools WHERE school_id = p_school_id;
END $$

-- sp_get_school_by_email : single school by email
DROP PROCEDURE IF EXISTS sp_get_school_by_email $$
CREATE PROCEDURE sp_get_school_by_email(IN p_email VARCHAR(150))
BEGIN
  SELECT * FROM schools WHERE email = p_email LIMIT 1;
END $$

-- sp_update_school_status : activate / deactivate
DROP PROCEDURE IF EXISTS sp_update_school_status $$
CREATE PROCEDURE sp_update_school_status(
  IN p_school_id INT,
  IN p_status    ENUM('active','inactive')
)
BEGIN
  UPDATE schools SET status = p_status WHERE school_id = p_school_id;
  SELECT * FROM schools WHERE school_id = p_school_id;
END $$

-- ============================================================
-- SCHOOL ADMINS  (super admin creates them in the staff table)
-- ============================================================

-- sp_create_school_admin : insert a school_admin staff row
DROP PROCEDURE IF EXISTS sp_create_school_admin $$
CREATE PROCEDURE sp_create_school_admin(
  IN p_school_id     INT,
  IN p_first_name    VARCHAR(80),
  IN p_last_name     VARCHAR(80),
  IN p_email         VARCHAR(150),
  IN p_password_hash VARCHAR(255),
  IN p_phone         VARCHAR(20),
  IN p_created_by    INT
)
BEGIN
  DECLARE v_role_id INT;
  SELECT role_id INTO v_role_id FROM roles WHERE role_name = 'school_admin';

  INSERT INTO staff
    (role_id, school_id, department_id, first_name, last_name,
     email, password_hash, phone, created_by)
  VALUES
    (v_role_id, p_school_id, NULL, p_first_name, p_last_name,
     p_email, p_password_hash, p_phone, p_created_by);

  SELECT
    s.staff_id, s.role_id, r.role_name, s.school_id, sch.name AS school_name, s.department_id,
    s.first_name, s.last_name, s.email, s.phone, s.avatar_url,
    s.status, s.created_at
  FROM staff s
  JOIN roles r ON r.role_id = s.role_id
  LEFT JOIN schools sch ON sch.school_id = s.school_id
  WHERE s.staff_id = LAST_INSERT_ID();
END $$

-- sp_list_all_school_admins : list all admins globally with their school info
DROP PROCEDURE IF EXISTS sp_list_all_school_admins $$
CREATE PROCEDURE sp_list_all_school_admins()
BEGIN
  SELECT
    s.staff_id, s.role_id, r.role_name, s.school_id, sch.name AS school_name, s.department_id,
    s.first_name, s.last_name, s.email, s.phone, s.avatar_url,
    s.status, s.created_at
  FROM staff s
  JOIN roles r ON r.role_id = s.role_id
  LEFT JOIN schools sch ON sch.school_id = s.school_id
  WHERE r.role_name = 'school_admin'
  ORDER BY s.created_at DESC;
END $$

-- sp_delete_school_admin : permanently delete a school admin
DROP PROCEDURE IF EXISTS sp_delete_school_admin $$
CREATE PROCEDURE sp_delete_school_admin(
  IN p_staff_id INT
)
BEGIN
  DELETE s
  FROM staff s
  JOIN roles r ON r.role_id = s.role_id
  WHERE s.staff_id = p_staff_id AND r.role_name = 'school_admin';
END $$

-- ============================================================
-- DEPARTMENTS  (school admin, scoped to their school)
-- ============================================================

-- sp_create_department : add a department to a school
DROP PROCEDURE IF EXISTS sp_create_department $$
CREATE PROCEDURE sp_create_department(
  IN p_school_id INT,
  IN p_name      VARCHAR(100)
)
BEGIN
  INSERT INTO departments (school_id, name)
  VALUES (p_school_id, p_name);

  SELECT * FROM departments WHERE department_id = LAST_INSERT_ID();
END $$

-- sp_list_departments : departments of one school
DROP PROCEDURE IF EXISTS sp_list_departments $$
CREATE PROCEDURE sp_list_departments(IN p_school_id INT)
BEGIN
  SELECT * FROM departments
  WHERE school_id = p_school_id
  ORDER BY name ASC;
END $$

-- ============================================================
-- STAFF  (school admin registers department staff)
-- ============================================================

-- sp_create_staff : insert a 'staff' role member for a school + dept
DROP PROCEDURE IF EXISTS sp_create_staff $$
CREATE PROCEDURE sp_create_staff(
  IN p_school_id     INT,
  IN p_department_id INT,
  IN p_first_name    VARCHAR(80),
  IN p_last_name     VARCHAR(80),
  IN p_email         VARCHAR(150),
  IN p_password_hash VARCHAR(255),
  IN p_phone         VARCHAR(20),
  IN p_created_by    INT
)
BEGIN
  DECLARE v_role_id INT;
  SELECT role_id INTO v_role_id FROM roles WHERE role_name = 'staff';

  INSERT INTO staff
    (role_id, school_id, department_id, first_name, last_name,
     email, password_hash, phone, created_by)
  VALUES
    (v_role_id, p_school_id, p_department_id, p_first_name, p_last_name,
     p_email, p_password_hash, p_phone, p_created_by);

  SELECT
    s.staff_id, s.role_id, r.role_name, s.school_id, sch.name AS school_name, s.department_id,
    d.name AS department_name, s.first_name, s.last_name, s.email,
    s.phone, s.avatar_url, s.status, s.created_at
  FROM staff s
  JOIN roles r ON r.role_id = s.role_id
  LEFT JOIN departments d ON d.department_id = s.department_id
  LEFT JOIN schools sch ON sch.school_id = s.school_id
  WHERE s.staff_id = LAST_INSERT_ID();
END $$

-- sp_list_staff : all staff of one school (with role + department names)
DROP PROCEDURE IF EXISTS sp_list_staff $$
CREATE PROCEDURE sp_list_staff(IN p_school_id INT)
BEGIN
  SELECT
    s.staff_id, s.role_id, r.role_name, s.school_id, sch.name AS school_name,sch.status AS school_status, s.department_id,
    d.name AS department_name, s.first_name, s.last_name, s.email,
    s.phone, s.avatar_url, s.status, s.created_at
  FROM staff s
  JOIN roles r ON r.role_id = s.role_id
  LEFT JOIN departments d ON d.department_id = s.department_id
  LEFT JOIN schools sch ON sch.school_id = s.school_id
  WHERE s.school_id = p_school_id
  ORDER BY s.created_at DESC;
END $$

-- sp_get_staff : single staff member (own profile / detail)
DROP PROCEDURE IF EXISTS sp_get_staff $$
CREATE PROCEDURE sp_get_staff(IN p_staff_id INT)
BEGIN
  SELECT
    s.staff_id, s.role_id, r.role_name, s.school_id, sch.name AS school_name, sch.status AS school_status, s.department_id,
    d.name AS department_name, s.first_name, s.last_name, s.email,
    s.phone, s.avatar_url, s.avatar_public_id, s.status,
    s.created_at, s.updated_at
  FROM staff s
  JOIN roles r ON r.role_id = s.role_id
  LEFT JOIN departments d ON d.department_id = s.department_id
  LEFT JOIN schools sch ON sch.school_id = s.school_id
  WHERE s.staff_id = p_staff_id;
END $$

-- sp_update_staff_status : enable / disable a staff member
DROP PROCEDURE IF EXISTS sp_update_staff_status $$
CREATE PROCEDURE sp_update_staff_status(
  IN p_staff_id INT,
  IN p_status   ENUM('active','inactive')
)
BEGIN
  UPDATE staff SET status = p_status WHERE staff_id = p_staff_id;

  SELECT
    s.staff_id, s.role_id, r.role_name, s.school_id, sch.name AS school_name, s.department_id,
    d.name AS department_name, s.first_name, s.last_name, s.email,
    s.phone, s.avatar_url, s.status, s.created_at, s.updated_at
  FROM staff s
  JOIN roles r ON r.role_id = s.role_id
  LEFT JOIN departments d ON d.department_id = s.department_id
  LEFT JOIN schools sch ON sch.school_id = s.school_id
  WHERE s.staff_id = p_staff_id;
END $$

-- sp_update_password : change a user's own password (hash computed in app layer)
DROP PROCEDURE IF EXISTS sp_update_password $$
CREATE PROCEDURE sp_update_password(
  IN p_staff_id      INT,
  IN p_password_hash VARCHAR(255)
)
BEGIN
  UPDATE staff
  SET password_hash = p_password_hash,
      updated_at    = CURRENT_TIMESTAMP
  WHERE staff_id = p_staff_id;
END $$

-- sp_update_avatar : set a user's avatar URL + Cloudinary public_id, return the row
DROP PROCEDURE IF EXISTS sp_update_avatar $$
CREATE PROCEDURE sp_update_avatar(
  IN p_staff_id         INT,
  IN p_avatar_url       VARCHAR(255),
  IN p_avatar_public_id VARCHAR(255)
)
BEGIN
  UPDATE staff
  SET avatar_url       = p_avatar_url,
      avatar_public_id = p_avatar_public_id,
      updated_at       = CURRENT_TIMESTAMP
  WHERE staff_id = p_staff_id;

  SELECT
    s.staff_id, s.role_id, r.role_name, s.school_id, sch.name AS school_name, s.department_id,
    d.name AS department_name, s.first_name, s.last_name, s.email,
    s.phone, s.avatar_url, s.status, s.created_at, s.updated_at
  FROM staff s
  JOIN roles r ON r.role_id = s.role_id
  LEFT JOIN departments d ON d.department_id = s.department_id
  LEFT JOIN schools sch ON sch.school_id = s.school_id
  WHERE s.staff_id = p_staff_id;
END $$

-- ------------------------------------------------------------
-- sp_update_profile : update first_name, last_name, and phone for a user
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_update_profile $$
CREATE PROCEDURE sp_update_profile(
  IN p_staff_id   INT,
  IN p_first_name  VARCHAR(80),
  IN p_last_name   VARCHAR(80),
  IN p_phone       VARCHAR(20)
)
BEGIN
  UPDATE staff
  SET first_name = p_first_name,
      last_name  = p_last_name,
      phone      = p_phone,
      updated_at = CURRENT_TIMESTAMP
  WHERE staff_id = p_staff_id;

  SELECT
    s.staff_id, s.role_id, r.role_name, s.school_id, sch.name AS school_name, s.department_id,
    d.name AS department_name, s.first_name, s.last_name, s.email,
    s.phone, s.avatar_url, s.status, s.created_at, s.updated_at
  FROM staff s
  JOIN roles r ON r.role_id = s.role_id
  LEFT JOIN departments d ON d.department_id = s.department_id
  LEFT JOIN schools sch ON sch.school_id = s.school_id
  WHERE s.staff_id = p_staff_id;
END $$

-- ------------------------------------------------------------
-- sp_set_reset_token : save password reset token and expiry
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_set_reset_token $$
CREATE PROCEDURE sp_set_reset_token(
  IN p_email VARCHAR(150),
  IN p_token VARCHAR(255),
  IN p_expiry DATETIME
)
BEGIN
  UPDATE staff
  SET reset_token = p_token,
      reset_token_expiry = p_expiry
  WHERE email = p_email AND status = 'active';
END $$

-- ------------------------------------------------------------
-- sp_get_user_by_reset_token : find active user by reset token
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_get_user_by_reset_token $$
CREATE PROCEDURE sp_get_user_by_reset_token(
  IN p_token VARCHAR(255)
)
BEGIN
  SELECT
    s.staff_id, s.role_id, r.role_name, s.school_id, s.department_id,
    s.first_name, s.last_name, s.email, s.status, s.reset_token_expiry
  FROM staff s
  JOIN roles r ON r.role_id = s.role_id
  WHERE s.reset_token = p_token AND s.status = 'active'
  LIMIT 1;
END $$

-- ------------------------------------------------------------
-- sp_reset_password_by_token : update password and clear reset token details
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_reset_password_by_token $$
CREATE PROCEDURE sp_reset_password_by_token(
  IN p_token VARCHAR(255),
  IN p_password_hash VARCHAR(255)
)
BEGIN
  UPDATE staff
  SET password_hash = p_password_hash,
      reset_token = NULL,
      reset_token_expiry = NULL,
      updated_at = CURRENT_TIMESTAMP
  WHERE reset_token = p_token AND status = 'active';
END $$

-- ============================================================
-- STAFF PORTAL & ACTIVITIES (staff role)
-- ============================================================

-- sp_get_staff_dashboard_stats : get dashboard metrics for staff
-- Updated to join school_periods for today_classes count
DROP PROCEDURE IF EXISTS sp_get_staff_dashboard_stats $$
CREATE PROCEDURE sp_get_staff_dashboard_stats(IN p_staff_id INT)
BEGIN
  DECLARE v_today_classes INT DEFAULT 0;
  DECLARE v_pending_tasks INT DEFAULT 0;
  DECLARE v_present_days INT DEFAULT 0;
  DECLARE v_leave_days INT DEFAULT 0;
  DECLARE v_total_work_seconds INT DEFAULT 0;

  SELECT COUNT(*) INTO v_today_classes
  FROM staff_schedules ss
  JOIN school_periods sp ON sp.period_id = ss.period_id
  WHERE ss.staff_id = p_staff_id
    AND ss.day_of_week = DAYNAME(CURDATE())
    AND sp.is_break = FALSE;

  SELECT COUNT(*) INTO v_pending_tasks
  FROM staff_tasks
  WHERE staff_id = p_staff_id AND status != 'completed';

  SELECT COUNT(*) INTO v_present_days
  FROM staff_attendance
  WHERE staff_id = p_staff_id AND status IN ('present', 'late', 'half_day')
    AND MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE());

  SELECT COALESCE(SUM(total_days), 0) INTO v_leave_days
  FROM leave_requests
  WHERE staff_id = p_staff_id AND status = 'approved'
    AND (MONTH(start_date) = MONTH(CURDATE()) OR MONTH(end_date) = MONTH(CURDATE()));

  SELECT COALESCE(SUM(TIME_TO_SEC(TIMEDIFF(clock_out, clock_in))), 0) INTO v_total_work_seconds
  FROM staff_attendance
  WHERE staff_id = p_staff_id
    AND MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE());

  SELECT
    v_today_classes AS today_classes,
    v_pending_tasks AS pending_tasks,
    v_present_days AS present_days,
    v_leave_days AS leave_days,
    ROUND(v_total_work_seconds / 3600, 1) AS total_work_hours;
END $$

-- sp_get_staff_schedule : get staff weekly schedule with period info
DROP PROCEDURE IF EXISTS sp_get_staff_schedule $$
CREATE PROCEDURE sp_get_staff_schedule(IN p_staff_id INT)
BEGIN
  SELECT
    ss.schedule_id, ss.staff_id, ss.period_id, ss.subject_name,
    ss.class_name, ss.day_of_week, ss.room,
    sp.period_name, sp.start_time, sp.end_time, sp.period_order, sp.is_break
  FROM staff_schedules ss
  JOIN school_periods sp ON sp.period_id = ss.period_id
  WHERE ss.staff_id = p_staff_id
  ORDER BY
    CASE ss.day_of_week
      WHEN 'Monday' THEN 1
      WHEN 'Tuesday' THEN 2
      WHEN 'Wednesday' THEN 3
      WHEN 'Thursday' THEN 4
      WHEN 'Friday' THEN 5
      WHEN 'Saturday' THEN 6
      WHEN 'Sunday' THEN 7
    END,
    sp.period_order;
END $$

-- sp_get_staff_attendance : list attendance logs in range
DROP PROCEDURE IF EXISTS sp_get_staff_attendance $$
CREATE PROCEDURE sp_get_staff_attendance(
  IN p_staff_id   INT,
  IN p_start_date DATE,
  IN p_end_date   DATE
)
BEGIN
  SELECT *,
         TIMEDIFF(clock_out, clock_in) AS work_duration
  FROM staff_attendance
  WHERE staff_id = p_staff_id
    AND date BETWEEN p_start_date AND p_end_date
  ORDER BY date DESC;
END $$

-- sp_clock_in_out : handle clock-in/out logic
DROP PROCEDURE IF EXISTS sp_clock_in_out $$
CREATE PROCEDURE sp_clock_in_out(
  IN p_staff_id INT,
  IN p_date     DATE,
  IN p_time     TIME
)
BEGIN
  DECLARE v_exists INT;
  DECLARE v_clock_out TIME;
  DECLARE v_clock_in TIME;

  SELECT COUNT(*), MAX(clock_out), MAX(clock_in) INTO v_exists, v_clock_out, v_clock_in
  FROM staff_attendance
  WHERE staff_id = p_staff_id AND date = p_date;

  IF v_exists = 0 THEN
    -- First clock-in of the day. Status is late if clocking in after 10:30 AM
    INSERT INTO staff_attendance (staff_id, date, clock_in, clock_out, status)
    VALUES (
      p_staff_id,
      p_date,
      p_time,
      NULL,
      IF(p_time > '10:30:00', 'late', 'present')
    );
  ELSEIF v_clock_out IS NULL THEN
    -- Clock out. Status becomes half_day if total hours worked < 4 hours (14400 seconds)
    UPDATE staff_attendance
    SET clock_out = p_time,
        status = IF(TIME_TO_SEC(TIMEDIFF(p_time, v_clock_in)) < 14400, 'half_day', status)
    WHERE staff_id = p_staff_id AND date = p_date;
  END IF;

  SELECT * FROM staff_attendance
  WHERE staff_id = p_staff_id AND date = p_date;
END $$

-- sp_create_leave_request : submit new leave request
DROP PROCEDURE IF EXISTS sp_create_leave_request $$
CREATE PROCEDURE sp_create_leave_request(
  IN p_staff_id   INT,
  IN p_leave_type VARCHAR(50),
  IN p_start_date DATE,
  IN p_end_date   DATE,
  IN p_reason     TEXT
)
BEGIN
  IF p_start_date <= CURDATE() THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Validation error: Leave requests must be submitted at least 1 day in advance (tomorrow or later).';
  ELSEIF p_end_date < p_start_date THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Validation error: End date must be on or after start date.';
  END IF;

  INSERT INTO leave_requests (staff_id, leave_type, start_date, end_date, total_days, reason, status)
  VALUES (p_staff_id, p_leave_type, p_start_date, p_end_date, DATEDIFF(p_end_date, p_start_date) + 1, p_reason, 'pending');

  SELECT * FROM leave_requests WHERE leave_id = LAST_INSERT_ID();
END $$

-- sp_get_staff_leaves : view own leave history
DROP PROCEDURE IF EXISTS sp_get_staff_leaves $$
CREATE PROCEDURE sp_get_staff_leaves(IN p_staff_id INT)
BEGIN
  SELECT l.*,
         CONCAT(r.first_name, ' ', r.last_name) AS reviewer_name
  FROM leave_requests l
  LEFT JOIN staff r ON r.staff_id = l.reviewed_by
  WHERE l.staff_id = p_staff_id
  ORDER BY l.created_at DESC;
END $$

-- sp_get_staff_tasks : list assigned tasks
DROP PROCEDURE IF EXISTS sp_get_staff_tasks $$
CREATE PROCEDURE sp_get_staff_tasks(IN p_staff_id INT)
BEGIN
  SELECT t.*,
         CONCAT(c.first_name, ' ', c.last_name) AS creator_name
  FROM staff_tasks t
  JOIN staff c ON c.staff_id = t.created_by
  WHERE t.staff_id = p_staff_id
  ORDER BY t.status = 'completed', t.due_date ASC, t.created_at DESC;
END $$

-- sp_update_task_status : set task completion status
DROP PROCEDURE IF EXISTS sp_update_task_status $$
CREATE PROCEDURE sp_update_task_status(
  IN p_task_id  INT,
  IN p_staff_id INT,
  IN p_status   ENUM('pending', 'in_progress', 'completed')
)
BEGIN
  UPDATE staff_tasks
  SET status = p_status
  WHERE task_id = p_task_id AND staff_id = p_staff_id;

  SELECT * FROM staff_tasks WHERE task_id = p_task_id AND staff_id = p_staff_id;
END $$


-- ============================================================
-- SCHOOL PERIODS (school admin manages bell schedule)
-- ============================================================

-- sp_create_school_period : add a period to a school's bell schedule
DROP PROCEDURE IF EXISTS sp_create_school_period $$
CREATE PROCEDURE sp_create_school_period(
  IN p_school_id    INT,
  IN p_period_name  VARCHAR(50),
  IN p_period_order SMALLINT,
  IN p_start_time   TIME,
  IN p_end_time     TIME,
  IN p_is_break     BOOLEAN
)
BEGIN
  IF p_end_time <= p_start_time THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Validation error: End time must be after start time.';
  END IF;

  INSERT INTO school_periods (school_id, period_name, period_order, start_time, end_time, is_break)
  VALUES (p_school_id, p_period_name, p_period_order, p_start_time, p_end_time, p_is_break);

  SELECT * FROM school_periods WHERE period_id = LAST_INSERT_ID();
END $$

-- sp_list_school_periods : list all periods of a school in order
DROP PROCEDURE IF EXISTS sp_list_school_periods $$
CREATE PROCEDURE sp_list_school_periods(IN p_school_id INT)
BEGIN
  SELECT * FROM school_periods
  WHERE school_id = p_school_id
  ORDER BY period_order ASC;
END $$

-- sp_update_school_period : edit a period
DROP PROCEDURE IF EXISTS sp_update_school_period $$
CREATE PROCEDURE sp_update_school_period(
  IN p_period_id    INT,
  IN p_school_id    INT,
  IN p_period_name  VARCHAR(50),
  IN p_period_order SMALLINT,
  IN p_start_time   TIME,
  IN p_end_time     TIME,
  IN p_is_break     BOOLEAN
)
BEGIN
  DECLARE v_period_school INT;

  IF p_end_time <= p_start_time THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Validation error: End time must be after start time.';
  END IF;

  SELECT school_id INTO v_period_school
  FROM school_periods WHERE period_id = p_period_id;

  IF v_period_school != p_school_id THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Tenancy violation: Period does not belong to this school.';
  END IF;

  UPDATE school_periods
  SET period_name  = p_period_name,
      period_order = p_period_order,
      start_time   = p_start_time,
      end_time     = p_end_time,
      is_break     = p_is_break
  WHERE period_id = p_period_id;

  SELECT * FROM school_periods WHERE period_id = p_period_id;
END $$

-- sp_delete_school_period : delete a period (fails if schedules reference it)
DROP PROCEDURE IF EXISTS sp_delete_school_period $$
CREATE PROCEDURE sp_delete_school_period(
  IN p_period_id  INT,
  IN p_school_id  INT
)
BEGIN
  DECLARE v_period_school INT;
  DECLARE v_schedule_count INT;

  SELECT school_id INTO v_period_school
  FROM school_periods WHERE period_id = p_period_id;

  IF v_period_school IS NULL OR v_period_school != p_school_id THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Tenancy violation: Period does not belong to this school.';
  END IF;

  SELECT COUNT(*) INTO v_schedule_count
  FROM staff_schedules WHERE period_id = p_period_id;

  IF v_schedule_count > 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Cannot delete period: it is referenced by existing schedule entries. Remove those entries first.';
  END IF;

  DELETE FROM school_periods WHERE period_id = p_period_id;
END $$

-- ============================================================
-- SCHOOL SETTINGS (working days)
-- ============================================================

-- sp_update_working_days : set working days for a school
DROP PROCEDURE IF EXISTS sp_update_working_days $$
CREATE PROCEDURE sp_update_working_days(
  IN p_school_id    INT,
  IN p_working_days VARCHAR(255)
)
BEGIN
  UPDATE schools
  SET working_days = p_working_days
  WHERE school_id = p_school_id;

  SELECT working_days FROM schools WHERE school_id = p_school_id;
END $$

-- sp_get_school_settings : get school-level timetable settings
DROP PROCEDURE IF EXISTS sp_get_school_settings $$
CREATE PROCEDURE sp_get_school_settings(IN p_school_id INT)
BEGIN
  SELECT school_id, working_days FROM schools WHERE school_id = p_school_id;
END $$

-- sp_update_school : update operational details for a school
DROP PROCEDURE IF EXISTS sp_update_school $$
CREATE PROCEDURE sp_update_school(
  IN p_school_id INT,
  IN p_name      VARCHAR(150),
  IN p_email     VARCHAR(150),
  IN p_phone     VARCHAR(20),
  IN p_address   VARCHAR(255)
)
BEGIN
  UPDATE schools
  SET
    name = COALESCE(p_name, name),
    email = COALESCE(p_email, email),
    phone = COALESCE(p_phone, phone),
    address = COALESCE(p_address, address)
  WHERE school_id = p_school_id;

  SELECT * FROM schools WHERE school_id = p_school_id;
END $$

-- sp_update_school_by_super : super admin full override
DROP PROCEDURE IF EXISTS sp_update_school_by_super $$
CREATE PROCEDURE sp_update_school_by_super(
  IN p_school_id INT,
  IN p_name      VARCHAR(150),
  IN p_code      VARCHAR(30),
  IN p_email     VARCHAR(150),
  IN p_phone     VARCHAR(20),
  IN p_address   VARCHAR(255),
  IN p_status    ENUM('active','inactive')
)
BEGIN
  UPDATE schools
  SET
    name = COALESCE(p_name, name),
    code = COALESCE(p_code, code),
    email = COALESCE(p_email, email),
    phone = COALESCE(p_phone, phone),
    address = COALESCE(p_address, address),
    status = COALESCE(p_status, status)
  WHERE school_id = p_school_id;

  SELECT * FROM schools WHERE school_id = p_school_id;
END $$

-- ============================================================
-- SCHOOL ADMIN STAFF MANAGEMENT
-- ============================================================

-- sp_assign_staff_task : assign a task to a staff member
DROP PROCEDURE IF EXISTS sp_assign_staff_task $$
CREATE PROCEDURE sp_assign_staff_task(
  IN p_staff_id     INT,
  IN p_title        VARCHAR(150),
  IN p_description  TEXT,
  IN p_due_date     DATE,
  IN p_created_by   INT
)
BEGIN
  DECLARE v_creator_school INT;
  DECLARE v_staff_school INT;

  SELECT school_id INTO v_creator_school FROM staff WHERE staff_id = p_created_by;
  SELECT school_id INTO v_staff_school FROM staff WHERE staff_id = p_staff_id;

  IF v_creator_school IS NOT NULL AND v_creator_school = v_staff_school THEN
    INSERT INTO staff_tasks (staff_id, title, description, due_date, created_by)
    VALUES (p_staff_id, p_title, p_description, p_due_date, p_created_by);

    SELECT * FROM staff_tasks WHERE task_id = LAST_INSERT_ID();
  ELSE
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tenancy violation: Staff does not belong to the same school.';
  END IF;
END $$

-- sp_list_school_leave_requests : list leaves for approval
DROP PROCEDURE IF EXISTS sp_list_school_leave_requests $$
CREATE PROCEDURE sp_list_school_leave_requests(IN p_school_id INT)
BEGIN
  SELECT l.*,
         s.first_name, s.last_name, s.avatar_url, s.email, d.name AS department_name,
         CONCAT(r.first_name, ' ', r.last_name) AS reviewer_name
  FROM leave_requests l
  JOIN staff s ON s.staff_id = l.staff_id
  LEFT JOIN departments d ON d.department_id = s.department_id
  LEFT JOIN staff r ON r.staff_id = l.reviewed_by
  WHERE s.school_id = p_school_id
  ORDER BY CASE l.status WHEN 'pending' THEN 1 ELSE 2 END, l.created_at DESC;
END $$

-- sp_review_leave_request : approve or reject leave
DROP PROCEDURE IF EXISTS sp_review_leave_request $$
CREATE PROCEDURE sp_review_leave_request(
  IN p_leave_id     INT,
  IN p_status       ENUM('approved', 'rejected'),
  IN p_comments     TEXT,
  IN p_reviewed_by  INT
)
BEGIN
  DECLARE v_reviewer_school INT;
  DECLARE v_staff_school INT;
  DECLARE v_staff_id INT;

  SELECT school_id INTO v_reviewer_school FROM staff WHERE staff_id = p_reviewed_by;
  SELECT staff_id INTO v_staff_id FROM leave_requests WHERE leave_id = p_leave_id;
  SELECT school_id INTO v_staff_school FROM staff WHERE staff_id = v_staff_id;

  IF v_reviewer_school IS NOT NULL AND v_reviewer_school = v_staff_school THEN
    UPDATE leave_requests
    SET status = p_status,
        comments = p_comments,
        reviewed_by = p_reviewed_by,
        reviewed_at = CURRENT_TIMESTAMP
    WHERE leave_id = p_leave_id;

    SELECT l.*, CONCAT(s.first_name, ' ', s.last_name) AS staff_name
    FROM leave_requests l
    JOIN staff s ON s.staff_id = l.staff_id
    WHERE l.leave_id = p_leave_id;
  ELSE
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tenancy violation: Reviewer does not belong to the same school as the requester.';
  END IF;
END $$

-- ============================================================
-- TIMETABLE SCHEDULE MANAGEMENT (school admin)
-- ============================================================

-- sp_create_staff_schedule : create a timetable entry with conflict detection
-- Validates: tenancy, teacher conflict (same staff+day+period),
--            room conflict (same room+day+period within school)
DROP PROCEDURE IF EXISTS sp_create_staff_schedule $$
CREATE PROCEDURE sp_create_staff_schedule(
  IN p_school_id    INT,
  IN p_staff_id     INT,
  IN p_period_id    INT,
  IN p_subject_name VARCHAR(100),
  IN p_class_name   VARCHAR(50),
  IN p_day_of_week  ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
  IN p_room         VARCHAR(50)
)
BEGIN
  DECLARE v_staff_school INT;
  DECLARE v_period_school INT;
  DECLARE v_is_break BOOLEAN;
  DECLARE v_teacher_conflict INT;
  DECLARE v_room_conflict INT;

  -- 1. Tenancy check: staff belongs to school
  SELECT school_id INTO v_staff_school FROM staff WHERE staff_id = p_staff_id;
  IF v_staff_school IS NULL OR v_staff_school != p_school_id THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Tenancy violation: Staff does not belong to this school.';
  END IF;

  -- 2. Period belongs to school and is not a break
  SELECT school_id, is_break INTO v_period_school, v_is_break
  FROM school_periods WHERE period_id = p_period_id;
  IF v_period_school IS NULL OR v_period_school != p_school_id THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Validation error: Period does not belong to this school.';
  END IF;
  IF v_is_break = TRUE THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Validation error: Cannot assign a class to a break period.';
  END IF;

  -- 3. Teacher conflict: same staff + same day + same period
  SELECT COUNT(*) INTO v_teacher_conflict
  FROM staff_schedules
  WHERE staff_id = p_staff_id AND day_of_week = p_day_of_week AND period_id = p_period_id;
  IF v_teacher_conflict > 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Teacher conflict: This staff member already has a class assigned during this period on this day.';
  END IF;

  -- 4. Room conflict: same room + same day + same period (within school)
  IF p_room IS NOT NULL AND p_room != '' THEN
    SELECT COUNT(*) INTO v_room_conflict
    FROM staff_schedules ss
    JOIN staff s ON s.staff_id = ss.staff_id
    WHERE s.school_id = p_school_id
      AND ss.room = p_room
      AND ss.day_of_week = p_day_of_week
      AND ss.period_id = p_period_id;
    IF v_room_conflict > 0 THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Room conflict: This room is already occupied during this period on this day.';
    END IF;
  END IF;

  -- 5. Insert
  INSERT INTO staff_schedules (staff_id, period_id, subject_name, class_name, day_of_week, room)
  VALUES (p_staff_id, p_period_id, p_subject_name, p_class_name, p_day_of_week, p_room);

  -- 6. Return the created entry with period info
  SELECT ss.*, sp.period_name, sp.start_time, sp.end_time, sp.period_order, sp.is_break
  FROM staff_schedules ss
  JOIN school_periods sp ON sp.period_id = ss.period_id
  WHERE ss.schedule_id = LAST_INSERT_ID();
END $$

-- sp_update_staff_schedule : update an existing schedule entry with conflict detection
DROP PROCEDURE IF EXISTS sp_update_staff_schedule $$
CREATE PROCEDURE sp_update_staff_schedule(
  IN p_schedule_id  INT,
  IN p_school_id    INT,
  IN p_period_id    INT,
  IN p_subject_name VARCHAR(100),
  IN p_class_name   VARCHAR(50),
  IN p_day_of_week  ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
  IN p_room         VARCHAR(50)
)
BEGIN
  DECLARE v_staff_id INT;
  DECLARE v_staff_school INT;
  DECLARE v_period_school INT;
  DECLARE v_is_break BOOLEAN;
  DECLARE v_teacher_conflict INT;
  DECLARE v_room_conflict INT;

  -- 1. Get staff_id from existing schedule and verify tenancy
  SELECT ss.staff_id, s.school_id INTO v_staff_id, v_staff_school
  FROM staff_schedules ss
  JOIN staff s ON s.staff_id = ss.staff_id
  WHERE ss.schedule_id = p_schedule_id;

  IF v_staff_id IS NULL OR v_staff_school != p_school_id THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Tenancy violation: Schedule does not belong to this school.';
  END IF;

  -- 2. Period belongs to school and is not a break
  SELECT school_id, is_break INTO v_period_school, v_is_break
  FROM school_periods WHERE period_id = p_period_id;
  IF v_period_school IS NULL OR v_period_school != p_school_id THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Validation error: Period does not belong to this school.';
  END IF;
  IF v_is_break = TRUE THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Validation error: Cannot assign a class to a break period.';
  END IF;

  -- 3. Teacher conflict (exclude self)
  SELECT COUNT(*) INTO v_teacher_conflict
  FROM staff_schedules
  WHERE staff_id = v_staff_id
    AND day_of_week = p_day_of_week
    AND period_id = p_period_id
    AND schedule_id != p_schedule_id;
  IF v_teacher_conflict > 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Teacher conflict: This staff member already has a class assigned during this period on this day.';
  END IF;

  -- 4. Room conflict (exclude self)
  IF p_room IS NOT NULL AND p_room != '' THEN
    SELECT COUNT(*) INTO v_room_conflict
    FROM staff_schedules ss
    JOIN staff s ON s.staff_id = ss.staff_id
    WHERE s.school_id = p_school_id
      AND ss.room = p_room
      AND ss.day_of_week = p_day_of_week
      AND ss.period_id = p_period_id
      AND ss.schedule_id != p_schedule_id;
    IF v_room_conflict > 0 THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Room conflict: This room is already occupied during this period on this day.';
    END IF;
  END IF;

  -- 5. Update
  UPDATE staff_schedules
  SET period_id    = p_period_id,
      subject_name = p_subject_name,
      class_name   = p_class_name,
      day_of_week  = p_day_of_week,
      room         = p_room
  WHERE schedule_id = p_schedule_id;

  -- 6. Return updated entry
  SELECT ss.*, sp.period_name, sp.start_time, sp.end_time, sp.period_order, sp.is_break
  FROM staff_schedules ss
  JOIN school_periods sp ON sp.period_id = ss.period_id
  WHERE ss.schedule_id = p_schedule_id;
END $$

-- sp_list_school_schedules : list all schedules in school with period info
-- Supports optional filtering by staff_id (pass 0 or NULL to skip)
DROP PROCEDURE IF EXISTS sp_list_school_schedules $$
CREATE PROCEDURE sp_list_school_schedules(
  IN p_school_id INT,
  IN p_staff_id  INT
)
BEGIN
  SELECT
    ss.schedule_id, ss.staff_id, ss.period_id, ss.subject_name,
    ss.class_name, ss.day_of_week, ss.room, ss.created_at, ss.updated_at,
    sp.period_name, sp.start_time, sp.end_time, sp.period_order, sp.is_break,
    CONCAT(s.first_name, ' ', s.last_name) AS staff_name,
    d.name AS department_name
  FROM staff_schedules ss
  JOIN school_periods sp ON sp.period_id = ss.period_id
  JOIN staff s ON s.staff_id = ss.staff_id
  LEFT JOIN departments d ON d.department_id = s.department_id
  WHERE s.school_id = p_school_id
    AND (p_staff_id IS NULL OR p_staff_id = 0 OR ss.staff_id = p_staff_id)
  ORDER BY
    CONCAT(s.first_name, ' ', s.last_name),
    CASE ss.day_of_week
      WHEN 'Monday' THEN 1
      WHEN 'Tuesday' THEN 2
      WHEN 'Wednesday' THEN 3
      WHEN 'Thursday' THEN 4
      WHEN 'Friday' THEN 5
      WHEN 'Saturday' THEN 6
      WHEN 'Sunday' THEN 7
    END,
    sp.period_order;
END $$

-- sp_delete_staff_schedule : delete a schedule slot
DROP PROCEDURE IF EXISTS sp_delete_staff_schedule $$
CREATE PROCEDURE sp_delete_staff_schedule(
  IN p_schedule_id INT,
  IN p_school_id   INT
)
BEGIN
  DECLARE v_staff_school INT;
  SELECT s.school_id INTO v_staff_school
  FROM staff_schedules sch
  JOIN staff s ON s.staff_id = sch.staff_id
  WHERE sch.schedule_id = p_schedule_id;

  IF v_staff_school = p_school_id THEN
    DELETE FROM staff_schedules WHERE schedule_id = p_schedule_id;
  ELSE
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tenancy violation: Schedule belongs to another school.';
  END IF;
END $$

-- sp_bulk_create_staff_schedules : insert multiple schedule entries at once
-- Accepts a JSON array of entries. Validates tenancy, teacher + room conflicts.
DROP PROCEDURE IF EXISTS sp_bulk_create_staff_schedules $$
CREATE PROCEDURE sp_bulk_create_staff_schedules(
  IN p_school_id INT,
  IN p_staff_id  INT,
  IN p_entries   JSON
)
BEGIN
  DECLARE v_staff_school INT;
  DECLARE v_teacher_conflict INT;
  DECLARE v_room_conflict INT;
  DECLARE v_break_conflict INT;
  DECLARE v_inserted INT;

  -- 1. Tenancy check
  SELECT school_id INTO v_staff_school FROM staff WHERE staff_id = p_staff_id;
  IF v_staff_school IS NULL OR v_staff_school != p_school_id THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Tenancy violation: Staff does not belong to this school.';
  END IF;

  -- 2. Check no entries target break periods
  SELECT COUNT(*) INTO v_break_conflict
  FROM JSON_TABLE(p_entries, '$[*]' COLUMNS (
    period_id INT PATH '$.period_id'
  )) AS jt
  JOIN school_periods sp ON sp.period_id = jt.period_id
  WHERE sp.is_break = TRUE;
  IF v_break_conflict > 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Validation error: Cannot assign classes to break periods.';
  END IF;

  -- 3. Teacher conflict: check against existing schedules
  SELECT COUNT(*) INTO v_teacher_conflict
  FROM JSON_TABLE(p_entries, '$[*]' COLUMNS (
    period_id   INT PATH '$.period_id',
    day_of_week VARCHAR(20) PATH '$.day_of_week'
  )) AS jt
  JOIN staff_schedules ss ON ss.staff_id = p_staff_id
    AND ss.day_of_week = jt.day_of_week
    AND ss.period_id = jt.period_id;
  IF v_teacher_conflict > 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Teacher conflict: Staff already has assignments during one or more of the specified periods.';
  END IF;

  -- 4. Room conflict: check against all school schedules
  SELECT COUNT(*) INTO v_room_conflict
  FROM JSON_TABLE(p_entries, '$[*]' COLUMNS (
    period_id   INT PATH '$.period_id',
    day_of_week VARCHAR(20) PATH '$.day_of_week',
    room        VARCHAR(50) PATH '$.room'
  )) AS jt
  JOIN staff_schedules ss ON ss.day_of_week = jt.day_of_week
    AND ss.period_id = jt.period_id
    AND ss.room = jt.room
  JOIN staff s ON s.staff_id = ss.staff_id AND s.school_id = p_school_id
  WHERE jt.room IS NOT NULL AND jt.room != '';
  IF v_room_conflict > 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Room conflict: One or more rooms are already occupied during the specified periods.';
  END IF;

  -- 5. Bulk insert
  INSERT INTO staff_schedules (staff_id, period_id, subject_name, class_name, day_of_week, room)
  SELECT p_staff_id, jt.period_id, jt.subject_name, jt.class_name, jt.day_of_week, jt.room
  FROM JSON_TABLE(p_entries, '$[*]' COLUMNS (
    period_id    INT PATH '$.period_id',
    subject_name VARCHAR(100) PATH '$.subject_name',
    class_name   VARCHAR(50) PATH '$.class_name',
    day_of_week  VARCHAR(20) PATH '$.day_of_week',
    room         VARCHAR(50) PATH '$.room'
  )) AS jt;

  SET v_inserted = ROW_COUNT();

  -- 6. Return all entries for this staff with period info
  SELECT
    ss.schedule_id, ss.staff_id, ss.period_id, ss.subject_name,
    ss.class_name, ss.day_of_week, ss.room, ss.created_at, ss.updated_at,
    sp.period_name, sp.start_time, sp.end_time, sp.period_order, sp.is_break,
    v_inserted AS total_inserted
  FROM staff_schedules ss
  JOIN school_periods sp ON sp.period_id = ss.period_id
  WHERE ss.staff_id = p_staff_id
  ORDER BY
    CASE ss.day_of_week
      WHEN 'Monday' THEN 1
      WHEN 'Tuesday' THEN 2
      WHEN 'Wednesday' THEN 3
      WHEN 'Thursday' THEN 4
      WHEN 'Friday' THEN 5
      WHEN 'Saturday' THEN 6
      WHEN 'Sunday' THEN 7
    END,
    sp.period_order;
END $$

-- sp_list_school_tasks : list all tasks in school
DROP PROCEDURE IF EXISTS sp_list_school_tasks $$
CREATE PROCEDURE sp_list_school_tasks(IN p_school_id INT)
BEGIN
  SELECT t.*,
         CONCAT(s.first_name, ' ', s.last_name) AS staff_name,
         d.name AS department_name
  FROM staff_tasks t
  JOIN staff s ON s.staff_id = t.staff_id
  LEFT JOIN departments d ON d.department_id = s.department_id
  WHERE s.school_id = p_school_id
  ORDER BY t.created_at DESC;
END $$

-- sp_delete_staff_task : delete an assigned task
DROP PROCEDURE IF EXISTS sp_delete_staff_task $$
CREATE PROCEDURE sp_delete_staff_task(
  IN p_task_id   INT,
  IN p_school_id INT
)
BEGIN
  DECLARE v_staff_school INT;
  SELECT s.school_id INTO v_staff_school
  FROM staff_tasks t
  JOIN staff s ON s.staff_id = t.staff_id
  WHERE t.task_id = p_task_id;

  IF v_staff_school = p_school_id THEN
    DELETE FROM staff_tasks WHERE task_id = p_task_id;
  ELSE
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tenancy violation: Task belongs to another school.';
  END IF;
END $$

-- sp_update_department_status : activate/deactivate a department
DROP PROCEDURE IF EXISTS sp_update_department_status $$
CREATE PROCEDURE sp_update_department_status(
  IN p_school_id     INT,
  IN p_department_id INT,
  IN p_status        ENUM('active','inactive')
)
BEGIN
  UPDATE departments
  SET status = p_status
  WHERE department_id = p_department_id AND school_id = p_school_id;

  SELECT * FROM departments WHERE department_id = p_department_id AND school_id = p_school_id;
END $$

DELIMITER ;