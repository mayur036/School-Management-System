import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { isProduction } from './config/env.js';
import { errorHandler, notFound } from './middleware/error.js';
import apiRoutes from './routes.js';

const app = express();

// Core middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (!isProduction) app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok', uptime: process.uptime() });
});

// API routes
app.use('/api', apiRoutes);

// 404 + error handling (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
