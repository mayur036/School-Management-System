import { pool } from './config/db.js';
import { callProcedure } from './utils/callProcedure.js';

async function test() {
  try {
    const result = await pool.query(`
      SELECT
        s.staff_id, s.role_id, r.role_name, s.school_id, sch.name AS school_name, s.department_id,
        s.first_name, s.last_name, s.email, s.phone, s.avatar_url,
        s.status, s.created_at
      FROM staff s
      JOIN roles r ON r.role_id = s.role_id
      LEFT JOIN schools sch ON sch.school_id = s.school_id
      WHERE r.role_name = 'school_admin'
    `);
    console.log("MANUAL QUERY RESULT:", result[0]);

    try {
      const procResult = await callProcedure('sp_list_all_school_admins');
      console.log("PROCEDURE RESULT:", procResult);
    } catch (e) {
      console.log("PROCEDURE ERROR:", e.message);
    }

  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    process.exit();
  }
}

test();
