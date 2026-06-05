import { isProduction } from '../config/env.js';

export class ApiError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
export const errorHandler = (err, req, res, next) => {
  void next;
  if (err.code === 'ER_DUP_ENTRY') {
    err.statusCode = 409;
    err.message = 'A record with these details already exists';
  }

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
