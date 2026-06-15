import { Router } from 'express';

import {
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
} from '../controllers/schedule.controller.js';
import {
  assignTaskToStaff,
  deleteStaffTask,
  listSchoolLeaveRequests,
  listSchoolTasks,
  reviewLeaveRequest,
} from '../controllers/staff.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  bulkCreateScheduleSchema,
  createPeriodSchema,
  createScheduleSchema,
  periodIdSchema,
  scheduleIdSchema,
  updatePeriodSchema,
  updateScheduleSchema,
  updateWorkingDaysSchema,
} from '../schema/schedule.schema.js';
import {
  assignTaskSchema,
  reviewLeaveSchema,
  staffIdSchema,
} from '../schema/staff.schema.js';

const router = Router();

// Protect all routes below and restrict them to school_admin
router.use(protect, authorize('school_admin'));

// Timetable periods management
router
  .route('/schedules/periods')
  .get(listPeriods)
  .post(validate(createPeriodSchema), createPeriod);

router
  .route('/schedules/periods/:id')
  .put(validate(updatePeriodSchema), updatePeriod)
  .delete(validate(periodIdSchema), deletePeriod);

// Timetable settings (working days)
router.route('/schedules/settings').get(getSchoolSettings);
router
  .route('/schedules/settings/working-days')
  .put(validate(updateWorkingDaysSchema), updateWorkingDays);

// Timetable schedules management
router
  .route('/schedules')
  .get(listSchoolSchedules)
  .post(validate(createScheduleSchema), createSchedule);

router
  .route('/schedules/bulk')
  .post(validate(bulkCreateScheduleSchema), bulkCreateSchedules);

router
  .route('/schedules/:id')
  .put(validate(updateScheduleSchema), updateSchedule)
  .delete(validate(scheduleIdSchema), deleteSchedule);

// Tasks management
router
  .route('/tasks')
  .get(listSchoolTasks)
  .post(validate(assignTaskSchema), assignTaskToStaff);

router.route('/tasks/:id').delete(validate(staffIdSchema), deleteStaffTask);

// Leaves management
router.route('/leaves').get(listSchoolLeaveRequests);

router
  .route('/leaves/:id')
  .patch(validate(reviewLeaveSchema), reviewLeaveRequest);

export default router;
