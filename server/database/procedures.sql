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
    s.staff_id, s.role_id, r.role_name, s.school_id, s.department_id,
    s.first_name, s.last_name, s.email, s.password_hash, s.phone,
    s.avatar_url, s.status
  FROM staff s
  JOIN roles r ON r.role_id = s.role_id
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
    s.staff_id, s.role_id, r.role_name, s.school_id, s.department_id,
    s.first_name, s.last_name, s.email, s.phone, s.avatar_url,
    s.status, s.created_at
  FROM staff s JOIN roles r ON r.role_id = s.role_id
  WHERE s.staff_id = LAST_INSERT_ID();
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
    s.staff_id, s.role_id, r.role_name, s.school_id, s.department_id,
    d.name AS department_name, s.first_name, s.last_name, s.email,
    s.phone, s.avatar_url, s.status, s.created_at
  FROM staff s
  JOIN roles r ON r.role_id = s.role_id
  LEFT JOIN departments d ON d.department_id = s.department_id
  WHERE s.staff_id = LAST_INSERT_ID();
END $$

-- sp_list_staff : all staff of one school (with role + department names)
DROP PROCEDURE IF EXISTS sp_list_staff $$
CREATE PROCEDURE sp_list_staff(IN p_school_id INT)
BEGIN
  SELECT
    s.staff_id, s.role_id, r.role_name, s.school_id, s.department_id,
    d.name AS department_name, s.first_name, s.last_name, s.email,
    s.phone, s.avatar_url, s.status, s.created_at
  FROM staff s
  JOIN roles r ON r.role_id = s.role_id
  LEFT JOIN departments d ON d.department_id = s.department_id
  WHERE s.school_id = p_school_id
  ORDER BY s.created_at DESC;
END $$

-- sp_get_staff : single staff member (own profile / detail)
DROP PROCEDURE IF EXISTS sp_get_staff $$
CREATE PROCEDURE sp_get_staff(IN p_staff_id INT)
BEGIN
  SELECT
    s.staff_id, s.role_id, r.role_name, s.school_id, s.department_id,
    d.name AS department_name, s.first_name, s.last_name, s.email,
    s.phone, s.avatar_url, s.avatar_public_id, s.status,
    s.created_at, s.updated_at
  FROM staff s
  JOIN roles r ON r.role_id = s.role_id
  LEFT JOIN departments d ON d.department_id = s.department_id
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
    s.staff_id, s.role_id, r.role_name, s.school_id, s.department_id,
    d.name AS department_name, s.first_name, s.last_name, s.email,
    s.phone, s.avatar_url, s.status, s.created_at, s.updated_at
  FROM staff s
  JOIN roles r ON r.role_id = s.role_id
  LEFT JOIN departments d ON d.department_id = s.department_id
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
    s.staff_id, s.role_id, r.role_name, s.school_id, s.department_id,
    d.name AS department_name, s.first_name, s.last_name, s.email,
    s.phone, s.avatar_url, s.status, s.created_at, s.updated_at
  FROM staff s
  JOIN roles r ON r.role_id = s.role_id
  LEFT JOIN departments d ON d.department_id = s.department_id
  WHERE s.staff_id = p_staff_id;
END $$

DELIMITER ;
