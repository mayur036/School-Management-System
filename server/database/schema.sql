-- ============================================================
-- School Management System — Schema
-- Run order: schema.sql  ->  procedures.sql  ->  seed.sql
-- MySQL 8 (InnoDB). Run this whole file in MySQL Workbench.
-- ============================================================

CREATE DATABASE IF NOT EXISTS school_management_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE school_management_system;

-- Drop for clean re-runs. FK checks are disabled because schools and
-- staff reference each other (circular FK), so no drop order is valid.
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS schools;
DROP TABLE IF EXISTS roles;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- roles : fixed set of roles (super_admin | school_admin | staff)
-- ------------------------------------------------------------
CREATE TABLE roles (
  role_id     INT AUTO_INCREMENT PRIMARY KEY,
  role_name   VARCHAR(50) NOT NULL UNIQUE,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- schools : tenants of the platform
-- created_by -> staff.staff_id is added AFTER staff exists (circular FK)
-- ------------------------------------------------------------
CREATE TABLE schools (
  school_id   INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  code        VARCHAR(30) UNIQUE,
  email       VARCHAR(150),
  phone       VARCHAR(20),
  address     VARCHAR(255),
  status      ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_by  INT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- departments : belong to a school
-- ------------------------------------------------------------
CREATE TABLE departments (
  department_id INT AUTO_INCREMENT PRIMARY KEY,
  school_id     INT NOT NULL,
  name          VARCHAR(100) NOT NULL,
  status        ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_dept_school
    FOREIGN KEY (school_id) REFERENCES schools(school_id)
    ON DELETE CASCADE,
  CONSTRAINT uq_dept_school_name UNIQUE (school_id, name)
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- staff : unified login table for EVERYONE (super admin, school
-- admins, department staff). Distinguished by role_id.
--   super_admin  -> school_id NULL, department_id NULL
--   school_admin -> school_id set,  department_id NULL
--   staff        -> school_id set,  department_id set
-- ------------------------------------------------------------
CREATE TABLE staff (
  staff_id       INT AUTO_INCREMENT PRIMARY KEY,
  role_id        INT NOT NULL,
  school_id      INT NULL,
  department_id  INT NULL,
  first_name     VARCHAR(80) NOT NULL,
  last_name      VARCHAR(80),
  email          VARCHAR(150) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  phone          VARCHAR(20),
  avatar_url        VARCHAR(255) NULL,
  avatar_public_id  VARCHAR(255) NULL,
  status         ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_by     INT NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_staff_role
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
  CONSTRAINT fk_staff_school
    FOREIGN KEY (school_id) REFERENCES schools(school_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_staff_department
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
    ON DELETE SET NULL,
  CONSTRAINT fk_staff_created_by
    FOREIGN KEY (created_by) REFERENCES staff(staff_id)
    ON DELETE SET NULL
) ENGINE = InnoDB;

-- Add the circular FK now that staff exists.
ALTER TABLE schools
  ADD CONSTRAINT fk_school_created_by
    FOREIGN KEY (created_by) REFERENCES staff(staff_id)
    ON DELETE SET NULL;

-- Helpful indexes for tenant-scoped lookups.
CREATE INDEX idx_staff_school     ON staff(school_id);
CREATE INDEX idx_staff_role       ON staff(role_id);
CREATE INDEX idx_staff_department ON staff(department_id);
CREATE INDEX idx_dept_school      ON departments(school_id);