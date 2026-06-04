import app from './src/app.js';
import { env } from './src/config/env.js';

const server = app.listen(env.port, () => {
  console.log(
    `🚀 Server running on http://localhost:${env.port} [${env.nodeEnv}]`
  );
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n${signal} received — shutting down...`);
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
