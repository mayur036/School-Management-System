import { callProcedureOne } from '../utils/callProcedure.js';

/** Fetch a user (any role) + role_name by email, for login. */
export const findUserByEmail = (email) =>
  callProcedureOne('sp_login_get_user', [email]);

/** Fetch a single staff member by id (own profile / detail). */
export const findStaffById = (staffId) =>
  callProcedureOne('sp_get_staff', [staffId]);
