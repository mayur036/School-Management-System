import { Router } from 'express';

import {
  changeMyPassword,
  createStaff,
  getMyProfile,
  getStaff,
  listStaff,
  updateStaffStatus,
} from '../controllers/staff.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  changePasswordSchema,
  createStaffSchema,
  staffIdSchema,
  updateStaffStatusSchema,
} from '../schema/staff.schema.js';

const router = Router();

// /me is available to ANY authenticated user (Phase 6). It must be declared
// before the school_admin guard (so staff aren't blocked) and before /:id
// (so 'me' isn't captured as an id param).
router.get('/me', protect, getMyProfile);
router.patch(
  '/me/password',
  protect,
  validate(changePasswordSchema),
  changeMyPassword
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
