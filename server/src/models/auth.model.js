import { callProcedureOne } from '../utils/callProcedure.js';

const authModel = {
  /** Fetch a user (any role) + role_name by email, for login. */
  findUserByEmail: async (email) =>
    callProcedureOne('sp_login_get_user', [email]),

  /** Fetch a single staff member by id (own profile / detail). */
  findStaffById: async (staffId) => callProcedureOne('sp_get_staff', [staffId]),
};

export default authModel;
