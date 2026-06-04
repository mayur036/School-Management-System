import { verifyToken } from '../utils/jwt.js';
import { ApiError } from './error.js';

/**
 * Middleware to protect routes and verify JWT.
 * Decoded user payload is attached to req.user.
 */
export const protect = (req, res, next) => {
  let token;

  // 1. Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Check cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized, no token provided'));
  }

  try {
    const decoded = verifyToken(token);
    // Attach decoded user claims (staff_id, role_name, school_id, department_id, etc.)
    req.user = decoded;
    next();
  } catch {
    return next(new ApiError(401, 'Not authorized, token failed or expired'));
  }
};
