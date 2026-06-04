import { ApiError } from './error.js';

/**
 * Middleware to restrict access to specific roles.
 * Must be used after protect middleware.
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role_name)) {
      return next(
        new ApiError(
          403,
          'Forbidden: You do not have permission to perform this action'
        )
      );
    }
    next();
  };
};
