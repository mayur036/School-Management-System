import { env } from '../config/env.js';
import { sendEmail } from '../config/mailer.js';
import { ApiError } from '../middleware/error.js';
import authModel from '../models/auth.model.js';
import departmentModel from '../models/department.model.js';
import staffModel from '../models/staff.model.js';
import staffActivityModel from '../models/staffActivity.model.js';
import { welcomeEmailTemplate } from '../templates/welcomeEmailTemplate.js';
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
  const { first_name, last_name, email, password, phone, members } = req.body;
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

  // Batch registration
  if (Array.isArray(members) && members.length > 0) {
    // 1. Check for duplicate emails in the request array itself
    const emails = members.map((m) => m.email.trim().toLowerCase());
    const uniqueEmails = new Set(emails);
    if (uniqueEmails.size !== emails.length) {
      throw new ApiError(
        400,
        'Duplicate email addresses detected in the registration list'
      );
    }

    // 2. Check for duplicate emails in the database
    for (const member of members) {
      const existing = await authModel.findUserByEmail(member.email.trim());
      if (existing) {
        throw new ApiError(
          400,
          `Email "${member.email}" is already registered`
        );
      }
    }

    // 3. Create all staff members
    const createdStaffMembers = [];
    const emailPromises = [];

    for (const member of members) {
      const { first_name, last_name, email, password, phone } = member;
      const passwordHash = await hashPassword(password);
      const staff = await staffModel.createStaff({
        schoolId,
        departmentId,
        firstName: first_name,
        lastName: last_name,
        email: email.trim(),
        passwordHash,
        phone: phone ?? null,
        createdBy: req.user.staff_id,
      });
      createdStaffMembers.push(staff);

      // Prepare email dispatch
      emailPromises.push(
        sendEmail({
          to: email.trim(),
          subject: 'Welcome to CampusCore - Your Staff Credentials',
          html: welcomeEmailTemplate({
            name: `${first_name} ${last_name}`,
            email: email.trim(),
            password, // Raw password
            roleName: 'Staff Member',
            loginUrl: `${env.client.url}/login`,
          }),
        }).catch((err) =>
          console.error(`Failed to send welcome email to ${email}:`, err)
        )
      );
    }

    // Fire-and-forget emails
    Promise.allSettled(emailPromises);

    return created(
      res,
      { staff: createdStaffMembers },
      'Staff members registered successfully'
    );
  }

  // Single registration (backward compatibility)
  const existing = await authModel.findUserByEmail(email);
  if (existing) {
    throw new ApiError(400, `Email "${email}" is already registered`);
  }

  const passwordHash = await hashPassword(password);

  const staff = await staffModel.createStaff({
    schoolId,
    departmentId,
    firstName: first_name,
    lastName: last_name,
    email: email.trim(),
    passwordHash,
    phone: phone ?? null,
    createdBy: req.user.staff_id,
  });

  // Async email dispatch (fire-and-forget)
  sendEmail({
    to: email.trim(),
    subject: 'Welcome to CampusCore - Your Staff Credentials',
    html: welcomeEmailTemplate({
      name: `${first_name} ${last_name}`,
      email: email.trim(),
      password, // Raw password
      roleName: 'Staff Member',
      loginUrl: `${env.client.url}/login`,
    }),
  }).catch((err) => console.error('Failed to send welcome email:', err));

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

// --- Staff Activities (Staff Role) ---

/**
 * @desc    Get dashboard metrics for staff
 * @route   GET /api/staff/me/dashboard-stats
 * @access  Private (staff)
 */
const getStaffDashboardStats = asyncHandler(async (req, res) => {
  const stats = await staffActivityModel.getDashboardStats(req.user.staff_id);
  return ok(res, { stats }, 'Dashboard statistics retrieved successfully');
});

/**
 * @desc    Get staff weekly schedule
 * @route   GET /api/staff/me/schedule
 * @access  Private (staff)
 */
const getStaffSchedule = asyncHandler(async (req, res) => {
  const schedule = await staffActivityModel.getSchedule(req.user.staff_id);
  return ok(res, { schedule }, 'Weekly schedule retrieved successfully');
});

/**
 * @desc    Get staff attendance records
 * @route   GET /api/staff/me/attendance
 * @access  Private (staff)
 */
const getStaffAttendance = asyncHandler(async (req, res) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const startDefault = new Date(year, month, 1).toISOString().split('T')[0];
  const endDefault = new Date(year, month + 1, 0).toISOString().split('T')[0];

  const startDate = req.query.startDate || startDefault;
  const endDate = req.query.endDate || endDefault;

  const attendance = await staffActivityModel.getAttendance(
    req.user.staff_id,
    startDate,
    endDate
  );
  return ok(res, { attendance }, 'Attendance records retrieved successfully');
});

