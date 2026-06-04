import { Router } from 'express';

const router = Router();

// Feature routers are mounted here as they are built (Phase 3+):
//   router.use('/auth', authRoutes);
//   router.use('/schools', schoolRoutes);
//   router.use('/departments', departmentRoutes);
//   router.use('/staff', staffRoutes);

router.get('/', (req, res) => {
  res.json({ success: true, message: 'School Management System API' });
});

export default router;
