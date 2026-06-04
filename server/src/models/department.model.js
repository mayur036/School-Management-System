import { callProcedure, callProcedureOne } from '../utils/callProcedure.js';

/** Create a department under a school. Returns the created row. */
export const createDepartment = (schoolId, name) =>
  callProcedureOne('sp_create_department', [schoolId, name]);

/** List departments of one school. */
export const listDepartments = (schoolId) =>
  callProcedure('sp_list_departments', [schoolId]);
