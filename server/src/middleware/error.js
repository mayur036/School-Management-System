import { isProduction } from '../config/env.js';

/**
 * Throwable error that carries an HTTP status code.
 * Usage: throw new ApiError(404, 'School not found')
 */
export class ApiError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

/** 404 handler for unmatched routes. */
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

/** Central error handler. Must be the last middleware mounted. */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ?? 500;
  const payload = {
    success: false,
    message: err.message ?? 'Internal Server Error',
  };

  if (err.details) payload.details = err.details;
  if (!isProduction && statusCode >= 500) payload.stack = err.stack;

  if (statusCode >= 500) console.error(err);

  console.log(payload.message);

  res.status(statusCode).json(payload);
};
