import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';

/**
 * Sign a JWT for an authenticated user.
 * Payload carries the claims used for authorization + tenant scoping.
 */
export const signToken = (payload) =>
  jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

/** Verify and decode a JWT. Throws if invalid/expired. */
export const verifyToken = (token) => jwt.verify(token, env.jwt.secret);
