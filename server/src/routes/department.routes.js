import { Router } from 'express';

import {
  createDepartment,
  listDepartments,
} from '../controllers/department.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { createDepartmentSchema } from '../schema/department.schema.js';

const router = Router();

// Every department route is school_admin only, scoped to their own school.
router.use(protect, authorize('school_admin'));

router
  .route('/')
  .post(validate(createDepartmentSchema), createDepartment)
  .get(listDepartments);

export default router;
