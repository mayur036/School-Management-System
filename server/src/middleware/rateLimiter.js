import rateLimit from 'express-rate-limit';

/**
 * Rate limiters for the School Management System API.
 *
 * Three tiers:
 *  1. globalLimiter  — applies to ALL /api routes (generous ceiling)
 *  2. authLimiter    — applies to login + forgot-password (strict)
 *  3. uploadLimiter  — applies to avatar upload endpoint
 *
 * In production, use a proper store (Redis) instead of the default
 * in-memory store so limits survive restarts and work across replicas.
 */

/**
 * Global API rate limiter.
 * 100 requests per 15 minutes per IP — protects against general abuse.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true, // RateLimit-* headers (draft-6)
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    success: false,
    message: 'Too many requests, please try again after 15 minutes',
  },
});

/**
 * Strict rate limiter for authentication endpoints.
 * 5 attempts per 15 minutes per IP — prevents brute-force login and
 * email enumeration via forgot-password.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes',
  },
  // Skip rate limiting for successful requests (only count failures)
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for file upload endpoints.
 * 5 uploads per 15 minutes per IP — prevents Cloudinary abuse.
 */
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many upload attempts, please try again after 15 minutes',
  },
});