/**
 * @desc    Toggle clock-in / clock-out status for the day
 * @route   POST /api/staff/me/attendance/clock
 * @access  Private (staff)
 */
const toggleClockStatus = asyncHandler(async (req, res) => {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0];

  const log = await staffActivityModel.clockInOut(
    req.user.staff_id,
    date,
    time
  );

  return ok(
    res,
    { log },
    log.clock_out ? 'Clocked out successfully' : 'Clocked in successfully'
  );
});

/**
 * @desc    Get staff leave requests history
 * @route   GET /api/staff/me/leaves
 * @access  Private (staff)
 */
const getStaffLeaves = asyncHandler(async (req, res) => {
  const leaves = await staffActivityModel.getLeaves(req.user.staff_id);
  return ok(res, { leaves }, 'Leave history retrieved successfully');
});

/**
 * @desc    Submit a new leave request
 * @route   POST /api/staff/me/leaves
 * @access  Private (staff)
 */
const requestLeave = asyncHandler(async (req, res) => {
  const { leave_type, start_date, end_date, reason } = req.body;
  const leave = await staffActivityModel.createLeaveRequest(
    req.user.staff_id,
    leave_type,
    start_date,
    end_date,
    reason
  );
  return created(res, { leave }, 'Leave request submitted successfully');
});

/**
 * @desc    Get staff assigned tasks
 * @route   GET /api/staff/me/tasks
 * @access  Private (staff)
 */
const getStaffTasks = asyncHandler(async (req, res) => {
  const tasks = await staffActivityModel.getTasks(req.user.staff_id);
  return ok(res, { tasks }, 'Assigned tasks retrieved successfully');
});

/**
 * @desc    Update status of an assigned task
 * @route   PATCH /api/staff/me/tasks/:id/status
 * @access  Private (staff)
 */
const updateTaskStatus = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;
  const task = await staffActivityModel.updateTaskStatus(
    taskId,
    req.user.staff_id,
    status
  );
  if (!task) {
    throw new ApiError(404, 'Task not found or not assigned to you');
  }
  return ok(res, { task }, 'Task status updated successfully');
});

// --- School Admin Staff Management Methods ---

/**
 * @desc    Assign a task to a staff member
 * @route   POST /api/school-admin/tasks
 * @access  Private (school_admin)
 */
const assignTaskToStaff = asyncHandler(async (req, res) => {
  const { staff_id, title, description, due_date } = req.body;
  const task = await staffActivityModel.assignTask(
    staff_id,
    title,
    description || null,
    due_date || null,
    req.user.staff_id
  );
  return created(res, { task }, 'Task assigned successfully');
});

/**
 * @desc    List all leave requests of the school staff
 * @route   GET /api/school-admin/leaves
 * @access  Private (school_admin)
 */
const listSchoolLeaveRequests = asyncHandler(async (req, res) => {
  const leaves = await staffActivityModel.listSchoolLeaveRequests(
    req.user.school_id
  );
  return ok(res, { leaves }, 'Leave requests retrieved successfully');
});

/**
 * @desc    Review (approve/reject) a staff leave request
 * @route   PATCH /api/school-admin/leaves/:id
 * @access  Private (school_admin)
 */
const reviewLeaveRequest = asyncHandler(async (req, res) => {
  const leaveId = req.params.id;
  const { status, comments } = req.body;
  const leave = await staffActivityModel.reviewLeaveRequest(
    leaveId,
    status,
    comments || null,
    req.user.staff_id
  );
  return ok(res, { leave }, `Leave request ${status} successfully`);
});

/**
 * @desc    List all staff tasks in the school
 * @route   GET /api/school-admin/tasks
 * @access  Private (school_admin)
 */
const listSchoolTasks = asyncHandler(async (req, res) => {
  const tasks = await staffActivityModel.listSchoolTasks(req.user.school_id);
  return ok(res, { tasks }, 'School staff tasks retrieved successfully');
});

/**
 * @desc    Delete an assigned staff task
 * @route   DELETE /api/school-admin/tasks/:id
 * @access  Private (school_admin)
 */
const deleteStaffTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  await staffActivityModel.deleteStaffTask(taskId, req.user.school_id);
  return ok(res, null, 'Task deleted successfully');
});

export {
  assignTaskToStaff,
  changeMyPassword,
  createStaff,
  deleteStaffTask,
  getMyProfile,
  getStaff,
  getStaffAttendance,
  getStaffDashboardStats,
  getStaffLeaves,
  getStaffSchedule,
  getStaffTasks,
  listSchoolLeaveRequests,
  listSchoolTasks,
  listStaff,
  requestLeave,
  reviewLeaveRequest,
  toggleClockStatus,
  updateMyAvatar,
  updateMyProfile,
  updateStaffStatus,
  updateTaskStatus,
};
