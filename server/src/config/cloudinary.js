import { v2 as cloudinary } from 'cloudinary';

import { env } from './env.js';

// Configure the Cloudinary SDK once from env. Credentials live in .env
// (CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET) and are never committed.
cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true,
});

export { cloudinary };
