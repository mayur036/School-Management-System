import { ApiError } from '../middleware/error.js';
import authModel from '../models/auth.model.js';
import departmentModel from '../models/department.model.js';
import staffModel from '../models/staff.model.js';
import { asyncHandler, created, ok } from '../utils/apiResponse.js';
import { destroyImage, uploadAvatar } from '../utils/cloudinary.js';
import { comparePassword, hashPassword } from '../utils/password.js';

/**
 * Fetch a staff member and assert it belongs to the caller's school.
 * Returns 404 (not 403) for foreign rows so we never leak their existence.
 */
const getOwnSchoolStaff = async (staffId, schoolId) => {
  const staff = await staffModel.getStaff(staffId);
  if (!staff || staff.school_id !== schoolId) {
    throw new ApiError(404, 'Staff member not found');
  }
  return staff;
};

/**
 * @desc    Get the currently authenticated user's own profile
 * @route   GET /api/staff/me
 * @access  Private (any authenticated role)
 */
const getMyProfile = asyncHandler(async (req, res) => {
  const staff = await staffModel.getStaff(req.user.staff_id);
  if (!staff) {
    throw new ApiError(404, 'Profile not found');
  }
  return ok(res, { staff }, 'Profile retrieved successfully');
});

/**
 * @desc    Change the currently authenticated user's own password
 * @route   PATCH /api/staff/me/password
 * @access  Private (any authenticated role)
 */
const changeMyPassword = asyncHandler(async (req, res) => {
  const { current_password, new_password } = req.body;

  // Fetch the user's stored hash via the email in the token (sp_get_staff
  // doesn't return the hash, but sp_login_get_user does).
  const user = await authModel.findUserByEmail(req.user.email);
  if (!user) {
    throw new ApiError(404, 'Profile not found');
  }

  const isMatch = await comparePassword(current_password, user.password_hash);
  if (!isMatch) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  const newHash = await hashPassword(new_password);
  await staffModel.updatePassword(req.user.staff_id, newHash);

  return ok(res, null, 'Password changed successfully');
});

/**
 * @desc    Upload / replace the authenticated user's avatar
 * @route   PATCH /api/staff/me/avatar
 * @access  Private (any authenticated role)
 */
const updateMyAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No image file provided');
  }

  const staffId = req.user.staff_id;

  // Remember the old image so we can clean it up after a successful swap.
  const existing = await staffModel.getStaff(staffId);
  const oldPublicId = existing?.avatar_public_id ?? null;
  console.log(oldPublicId);

  const { url, publicId } = await uploadAvatar(req.file.buffer);
  const staff = await staffModel.updateAvatar(staffId, url, publicId);

  // Best-effort: delete the previous avatar so Cloudinary doesn't pile up.
  if (oldPublicId && oldPublicId !== publicId) {
    await destroyImage(oldPublicId);
  }

  return ok(res, { staff }, 'Avatar updated successfully');
});

/**
 * @desc    Register a staff member in the admin's own school
 * @route   POST /api/staff
 * @access  Private (school_admin)
 */
const createStaff = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, password, phone } = req.body;
  const schoolId = req.user.school_id;
  // validate() coerces but doesn't write back, so normalize the id here.
  const departmentId = Number(req.body.department_id);

  // Tenant guard: the department must belong to the admin's own school.
  const departments = await departmentModel.listDepartments(schoolId);
  const validDepartment = departments.some(
    (d) => d.department_id === departmentId
  );
  if (!validDepartment) {
    throw new ApiError(400, 'Department does not belong to your school');
  }

  const passwordHash = await hashPassword(password);

  const staff = await staffModel.createStaff({
    schoolId,
    departmentId,
    firstName: first_name,
    lastName: last_name,
    email,
    passwordHash,
    phone: phone ?? null,
    createdBy: req.user.staff_id,
  });

  return created(res, { staff }, 'Staff registered successfully');
});

/**
 * @desc    List staff of the admin's own school
 * @route   GET /api/staff
 * @access  Private (school_admin)
 */
const listStaff = asyncHandler(async (req, res) => {
  const staff = await staffModel.listStaff(req.user.school_id);
  return ok(res, { staff }, 'Staff retrieved successfully');
});

/**
 * @desc    Get a single staff member of the admin's own school
 * @route   GET /api/staff/:id
 * @access  Private (school_admin)
 */
const getStaff = asyncHandler(async (req, res) => {
  const staff = await getOwnSchoolStaff(req.params.id, req.user.school_id);
  return ok(res, { staff }, 'Staff retrieved successfully');
});

/**
 * @desc    Enable / disable a staff member of the admin's own school
 * @route   PATCH /api/staff/:id/status
 * @access  Private (school_admin)
 */
const updateStaffStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  // Tenant guard before mutating.
  await getOwnSchoolStaff(req.params.id, req.user.school_id);

  const staff = await staffModel.updateStaffStatus(req.params.id, status);
  return ok(
    res,
    { staff },
    `Staff ${status === 'active' ? 'activated' : 'deactivated'} successfully`
  );
});

/**
 * @desc    Update the currently authenticated user's own profile info
 * @route   PATCH /api/staff/me
 * @access  Private (any authenticated role)
 */
const updateMyProfile = asyncHandler(async (req, res) => {
  const { first_name, last_name, phone } = req.body;
  const staffId = req.user.staff_id;

  const existingStaff = await staffModel.getStaff(staffId);

  if (
    existingStaff.first_name == first_name &&
    existingStaff.last_name == last_name &&
    existingStaff.phone == phone
  ) {
    throw new ApiError(400, 'No changes made');
  }

  const staff = await staffModel.updateProfile(
    staffId,
    first_name,
    last_name,
    phone ?? null
  );

  if (!staff) {
    throw new ApiError(404, 'Profile not found');
  }

  return ok(res, { staff }, 'Profile updated successfully');
});

export {
  changeMyPassword,
  createStaff,
  getMyProfile,
  getStaff,
  listStaff,
  updateMyAvatar,
  updateMyProfile,
  updateStaffStatus,
};
