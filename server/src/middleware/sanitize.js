import { ApiError } from './error.js';

/**
 * Recursively sanitize all string values in an object to prevent XSS attacks.
 * Strips HTML tags and encodes dangerous characters in req.body, req.query, req.params.
 *
 * Applied as global middleware — runs BEFORE Zod validation so schemas
 * receive clean input.
 */

/**
 * Strip HTML tags from a string and encode dangerous characters.
 * Preserves safe characters (letters, numbers, spaces, punctuation).
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;

  return (
    str
      // Remove HTML/script tags entirely
      .replace(/<[^>]*>/g, '')
      // Encode dangerous characters that could be used for XSS
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Remove null bytes
      .replace(/\0/g, '')
  );
};

/**
 * Recursively walk through an object/array and sanitize all string values.
 * Handles nested objects and arrays.
 */
const sanitizeDeep = (value) => {
  if (typeof value === 'string') {
    return sanitizeString(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeDeep);
  }

  if (value !== null && typeof value === 'object') {
    const sanitized = {};
    for (const [key, val] of Object.entries(value)) {
      sanitized[key] = sanitizeDeep(val);
    }
    return sanitized;
  }

  return value;
};

// Fields that should NEVER be sanitized (they contain hashes, tokens, etc.)
const SKIP_FIELDS = new Set([
  'password',
  'current_password',
  'new_password',
  'token',
  'reset_token',
  'password_hash',
]);

/**
 * Sanitize an object but skip sensitive fields (passwords, tokens).
 */
const sanitizeWithSkip = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized = {};
  for (const [key, val] of Object.entries(obj)) {
    if (SKIP_FIELDS.has(key)) {
      sanitized[key] = val; // pass through unchanged
    } else {
      sanitized[key] = sanitizeDeep(val);
    }
  }
  return sanitized;
};

/**
 * Express middleware that sanitizes req.body, req.query, and req.params
 * to strip HTML tags and encode dangerous characters.
 *
 * Usage: app.use(sanitize);  // mount globally before routes
 *
 * Rejects requests that contain `<script` anywhere in the raw body
 * as a fast-path XSS block (returns 400).
 */
export const sanitize = (req, res, next) => {
  try {
    // Fast-path: reject any request body that contains <script tags
    if (req.body && typeof req.body === 'object') {
      const bodyStr = JSON.stringify(req.body);
      if (/<script/i.test(bodyStr)) {
        throw new ApiError(
          400,
          'Request contains potentially dangerous content'
        );
      }
    }

    // Sanitize all input sources
    if (req.body) {
      req.body = sanitizeWithSkip(req.body);
    }

    if (req.query) {
      const sanitizedQuery = sanitizeDeep(req.query);
      Object.defineProperty(req, 'query', {
        value: sanitizedQuery,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }

    if (req.params) {
      const sanitizedParams = sanitizeDeep(req.params);
      try {
        req.params = sanitizedParams;
      } catch {
        Object.defineProperty(req, 'params', {
          value: sanitizedParams,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};
