import { env } from '../config/env.js';
import { sendEmail } from '../config/mailer.js';
import { ApiError } from '../middleware/error.js';
import schoolModel from '../models/school.model.js';
import { welcomeEmailTemplate } from '../templates/welcomeEmailTemplate.js';
import { asyncHandler, created, ok } from '../utils/apiResponse.js';
import { hashPassword } from '../utils/password.js';

/**
 * @desc    Create a school
 * @route   POST /api/schools
 * @access  Private (super_admin)
 */
const createSchool = asyncHandler(async (req, res) => {
  const { name, code, email, phone, address } = req.body;

  const existing = await schoolModel.getSchoolByEmail(email);
  if (existing) {
    throw new ApiError(400, 'A school with this email already exists');
  }

  const school = await schoolModel.createSchool({
    name,
    code: code ?? null,
    email: email ?? null,
    phone: phone ?? null,
    address: address ?? null,
    createdBy: req.user.staff_id,
  });

  return created(res, { school }, 'School created successfully');
});

/**
 * @desc    List all schools
 * @route   GET /api/schools
 * @access  Private (super_admin)
 */
const listSchools = asyncHandler(async (req, res) => {
  const { search, status, sort_by, sort_order } = req.query;
  const schools = await schoolModel.listSchools(
    search,
    status,
    sort_by,
    sort_order
  );
  return ok(res, { schools }, 'Schools retrieved successfully');
});

/**
 * @desc    Get a single school by id
 * @route   GET /api/schools/:id
 * @access  Private (super_admin)
 */
const getSchool = asyncHandler(async (req, res) => {
  const school = await schoolModel.getSchool(req.params.id);
  if (!school) {
    throw new ApiError(404, 'School not found');
  }
  return ok(res, { school }, 'School retrieved successfully');
});

/**
 * @desc    Activate / deactivate a school
 * @route   PATCH /api/schools/:id/status
 * @access  Private (super_admin)
 */
const updateSchoolStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const existing = await schoolModel.getSchool(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'School not found');
  }

  const school = await schoolModel.updateSchoolStatus(req.params.id, status);
  return ok(
    res,
    { school },
    `School ${status === 'active' ? 'activated' : 'deactivated'} successfully`
  );
});

/**
 * @desc    Create a school admin (school_admin staff row) for a school
 * @route   POST /api/schools/:id/admins
 * @access  Private (super_admin)
 */
const createSchoolAdmin = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, password, phone } = req.body;

  const school = await schoolModel.getSchool(req.params.id);
  if (!school) {
    throw new ApiError(404, 'School not found');
  }

  const passwordHash = await hashPassword(password);

  const admin = await schoolModel.createSchoolAdmin({
    schoolId: req.params.id,
    firstName: first_name,
    lastName: last_name,
    email,
    passwordHash,
    phone: phone ?? null,
    createdBy: req.user.staff_id,
  });

  // Async email dispatch (fire-and-forget)
  sendEmail({
    to: email,
    subject: 'Welcome to CampusCore - Your Admin Credentials',
    html: welcomeEmailTemplate({
      name: `${first_name} ${last_name}`,
      email,
      password, // Raw password
      roleName: 'School Admin',
      loginUrl: `${env.client.url}/login`,
    }),
  }).catch((err) => console.error('Failed to send welcome email:', err));

  return created(res, { admin }, 'School admin created successfully');
});

/**
 * @desc    Get operational details of current admin's school
 * @route   GET /api/school-admin/settings/school
 * @access  Private (school_admin)
 */
const getSchoolDetails = asyncHandler(async (req, res) => {
  const schoolId = req.user.school_id;
  const school = await schoolModel.getSchool(schoolId);
  if (!school) {
    throw new ApiError(404, 'School not found');
  }
  return ok(res, { school }, 'School details retrieved successfully');
});

/**
 * @desc    Update operational details of current admin's school
 * @route   PUT /api/school-admin/settings/school
 * @access  Private (school_admin)
 */
const updateSchoolDetails = asyncHandler(async (req, res) => {
  const schoolId = req.user.school_id;
  const { name, email, phone, address } = req.body;

  const school = await schoolModel.updateSchool(schoolId, {
    name,
    email,
    phone,
    address,
  });

  return ok(res, { school }, 'School profile updated successfully');
});

/**
 * @desc    Super admin full update of a school
 * @route   PUT /api/schools/:id
 * @access  Private (super_admin)
 */
const updateSchoolBySuper = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, code, email, phone, address, status } = req.body;

  const existing = await schoolModel.getSchool(id);
  if (!existing) {
    throw new ApiError(404, 'School not found');
  }

  const school = await schoolModel.updateSchoolBySuper(id, {
    name,
    code,
    email,
    phone,
    address,
    status,
  });

  return ok(res, { school }, 'School details updated successfully');
});

export {
  createSchool,
  createSchoolAdmin,
  getSchool,
  getSchoolDetails,
  listSchools,
  updateSchoolBySuper,
  updateSchoolDetails,
  updateSchoolStatus,
};
