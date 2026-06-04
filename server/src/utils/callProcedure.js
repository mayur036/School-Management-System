import { pool } from '../config/db.js';

/**
 * Global stored-procedure caller.
 *
 * Builds `CALL <name>(?, ?, ...)` from the params array and executes it.
 * mysql2 returns CALL results as `[ [resultSet], okPacket ]`, so we return
 * the first result set (the rows your SELECT produced).
 *
 * @param {string} name    stored procedure name, e.g. 'sp_list_schools'
 * @param {Array}  params  ordered params to pass to the procedure
 * @returns {Promise<Array>} rows from the procedure's result set
 *
 * @example
 *   const schools = await callProcedure('sp_list_schools');
 *   const [user]  = await callProcedure('sp_login_get_user', [email]);
 */
export const callProcedure = async (name, params = []) => {
  const placeholders = params.map(() => '?').join(', ');
  const sql = `CALL ${name}(${placeholders})`;

  const [resultSets] = await pool.query(sql, params);

  // resultSets = [ rows, okPacket ]. Return the rows (or [] if none).
  return Array.isArray(resultSets) ? (resultSets[0] ?? []) : [];
};

/**
 * Convenience wrapper for procedures that return a single row
 * (login, get-by-id, create-and-return). Returns the row or null.
 */
export const callProcedureOne = async (name, params = []) => {
  const rows = await callProcedure(name, params);
  return rows[0] ?? null;
};
