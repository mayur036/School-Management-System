import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { isProduction } from './config/env.js';
import { setupSwagger } from './config/swagger.js';
import { errorHandler, notFound } from './middleware/error.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { sanitize } from './middleware/sanitize.js';
import apiRoutes from './routes.js';

const app = express();

// ── Security headers ───────────────────────────────────────────
// Helmet sets secure HTTP headers (X-Content-Type-Options,
// X-Frame-Options, Strict-Transport-Security, etc.)
app.use(
  helmet({
    // Allow Swagger UI to load its own styles/scripts
    contentSecurityPolicy: isProduction
      ? undefined // use default strict CSP in production
      : false, // disable CSP in development (Swagger UI needs inline scripts)
    crossOriginEmbedderPolicy: false, // allow cross-origin images (Cloudinary avatars)
  })
);

// ── CORS ───────────────────────────────────────────────────────
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);

// ── Body parsing ───────────────────────────────────────────────
app.use(express.json({ limit: '1mb' })); // limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// ── Input sanitization ────────────────────────────────────────
// Strips HTML tags and encodes dangerous characters from
// req.body, req.query, req.params (runs before routes)
app.use(sanitize);

// ── Logging ────────────────────────────────────────────────────
if (!isProduction) app.use(morgan('dev'));

// ── Rate limiting ──────────────────────────────────────────────
// Global rate limit: 100 requests per 15 minutes per IP
app.use('/api', globalLimiter);

// ── Swagger API Documentation ──────────────────────────────────
setupSwagger(app);

// ── Health check ───────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok', uptime: process.uptime() });
});

// ── API routes ─────────────────────────────────────────────────
app.use('/api', apiRoutes);

// ── 404 + error handling (must be last) ────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
