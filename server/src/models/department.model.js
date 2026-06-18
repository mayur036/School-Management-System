import { callProcedure, callProcedureOne } from '../utils/callProcedure.js';

const departmentModel = {
  /** Create a department under a school. Returns the created row. */
  createDepartment: (schoolId, name) =>
    callProcedureOne('sp_create_department', [schoolId, name]),

  /** List departments of one school. */
  listDepartments: (
    schoolId,
    search = '',
    status = 'all',
    sortBy = 'name',
    sortOrder = 'ASC'
  ) =>
    callProcedure('sp_list_departments', [
      schoolId,
      search,
      status,
      sortBy,
      sortOrder,
    ]),

  /** Activate/deactivate a department. */
  updateDepartmentStatus: (schoolId, departmentId, status) =>
    callProcedureOne('sp_update_department_status', [
      schoolId,
      departmentId,
      status,
    ]),
};

export default departmentModel;
