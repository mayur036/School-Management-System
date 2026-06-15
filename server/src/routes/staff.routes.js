import { Router } from 'express';

import {
  changeMyPassword,
  createStaff,
  getMyProfile,
  getStaff,
  getStaffAttendance,
  getStaffDashboardStats,
  getStaffLeaves,
  getStaffSchedule,
  getStaffTasks,
  listStaff,
  requestLeave,
  toggleClockStatus,
  updateMyAvatar,
  updateMyProfile,
  updateStaffStatus,
  updateTaskStatus,
} from '../controllers/staff.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { uploadAvatar } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import {
  changePasswordSchema,
  clockInOutSchema,
  createStaffSchema,
  leaveRequestSchema,
  staffIdSchema,
  updateProfileSchema,
  updateStaffStatusSchema,
  updateTaskStatusSchema,
} from '../schema/staff.schema.js';

const router = Router();

router.get('/me', protect, getMyProfile);
router.patch('/me', protect, validate(updateProfileSchema), updateMyProfile);
router.patch(
  '/me/password',
  protect,
  validate(changePasswordSchema),
  changeMyPassword
);
router.patch(
  '/me/avatar',
  protect,
  uploadLimiter,
  uploadAvatar,
  updateMyAvatar
);

// Staff Portal endpoints (accessible to staff role only)
router.get(
  '/me/dashboard-stats',
  protect,
  authorize('staff'),
  getStaffDashboardStats
);
router.get('/me/schedule', protect, authorize('staff'), getStaffSchedule);
router.get('/me/attendance', protect, authorize('staff'), getStaffAttendance);
router.post(
  '/me/attendance/clock',
  protect,
  authorize('staff'),
  validate(clockInOutSchema),
  toggleClockStatus
);
router.get('/me/leaves', protect, authorize('staff'), getStaffLeaves);
router.post(
  '/me/leaves',
  protect,
  authorize('staff'),
  validate(leaveRequestSchema),
  requestLeave
);
router.get('/me/tasks', protect, authorize('staff'), getStaffTasks);
router.patch(
  '/me/tasks/:id/status',
  protect,
  authorize('staff'),
  validate(updateTaskStatusSchema),
  updateTaskStatus
);

// Everything below is school_admin only, scoped to their own school.
router.use(protect, authorize('school_admin'));

router.route('/').post(validate(createStaffSchema), createStaff).get(listStaff);

router.get('/:id', validate(staffIdSchema), getStaff);

router.patch(
  '/:id/status',
  validate(updateStaffStatusSchema),
  updateStaffStatus
);

export default router;
