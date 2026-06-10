import { callProcedure, callProcedureOne } from '../utils/callProcedure.js';

const schoolModel = {
  getSchoolByEmail: (email) => callProcedureOne('sp_get_school_by_email', [email]),

  createSchool: ({ name, code, email, phone, address, createdBy }) =>
    callProcedureOne('sp_create_school', [
      name,
      code,
      email,
      phone,
      address,
      createdBy,
    ]),

  listSchools: () => callProcedure('sp_list_schools'),

  getSchool: (schoolId) => callProcedureOne('sp_get_school', [schoolId]),

  updateSchoolStatus: (schoolId, status) =>
    callProcedureOne('sp_update_school_status', [schoolId, status]),

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
