import { Router } from 'express';

import {
  deleteSchoolAdmin,
  listAllSchoolAdmins,
  updateSchoolAdminStatus,
} from '../controllers/schoolAdminManager.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  staffIdSchema,
  updateStaffStatusSchema,
} from '../schema/staff.schema.js';

const router = Router();

// Protect all routes and allow only super_admin
router.use(protect, authorize('super_admin'));

router.route('/').get(listAllSchoolAdmins);

router.patch(
  '/:id/status',
  validate(updateStaffStatusSchema),
  updateSchoolAdminStatus
);

router.delete('/:id', validate(staffIdSchema), deleteSchoolAdmin);

export default router;
