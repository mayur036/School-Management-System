import app from './src/app.js';
import { pool, verifyDbConnection } from './src/config/db.js';
import { env } from './src/config/env.js';

let server;

const start = async () => {
  try {
    await verifyDbConnection();
    console.log('Database connected ' + `${env.nodeEnv}`);
  } catch (err) {
    console.error('Database connection failed:' + `${err.message}`);
    process.exit(1);
  }

  server = app.listen(env.port, () => {
    console.log(
      `Server running on http://localhost:${env.port} [${env.nodeEnv}]`
    );
  });
};

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n${signal} received — shutting down...`);
  if (server) server.close();
  await pool.end();
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
