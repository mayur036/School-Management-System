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
DROP PROCEDURE IF EXISTS sp_get_staff_dashboard_stats $$
CREATE PROCEDURE sp_get_staff_dashboard_stats(IN p_staff_id INT)
BEGIN
  DECLARE v_today_classes INT DEFAULT 0;
  DECLARE v_pending_tasks INT DEFAULT 0;
  DECLARE v_present_days INT DEFAULT 0;
  DECLARE v_leave_days INT DEFAULT 0;

  SELECT COUNT(*) INTO v_today_classes
  FROM staff_schedules
  WHERE staff_id = p_staff_id AND day_of_week = DAYNAME(CURDATE());

  SELECT COUNT(*) INTO v_pending_tasks
  FROM staff_tasks
  WHERE staff_id = p_staff_id AND status != 'completed';

  SELECT COUNT(*) INTO v_present_days
  FROM staff_attendance
  WHERE staff_id = p_staff_id AND status IN ('present', 'late')
    AND MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE());

  SELECT COALESCE(SUM(total_days), 0) INTO v_leave_days
  FROM leave_requests
  WHERE staff_id = p_staff_id AND status = 'approved'
    AND (MONTH(start_date) = MONTH(CURDATE()) OR MONTH(end_date) = MONTH(CURDATE()));

  SELECT
    v_today_classes AS today_classes,
    v_pending_tasks AS pending_tasks,
    v_present_days AS present_days,
    v_leave_days AS leave_days;
END $$

-- sp_get_staff_schedule : get staff weekly schedule
DROP PROCEDURE IF EXISTS sp_get_staff_schedule $$
CREATE PROCEDURE sp_get_staff_schedule(IN p_staff_id INT)
BEGIN
  SELECT * FROM staff_schedules
  WHERE staff_id = p_staff_id
  ORDER BY
    CASE day_of_week
      WHEN 'Monday' THEN 1
      WHEN 'Tuesday' THEN 2
      WHEN 'Wednesday' THEN 3
      WHEN 'Thursday' THEN 4
      WHEN 'Friday' THEN 5
      WHEN 'Saturday' THEN 6
      WHEN 'Sunday' THEN 7
    END,
    start_time;
END $$

-- sp_get_staff_attendance : list attendance logs in range
DROP PROCEDURE IF EXISTS sp_get_staff_attendance $$
CREATE PROCEDURE sp_get_staff_attendance(
  IN p_staff_id   INT,
  IN p_start_date DATE,
  IN p_end_date   DATE
)
BEGIN
  SELECT * FROM staff_attendance
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

  SELECT COUNT(*), MAX(clock_out) INTO v_exists, v_clock_out
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
    -- Clock out
    UPDATE staff_attendance
    SET clock_out = p_time
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
         s.first_name, s.last_name, s.email, d.name AS department_name,
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

-- sp_create_staff_schedule : set timetable schedule for staff
DROP PROCEDURE IF EXISTS sp_create_staff_schedule $$
CREATE PROCEDURE sp_create_staff_schedule(
  IN p_school_id    INT,
  IN p_staff_id     INT,
  IN p_subject_name VARCHAR(100),
  IN p_class_name   VARCHAR(50),
  IN p_day_of_week  ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
  IN p_start_time   TIME,
  IN p_end_time     TIME,
  IN p_room         VARCHAR(50)
)
BEGIN
  DECLARE v_staff_school INT;
  SELECT school_id INTO v_staff_school FROM staff WHERE staff_id = p_staff_id;

  IF v_staff_school = p_school_id THEN
    INSERT INTO staff_schedules (staff_id, subject_name, class_name, day_of_week, start_time, end_time, room)
    VALUES (p_staff_id, p_subject_name, p_class_name, p_day_of_week, p_start_time, p_end_time, p_room);

    SELECT * FROM staff_schedules WHERE schedule_id = LAST_INSERT_ID();
  ELSE
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tenancy violation: Staff does not belong to this school.';
  END IF;
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

-- sp_list_school_schedules : list all schedules in school
DROP PROCEDURE IF EXISTS sp_list_school_schedules $$
CREATE PROCEDURE sp_list_school_schedules(IN p_school_id INT)
BEGIN
  SELECT sch.*,
         CONCAT(s.first_name, ' ', s.last_name) AS staff_name,
         d.name AS department_name
  FROM staff_schedules sch
  JOIN staff s ON s.staff_id = sch.staff_id
  LEFT JOIN departments d ON d.department_id = s.department_id
  WHERE s.school_id = p_school_id
  ORDER BY
    CASE sch.day_of_week
      WHEN 'Monday' THEN 1
      WHEN 'Tuesday' THEN 2
      WHEN 'Wednesday' THEN 3
      WHEN 'Thursday' THEN 4
      WHEN 'Friday' THEN 5
      WHEN 'Saturday' THEN 6
      WHEN 'Sunday' THEN 7
    END,
    sch.start_time;
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

DELIMITER ;

