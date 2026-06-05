import { ApiError } from '../middleware/error.js';
import departmentModel from '../models/department.model.js';
import staffModel from '../models/staff.model.js';
import { asyncHandler, created, ok } from '../utils/apiResponse.js';
import { hashPassword } from '../utils/password.js';

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

export { createStaff, getStaff, listStaff, updateStaffStatus };
