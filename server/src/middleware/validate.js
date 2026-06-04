import { ApiError } from './error.js';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    const details = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    next(new ApiError(400, 'Validation failed', details));
  }
};
