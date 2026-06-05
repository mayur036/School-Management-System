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
  listStaff: (schoolId) => callProcedure('sp_list_staff', [schoolId]),

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
};

export default staffModel;
