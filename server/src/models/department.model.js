import { callProcedure, callProcedureOne } from '../utils/callProcedure.js';

const departmentModel = {
  /** Create a department under a school. Returns the created row. */
  createDepartment: (schoolId, name) =>
    callProcedureOne('sp_create_department', [schoolId, name]),

  /** List departments of one school. */
  listDepartments: (schoolId) =>
    callProcedure('sp_list_departments', [schoolId]),
};

export default departmentModel;
