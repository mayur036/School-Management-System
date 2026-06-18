import { callProcedure, callProcedureOne } from '../utils/callProcedure.js';

const staffModel = {
  // Register a department staff member.
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

  // List all staff of one school.
  listStaff: (
    schoolId,
    search = '',
    departmentId = 0,
    status = 'all',
    sortBy = 'created_at',
    sortOrder = 'DESC'
  ) =>
    callProcedure('sp_list_staff', [
      schoolId,
      search,
      departmentId,
      status,
      sortBy,
      sortOrder,
    ]),

  // Get a single staff member by id.
  getStaff: (staffId) => callProcedureOne('sp_get_staff', [staffId]),

  // Enable / disable a staff member. Returns the updated row.
  updateStaffStatus: (staffId, status) =>
    callProcedureOne('sp_update_staff_status', [staffId, status]),

  // Update a user's own password hash.
  updatePassword: (staffId, passwordHash) =>
    callProcedure('sp_update_password', [staffId, passwordHash]),

  // Set a user's avatar URL + Cloudinary public_id. Returns the updated row.
  updateAvatar: (staffId, avatarUrl, avatarPublicId) =>
    callProcedureOne('sp_update_avatar', [staffId, avatarUrl, avatarPublicId]),

  // Update a user's own profile info (first name, last name, phone). Returns the updated row.
  updateProfile: (staffId, firstName, lastName, phone) =>
    callProcedureOne('sp_update_profile', [
      staffId,
      firstName,
      lastName,
      phone,
    ]),
};

export default staffModel;
