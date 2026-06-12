import { callProcedure, callProcedureOne } from '../utils/callProcedure.js';

const staffActivityModel = {
  // --- Staff Portal Methods ---
  getDashboardStats: (staffId) =>
    callProcedureOne('sp_get_staff_dashboard_stats', [staffId]),

  getSchedule: (staffId) => callProcedure('sp_get_staff_schedule', [staffId]),

  getAttendance: (staffId, startDate, endDate) =>
    callProcedure('sp_get_staff_attendance', [staffId, startDate, endDate]),

  clockInOut: (staffId, date, time) =>
    callProcedureOne('sp_clock_in_out', [staffId, date, time]),

  createLeaveRequest: (staffId, leaveType, startDate, endDate, reason) =>
    callProcedureOne('sp_create_leave_request', [
      staffId,
      leaveType,
      startDate,
      endDate,
      reason,
    ]),

  getLeaves: (staffId) => callProcedure('sp_get_staff_leaves', [staffId]),

  getTasks: (staffId) => callProcedure('sp_get_staff_tasks', [staffId]),

  updateTaskStatus: (taskId, staffId, status) =>
    callProcedureOne('sp_update_task_status', [taskId, staffId, status]),

  // --- School Admin Management Methods ---
  assignTask: (staffId, title, description, dueDate, createdBy) =>
    callProcedureOne('sp_assign_staff_task', [
      staffId,
      title,
      description,
      dueDate,
      createdBy,
    ]),

  listSchoolLeaveRequests: (schoolId) =>
    callProcedure('sp_list_school_leave_requests', [schoolId]),

  reviewLeaveRequest: (leaveId, status, comments, reviewedBy) =>
    callProcedureOne('sp_review_leave_request', [
      leaveId,
      status,
      comments,
      reviewedBy,
    ]),

  createStaffSchedule: (
    schoolId,
    staffId,
    subjectName,
    className,
    dayOfWeek,
    startTime,
    endTime,
    room
  ) =>
    callProcedureOne('sp_create_staff_schedule', [
      schoolId,
      staffId,
      subjectName,
      className,
      dayOfWeek,
      startTime,
      endTime,
      room,
    ]),

  listSchoolTasks: (schoolId) =>
    callProcedure('sp_list_school_tasks', [schoolId]),

  listSchoolSchedules: (schoolId) =>
    callProcedure('sp_list_school_schedules', [schoolId]),

  deleteStaffSchedule: (scheduleId, schoolId) =>
    callProcedure('sp_delete_staff_schedule', [scheduleId, schoolId]),

  deleteStaffTask: (taskId, schoolId) =>
    callProcedure('sp_delete_staff_task', [taskId, schoolId]),
};

export default staffActivityModel;
