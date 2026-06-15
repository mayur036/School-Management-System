import { ApiError } from '../middleware/error.js';
import scheduleModel from '../models/schedule.model.js';
import { asyncHandler, created, ok } from '../utils/apiResponse.js';

// ============================================================
// SCHOOL PERIODS
// ============================================================

/**
 * @desc    Create a school period
 * @route   POST /api/schedules/periods
 * @access  Private (school_admin)
 */
const createPeriod = asyncHandler(async (req, res) => {
  const { period_name, period_order, start_time, end_time, is_break } =
    req.body;
  const schoolId = req.user.school_id;

  const period = await scheduleModel.createSchoolPeriod(
    schoolId,
    period_name,
    period_order,
    start_time,
    end_time,
    is_break
  );

  return created(res, { period }, 'Period created successfully');
});

/**
 * @desc    List all school periods
 * @route   GET /api/schedules/periods
 * @access  Private (school_admin, staff)
 */
const listPeriods = asyncHandler(async (req, res) => {
  const schoolId = req.user.school_id;
  const periods = await scheduleModel.listSchoolPeriods(schoolId);

  return ok(res, { periods }, 'Periods retrieved successfully');
});

/**
 * @desc    Update a school period
 * @route   PUT /api/schedules/periods/:id
 * @access  Private (school_admin)
 */
const updatePeriod = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { period_name, period_order, start_time, end_time, is_break } =
    req.body;
  const schoolId = req.user.school_id;

  const period = await scheduleModel.updateSchoolPeriod(
    id,
    schoolId,
    period_name,
    period_order,
    start_time,
    end_time,
    is_break
  );

  if (!period) {
    throw new ApiError(
      404,
      'Period not found or does not belong to your school'
    );
  }

  return ok(res, { period }, 'Period updated successfully');
});

/**
 * @desc    Delete a school period
 * @route   DELETE /api/schedules/periods/:id
 * @access  Private (school_admin)
 */
const deletePeriod = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const schoolId = req.user.school_id;

  await scheduleModel.deleteSchoolPeriod(id, schoolId);

  return ok(res, null, 'Period deleted successfully');
});

// ============================================================
// SCHOOL SETTINGS (working days)
// ============================================================

/**
 * @desc    Update school working days
 * @route   PUT /api/schedules/settings/working-days
 * @access  Private (school_admin)
 */
const updateWorkingDays = asyncHandler(async (req, res) => {
  const { working_days } = req.body;
  const schoolId = req.user.school_id;

  const settings = await scheduleModel.updateWorkingDays(
    schoolId,
    working_days
  );

  return ok(res, { settings }, 'Working days updated successfully');
});

/**
 * @desc    Get school timetable settings
 * @route   GET /api/schedules/settings
 * @access  Private (school_admin, staff)
 */
const getSchoolSettings = asyncHandler(async (req, res) => {
  const schoolId = req.user.school_id;
  const settings = await scheduleModel.getSchoolSettings(schoolId);

  if (!settings) {
    throw new ApiError(404, 'School settings not found');
  }

  return ok(res, { settings }, 'School settings retrieved successfully');
});

// ============================================================
// STAFF SCHEDULES
// ============================================================

/**
 * @desc    Create a timetable schedule entry
 * @route   POST /api/schedules
 * @access  Private (school_admin)
 */
const createSchedule = asyncHandler(async (req, res) => {
  const { staff_id, period_id, subject_name, class_name, day_of_week, room } =
    req.body;
  const schoolId = req.user.school_id;

  const schedule = await scheduleModel.createStaffSchedule(
    schoolId,
    staff_id,
    period_id,
    subject_name,
    class_name,
    day_of_week,
    room
  );

  return created(res, { schedule }, 'Schedule entry created successfully');
});

/**
 * @desc    Update a timetable schedule entry
 * @route   PUT /api/schedules/:id
 * @access  Private (school_admin)
 */
const updateSchedule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { staff_id, period_id, subject_name, class_name, day_of_week, room } =
    req.body;
  const schoolId = req.user.school_id;

  const schedule = await scheduleModel.updateStaffSchedule(
    schoolId,
    id,
    staff_id,
    period_id,
    subject_name,
    class_name,
    day_of_week,
    room
  );

  if (!schedule) {
    throw new ApiError(
      404,
      'Schedule entry not found or does not belong to your school'
    );
  }

  return ok(res, { schedule }, 'Schedule entry updated successfully');
});

/**
 * @desc    List all schedules in school, optionally filtered by staff
 * @route   GET /api/schedules
 * @access  Private (school_admin)
 */
const listSchoolSchedules = asyncHandler(async (req, res) => {
  const schoolId = req.user.school_id;
  const staffIdQuery = req.query.staff_id;
  const staffId = staffIdQuery ? parseInt(staffIdQuery, 10) : null;

  const schedules = await scheduleModel.listSchoolSchedules(schoolId, staffId);

  return ok(res, { schedules }, 'Schedules retrieved successfully');
});

/**
 * @desc    Delete a timetable schedule entry
 * @route   DELETE /api/schedules/:id
 * @access  Private (school_admin)
 */
const deleteSchedule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const schoolId = req.user.school_id;

  await scheduleModel.deleteStaffSchedule(id, schoolId);

  return ok(res, null, 'Schedule entry deleted successfully');
});

/**
 * @desc    Bulk create timetable schedule entries for a staff member
 * @route   POST /api/schedules/bulk
 * @access  Private (school_admin)
 */
const bulkCreateSchedules = asyncHandler(async (req, res) => {
  const { staff_id, entries } = req.body;
  const schoolId = req.user.school_id;

  const entriesJson = JSON.stringify(entries);

  const schedules = await scheduleModel.bulkCreateStaffSchedules(
    schoolId,
    staff_id,
    entriesJson
  );

  return created(
    res,
    { schedules },
    `Successfully created ${schedules.length ? schedules[0].total_inserted : 0} schedule entries`
  );
});

export {
  bulkCreateSchedules,
  createPeriod,
  createSchedule,
  deletePeriod,
  deleteSchedule,
  getSchoolSettings,
  listPeriods,
  listSchoolSchedules,
  updatePeriod,
  updateSchedule,
  updateWorkingDays,
};
