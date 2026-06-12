import { Router } from 'express';

import {
  assignTaskToStaff,
  createStaffSchedule,
  deleteStaffSchedule,
  deleteStaffTask,
  listSchoolLeaveRequests,
  listSchoolSchedules,
  listSchoolTasks,
  reviewLeaveRequest,
} from '../controllers/staff.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  assignTaskSchema,
  createScheduleSchema,
  reviewLeaveSchema,
  staffIdSchema,
} from '../schema/staff.schema.js';

const router = Router();

// Protect all routes below and restrict them to school_admin
router.use(protect, authorize('school_admin'));

// Timetable schedules management
router
  .route('/schedules')
  .get(listSchoolSchedules)
  .post(validate(createScheduleSchema), createStaffSchedule);

router
  .route('/schedules/:id')
  .delete(validate(staffIdSchema), deleteStaffSchedule);

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
