import { Router } from 'express';

import {
  createSchool,
  createSchoolAdmin,
  getSchool,
  listSchools,
  updateSchoolBySuper,
  updateSchoolStatus,
} from '../controllers/school.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  createSchoolAdminSchema,
  createSchoolSchema,
  schoolIdSchema,
  updateSchoolBySuperSchema,
  updateSchoolStatusSchema,
} from '../schema/school.schema.js';

const router = Router();

router.use(protect, authorize('super_admin'));

router
  .route('/')
  .post(validate(createSchoolSchema), createSchool)
  .get(listSchools);

router
  .route('/:id')
  .get(validate(schoolIdSchema), getSchool)
  .put(validate(updateSchoolBySuperSchema), updateSchoolBySuper);

router.patch(
  '/:id/status',
  validate(updateSchoolStatusSchema),
  updateSchoolStatus
);

router.post(
  '/:id/admins',
  validate(createSchoolAdminSchema),
  createSchoolAdmin
);

export default router;
