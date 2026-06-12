import { ApiError } from '../middleware/error.js';
import departmentModel from '../models/department.model.js';
import { asyncHandler, created, ok } from '../utils/apiResponse.js';

/**
 * @desc    Create a department under the admin's own school
 * @route   POST /api/departments
 * @access  Private (school_admin)
 */
const createDepartment = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // Tenant scope: the school_id always comes from the token, never the body.
  const department = await departmentModel.createDepartment(
    req.user.school_id,
    name
  );

  return created(res, { department }, 'Department created successfully');
});

/**
 * @desc    List departments of the admin's own school
 * @route   GET /api/departments
 * @access  Private (school_admin)
 */
const listDepartments = asyncHandler(async (req, res) => {
  const departments = await departmentModel.listDepartments(req.user.school_id);

  if (departments.length === 0) {
    throw new ApiError(404, 'No department found under your school');
  }

  return ok(res, { departments }, 'Departments retrieved successfully');
});

/**
 * @desc    Activate or deactivate a department
 * @route   PATCH /api/departments/:id/status
 * @access  Private (school_admin)
 */
const updateDepartmentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Tenant scope: ensure the admin can only update departments within their own school_id.
  const department = await departmentModel.updateDepartmentStatus(
    req.user.school_id,
    id,
    status
  );

  if (!department) {
    throw new ApiError(
      404,
      'Department not found or does not belong to your school'
    );
  }

  return ok(
    res,
    { department },
    `Department status updated to ${status} successfully`
  );
});

export { createDepartment, listDepartments, updateDepartmentStatus };
