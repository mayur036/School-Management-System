import { Router } from 'express';

import {
  forgotPassword,
  getMe,
  login,
  logout,
  resetPassword,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from '../schema/auth.schema.js';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export default router;
