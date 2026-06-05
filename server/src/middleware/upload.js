import multer from 'multer';

import { ApiError } from './error.js';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * In-memory upload for avatar images. The buffer is streamed straight to
 * Cloudinary (utils/cloudinary.js) — nothing touches the local disk.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) return cb(null, true);
    cb(new ApiError(400, 'Only JPEG, PNG, or WEBP images are allowed'));
  },
});

/**
 * Single-file avatar upload guard. Wraps multer so its errors (e.g. file
 * too large) surface through the central error handler as clean 400s.
 */
export const uploadAvatar = (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'Image must be 2 MB or smaller'
          : err.message;
      return next(new ApiError(400, message));
    }
    if (err) return next(err);
    next();
  });
};
