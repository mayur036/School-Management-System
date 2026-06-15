import { Router } from 'express';

import {
  forgotPassword,
  getMe,
  login,
  logout,
  resetPassword,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from '../schema/auth.schema.js';

const router = Router();

// Auth rate limiter: 10 attempts per 15 minutes per IP
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post(
  '/forgot-password',
  authLimiter,
  validate(forgotPasswordSchema),
  forgotPassword
);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export default router;
