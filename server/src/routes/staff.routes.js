import { Router } from 'express';

import {
  createStaff,
  getStaff,
  listStaff,
  updateStaffStatus,
} from '../controllers/staff.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  createStaffSchema,
  staffIdSchema,
  updateStaffStatusSchema,
} from '../schema/staff.schema.js';

const router = Router();

// Every staff route is school_admin only, scoped to their own school.
router.use(protect, authorize('school_admin'));

router
  .route('/')
  .post(validate(createStaffSchema), createStaff)
  .get(listStaff);

router.get('/:id', validate(staffIdSchema), getStaff);

router.patch(
  '/:id/status',
  validate(updateStaffStatusSchema),
  updateStaffStatus
);

export default router;
