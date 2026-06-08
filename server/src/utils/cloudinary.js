import { cloudinary } from '../config/cloudinary.js';
import { ApiError } from '../middleware/error.js';

const AVATAR_FOLDER = 'school-management/avatars';

/**
 * Upload an image buffer (from multer memoryStorage) to Cloudinary.
 * Uses upload_stream so we never write the file to disk.
 *
 * @param {Buffer} buffer  the raw image bytes (req.file.buffer)
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export const uploadAvatar = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: AVATAR_FOLDER,
        resource_type: 'image',
        // Normalize to a square face-cropped thumbnail to keep avatars tidy.
        transformation: [
          { width: 512, height: 512, crop: 'fill', gravity: 'face' },
        ],
      },
      (error, result) => {
        if (error) reject(new ApiError(500, 'Avatar upload failed'));
        else resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });

/**
 * Best-effort delete of a previously uploaded avatar. Never throws — a
 * failed cleanup of an orphaned image must not fail the request.
 */
export const destroyImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // Orphaned image; safe to ignore.
  }
};
