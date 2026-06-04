/** Standard success envelope. */
export const ok = (res, data = null, message = 'Success', status = 200) =>
  res.status(status).json({ success: true, message, data });

/** 201 Created shortcut. */
export const created = (res, data = null, message = 'Created') =>
  ok(res, data, message, 201);

/**
 * Wrap an async route handler so thrown/rejected errors are forwarded
 * to the central error handler instead of crashing the process.
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
