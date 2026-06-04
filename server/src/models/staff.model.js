import { callProcedure, callProcedureOne } from '../utils/callProcedure.js';

const staffModel = {
  /** Register a department staff member. Returns the created row. */
  createStaff: ({
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
    ]),

  /** List all staff of one school. */
  listStaff: (schoolId) => callProcedure('sp_list_staff', [schoolId]),

  /** Get a single staff member by id. */
  getStaff: (staffId) => callProcedureOne('sp_get_staff', [staffId]),

  /** Enable / disable a staff member. Returns the updated row. */
  updateStaffStatus: (staffId, status) =>
    callProcedureOne('sp_update_staff_status', [staffId, status]),
};

export default staffModel;
