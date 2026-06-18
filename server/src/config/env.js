import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const required = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  server: {
    port: Number(process.env.PORT ?? 5000),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    url: process.env.SERVER_URL,
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
    additionalUrls: process.env.ADDITIONAL_SERVER_URLS,
    ipAddress: process.env.IP_ADDRESS,
  },

  db: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: Number(process.env.DATABASE_PORT ?? 3306),
    user: process.env.DATABASE_USER ?? 'root',
    password: process.env.DATABASE_PASSWORD ?? '',
    name: process.env.DATABASE_NAME ?? 'school_management_system',
  },

  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },

  cloudinary: {
    cloudName: required('CLOUDINARY_CLOUD_NAME'),
    apiKey: required('CLOUDINARY_API_KEY'),
    apiSecret: required('CLOUDINARY_API_SECRET'),
  },

  google: {
    clientId: required('GOOGLE_CLIENT_ID'),
  },

  client: {
    url: process.env.CLIENT_URL,
  },

  email: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM,
  },
};

export const isProduction = env.server.isProd;
