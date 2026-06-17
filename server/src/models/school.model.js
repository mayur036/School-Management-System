import { callProcedure, callProcedureOne } from '../utils/callProcedure.js';

const schoolModel = {
  getSchoolByEmail: (email) =>
    callProcedureOne('sp_get_school_by_email', [email]),

  createSchool: ({ name, code, email, phone, address, createdBy }) =>
    callProcedureOne('sp_create_school', [
      name,
      code,
      email,
      phone,
      address,
      createdBy,
    ]),

  listSchools: (search = '', status = 'all', sortBy = 'created_at', sortOrder = 'DESC') =>
    callProcedure('sp_list_schools', [search, status, sortBy, sortOrder]),

  getSchool: (schoolId) => callProcedureOne('sp_get_school', [schoolId]),

  updateSchoolStatus: (schoolId, status) =>
    callProcedureOne('sp_update_school_status', [schoolId, status]),

  updateSchool: (schoolId, { name, email, phone, address }) =>
    callProcedureOne('sp_update_school', [
      schoolId,
      name ?? null,
      email ?? null,
      phone ?? null,
      address ?? null,
    ]),

  updateSchoolBySuper: (
    schoolId,
    { name, code, email, phone, address, status }
  ) =>
    callProcedureOne('sp_update_school_by_super', [
      schoolId,
      name ?? null,
      code ?? null,
      email ?? null,
      phone ?? null,
      address ?? null,
      status ?? null,
    ]),

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
