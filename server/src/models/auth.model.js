import { callProcedureOne } from '../utils/callProcedure.js';

const authModel = {
  /** Fetch a user (any role) + role_name by email, for login. */
  findUserByEmail: async (email) =>
    callProcedureOne('sp_login_get_user', [email]),

  /** Fetch a single staff member by id (own profile / detail). */
  findStaffById: async (staffId) => callProcedureOne('sp_get_staff', [staffId]),

  /** Set password reset token and expiry for email. */
  setResetToken: async (email, token, expiry) =>
    callProcedureOne('sp_set_reset_token', [email, token, expiry]),

  /** Get user by active reset token. */
  getUserByResetToken: async (token) =>
    callProcedureOne('sp_get_user_by_reset_token', [token]),

  /** Reset user password using token. */
  resetPasswordByToken: async (token, passwordHash) =>
    callProcedureOne('sp_reset_password_by_token', [token, passwordHash]),
};

export default authModel;
