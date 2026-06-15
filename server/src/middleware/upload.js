import multer from 'multer';

import { ApiError } from './error.js';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Magic bytes (file signatures) for allowed image formats.
 * MIME types from the client can be spoofed — this verifies the
 * actual file content matches a real image header.
 */
const MAGIC_BYTES = {
  'image/jpeg': [
    [0xff, 0xd8, 0xff], // JPEG/JFIF
  ],
  'image/png': [
    [0x89, 0x50, 0x4e, 0x47], // PNG
  ],
  'image/webp': [
    // RIFF....WEBP (bytes 0-3 = RIFF, bytes 8-11 = WEBP)
    [0x52, 0x49, 0x46, 0x46],
  ],
};

/**
 * Validate that the file buffer starts with magic bytes matching
 * its claimed MIME type. Returns false if the bytes don't match,
 * meaning the file extension/mime was spoofed.
 */
const validateMagicBytes = (buffer, mimetype) => {
  if (!buffer || buffer.length < 12) return false;

  const signatures = MAGIC_BYTES[mimetype];
  if (!signatures) return false;

  for (const sig of signatures) {
    const matches = sig.every((byte, index) => buffer[index] === byte);
    if (matches) {
      // Extra check for WebP: bytes 8-11 must be "WEBP"
      if (mimetype === 'image/webp') {
        const webpTag = buffer.slice(8, 12).toString('ascii');
        return webpTag === 'WEBP';
      }
      return true;
    }
  }

  return false;
};

/**
 * In-memory upload for avatar images. The buffer is streamed straight to
 * Cloudinary (utils/cloudinary.js) — nothing touches the local disk.
 *
 * Validation layers:
 *  1. MIME type check (fileFilter) — blocks non-image uploads early
 *  2. File size limit (2 MB)
 *  3. Magic bytes verification (post-upload) — prevents spoofed extensions
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1, // only one file per request
    fields: 5, // limit number of non-file fields
  },
  fileFilter: (req, file, cb) => {
    // Layer 1: Check declared MIME type
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      return cb(
        new ApiError(400, 'Only JPEG, PNG, or WEBP images are allowed')
      );
    }

    // Block suspicious original filenames
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    if (!ext || !allowedExtensions.includes(ext)) {
      return cb(
        new ApiError(400, 'File extension must be .jpg, .jpeg, .png, or .webp')
      );
    }

    cb(null, true);
  },
});

/**
 * Single-file avatar upload guard. Wraps multer so its errors (e.g. file
 * too large) surface through the central error handler as clean 400s.
 *
 * After multer processes the file, we verify the actual buffer contents
 * match a real image (magic bytes check) to prevent spoofed uploads.
 */
export const uploadAvatar = (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'Image must be 2 MB or smaller'
          : err.code === 'LIMIT_FILE_COUNT'
            ? 'Only one file can be uploaded at a time'
            : err.message;
      return next(new ApiError(400, message));
    }
    if (err) return next(err);

    // Layer 3: Validate magic bytes of the actual buffer
    if (req.file) {
      if (!validateMagicBytes(req.file.buffer, req.file.mimetype)) {
        return next(
          new ApiError(
            400,
            'File content does not match a valid image format. Upload a real JPEG, PNG, or WEBP image.'
          )
        );
      }
    }

    next();
  });
};
