import { callProcedure, callProcedureOne } from '../utils/callProcedure.js';

const scheduleModel = {
  // --- Periods ---
  createSchoolPeriod: (
    schoolId,
    periodName,
    periodOrder,
    startTime,
    endTime,
    isBreak
  ) =>
    callProcedureOne('sp_create_school_period', [
      schoolId,
      periodName,
      periodOrder,
      startTime,
      endTime,
      isBreak,
    ]),

  listSchoolPeriods: (schoolId) =>
    callProcedure('sp_list_school_periods', [schoolId]),

  updateSchoolPeriod: (
    periodId,
    schoolId,
    periodName,
    periodOrder,
    startTime,
    endTime,
    isBreak
  ) =>
    callProcedureOne('sp_update_school_period', [
      periodId,
      schoolId,
      periodName,
      periodOrder,
      startTime,
      endTime,
      isBreak,
    ]),

  deleteSchoolPeriod: (periodId, schoolId) =>
    callProcedureOne('sp_delete_school_period', [periodId, schoolId]),

  // --- Working Days / Settings ---
  updateWorkingDays: (schoolId, workingDays) =>
    callProcedureOne('sp_update_working_days', [schoolId, workingDays]),

  getSchoolSettings: (schoolId) =>
    callProcedureOne('sp_get_school_settings', [schoolId]),

  // --- Schedules ---
  createStaffSchedule: (
    schoolId,
    staffId,
    periodId,
    subjectName,
    className,
    dayOfWeek,
    room
  ) =>
    callProcedureOne('sp_create_staff_schedule', [
      schoolId,
      staffId,
      periodId,
      subjectName,
      className,
      dayOfWeek,
      room,
    ]),

  updateStaffSchedule: (
    schoolId,
    scheduleId,
    staffId,
    periodId,
    subjectName,
    className,
    dayOfWeek,
    room
  ) =>
    callProcedureOne('sp_update_staff_schedule', [
      scheduleId,
      schoolId,
      periodId,
      subjectName,
      className,
      dayOfWeek,
      room,
    ]),

  listSchoolSchedules: (schoolId, { staffId = 0, day_of_week = '', search = '', sortBy = '', sortOrder = '' } = {}) =>
    callProcedure('sp_list_school_schedules', [
      schoolId,
      staffId || 0,
      day_of_week || '',
      search || '',
      sortBy || '',
      sortOrder || '',
    ]),

  deleteStaffSchedule: (scheduleId, schoolId) =>
    callProcedureOne('sp_delete_staff_schedule', [scheduleId, schoolId]),

  bulkCreateStaffSchedules: (schoolId, staffId, entriesJson) =>
    callProcedure('sp_bulk_create_staff_schedules', [
      schoolId,
      staffId,
      entriesJson,
    ]),
};

export default scheduleModel;
