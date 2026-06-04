import { callProcedure, callProcedureOne } from '../utils/callProcedure.js';

/** Register a department staff member. Returns the created row. */
export const createStaff = ({
  schoolId,
  departmentId,
  firstName,
  lastName,
  email,
  passwordHash,
  phone,
  createdBy,
}) =>
  callProcedureOne('sp_create_staff', [
    schoolId,
    departmentId,
    firstName,
    lastName,
    email,
    passwordHash,
    phone,
    createdBy,
  ]);

/** List all staff of one school. */
export const listStaff = (schoolId) =>
  callProcedure('sp_list_staff', [schoolId]);

/** Get a single staff member by id. */
export const getStaff = (staffId) =>
  callProcedureOne('sp_get_staff', [staffId]);

/** Enable / disable a staff member. Returns the updated row. */
export const updateStaffStatus = (staffId, status) =>
  callProcedureOne('sp_update_staff_status', [staffId, status]);
