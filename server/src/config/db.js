import mysql from 'mysql2/promise';

import { env } from './env.js';

/**
 * Shared MySQL connection pool. All queries go through stored
 * procedures via utils/callProcedure.js — no inline SQL in app code.
 */
export const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4_unicode_ci',
});

/** Ping the DB once at startup so we fail fast on bad credentials. */
export const verifyDbConnection = async () => {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
  } finally {
    conn.release();
  }
};
