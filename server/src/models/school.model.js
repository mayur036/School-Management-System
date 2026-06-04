import { callProcedure, callProcedureOne } from '../utils/callProcedure.js';

const schoolModel = {
  /** Create a school (super admin). Returns the created row. */
  createSchool: ({ name, code, email, phone, address, createdBy }) =>
    callProcedureOne('sp_create_school', [
      name,
      code,
      email,
      phone,
      address,
      createdBy,
    ]),

  /** List all schools (newest first). */
  listSchools: () => callProcedure('sp_list_schools'),

  /** Get a single school by id. */
  getSchool: (schoolId) => callProcedureOne('sp_get_school', [schoolId]),

  /** Activate / deactivate a school. Returns the updated row. */
  updateSchoolStatus: (schoolId, status) =>
    callProcedureOne('sp_update_school_status', [schoolId, status]),

  /** Create a school_admin staff row for a school. Returns the created row. */
  createSchoolAdmin: ({
    schoolId,
    firstName,
    lastName,
    email,
    passwordHash,
    phone,
    createdBy,
  }) =>
    callProcedureOne('sp_create_school_admin', [
      schoolId,
      firstName,
      lastName,
      email,
      passwordHash,
      phone,
      createdBy,
    ]),
};

export default schoolModel;
