import app from '../src/app.js';
import pool from '../src/config/db.js';

// Pre-warm database pool (non-blocking)
pool.getConnection().catch((err) => {
  console.error(
    '[Vercel Startup] Database connection pre-warm failed:',
    err.message
  );
});

export default app;
