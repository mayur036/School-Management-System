import { asyncHandler } from '../utils/apiResponse.js';
import { callProcedure, callProcedureOne } from '../utils/callProcedure.js';

export const listAllSchoolAdmins = asyncHandler(async (req, res) => {
  const { search, school_id, status, sort_by, sort_order } = req.query;
  const admins = await callProcedure('sp_list_all_school_admins', [
    search || '',
    school_id ? Number(school_id) : 0,
    status || 'all',
    sort_by || 'created_at',
    sort_order || 'DESC'
  ]);
  res.status(200).json({ status: 'success', data: { admins } });
});

export const updateSchoolAdminStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const admin = await callProcedureOne('sp_update_staff_status', [id, status]);
  res.status(200).json({ status: 'success', data: { admin } });
});

export const deleteSchoolAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await callProcedure('sp_delete_school_admin', [id]);
  res.status(204).send();
});
