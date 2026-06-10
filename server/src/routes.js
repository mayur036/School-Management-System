import { Router } from 'express';

import authRoutes from './routes/auth.routes.js';
import departmentRoutes from './routes/department.routes.js';
import schoolRoutes from './routes/school.routes.js';
import schoolAdminManagerRoutes from './routes/schoolAdminManager.routes.js';
import staffRoutes from './routes/staff.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/schools', schoolRoutes);
router.use('/school-admins', schoolAdminManagerRoutes);
router.use('/departments', departmentRoutes);
router.use('/staff', staffRoutes);

router.get('/', (req, res) => {
  res.json({ success: true, message: 'School Management System API' });
});

export default router;
