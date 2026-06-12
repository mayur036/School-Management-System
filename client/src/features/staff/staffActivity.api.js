import { baseApi } from '@/app/baseApi';

export const staffActivityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --- Staff Portal Queries/Mutations ---
    getStaffDashboardStats: builder.query({
      query: () => ({ url: '/staff/me/dashboard-stats', method: 'GET' }),
      providesTags: [
        'StaffSchedule',
        'StaffAttendance',
        'StaffLeave',
        'StaffTask',
      ],
    }),

    getStaffSchedule: builder.query({
      query: () => ({ url: '/staff/me/schedule', method: 'GET' }),
      providesTags: (result) =>
        result?.data?.schedule
          ? [
              ...result.data.schedule.map((s) => ({
                type: 'StaffSchedule',
                id: s.schedule_id,
              })),
              { type: 'StaffSchedule', id: 'LIST' },
            ]
          : [{ type: 'StaffSchedule', id: 'LIST' }],
    }),

    getStaffAttendance: builder.query({
      query: (params) => ({
        url: '/staff/me/attendance',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data?.attendance
          ? [
              ...result.data.attendance.map((a) => ({
                type: 'StaffAttendance',
                id: a.attendance_id,
              })),
              { type: 'StaffAttendance', id: 'LIST' },
            ]
          : [{ type: 'StaffAttendance', id: 'LIST' }],
    }),

    clockInOut: builder.mutation({
      query: (data) => ({
        url: '/staff/me/attendance/clock',
        method: 'POST',
        data,
      }),
      invalidatesTags: [{ type: 'StaffAttendance', id: 'LIST' }],
    }),

    getStaffLeaves: builder.query({
      query: () => ({ url: '/staff/me/leaves', method: 'GET' }),
      providesTags: (result) =>
        result?.data?.leaves
          ? [
              ...result.data.leaves.map((l) => ({
                type: 'StaffLeave',
                id: l.leave_id,
              })),
              { type: 'StaffLeave', id: 'LIST' },
            ]
          : [{ type: 'StaffLeave', id: 'LIST' }],
    }),

    requestLeave: builder.mutation({
      query: (data) => ({
        url: '/staff/me/leaves',
        method: 'POST',
        data,
      }),
      invalidatesTags: [{ type: 'StaffLeave', id: 'LIST' }],
    }),

    getStaffTasks: builder.query({
      query: () => ({ url: '/staff/me/tasks', method: 'GET' }),
      providesTags: (result) =>
        result?.data?.tasks
          ? [
              ...result.data.tasks.map((t) => ({
                type: 'StaffTask',
                id: t.task_id,
              })),
              { type: 'StaffTask', id: 'LIST' },
            ]
          : [{ type: 'StaffTask', id: 'LIST' }],
    }),

    updateTaskStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/staff/me/tasks/${id}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'StaffTask', id },
        { type: 'StaffTask', id: 'LIST' },
      ],
    }),

    // --- School Admin Staff Management Queries/Mutations ---
    assignTask: builder.mutation({
      query: (data) => ({
        url: '/school-admin/tasks',
        method: 'POST',
        data,
      }),
      invalidatesTags: [{ type: 'StaffTask', id: 'LIST' }],
    }),

    listSchoolTasks: builder.query({
      query: () => ({ url: '/school-admin/tasks', method: 'GET' }),
      providesTags: (result) =>
        result?.data?.tasks
          ? [
              ...result.data.tasks.map((t) => ({
                type: 'StaffTask',
                id: t.task_id,
              })),
              { type: 'StaffTask', id: 'LIST' },
            ]
          : [{ type: 'StaffTask', id: 'LIST' }],
    }),

    deleteStaffTask: builder.mutation({
      query: (id) => ({
        url: `/school-admin/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'StaffTask', id: 'LIST' }],
    }),

    listSchoolLeaveRequests: builder.query({
      query: () => ({ url: '/school-admin/leaves', method: 'GET' }),
      providesTags: (result) =>
        result?.data?.leaves
          ? [
              ...result.data.leaves.map((l) => ({
                type: 'StaffLeave',
                id: l.leave_id,
              })),
              { type: 'StaffLeave', id: 'LIST' },
            ]
          : [{ type: 'StaffLeave', id: 'LIST' }],
    }),

    reviewLeaveRequest: builder.mutation({
      query: ({ id, status, comments }) => ({
        url: `/school-admin/leaves/${id}`,
        method: 'PATCH',
        data: { status, comments },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'StaffLeave', id },
        { type: 'StaffLeave', id: 'LIST' },
      ],
    }),

    createStaffSchedule: builder.mutation({
      query: (data) => ({
        url: '/school-admin/schedules',
        method: 'POST',
        data,
      }),
      invalidatesTags: [{ type: 'StaffSchedule', id: 'LIST' }],
    }),

    listSchoolSchedules: builder.query({
      query: () => ({ url: '/school-admin/schedules', method: 'GET' }),
      providesTags: (result) =>
        result?.data?.schedules
          ? [
              ...result.data.schedules.map((s) => ({
                type: 'StaffSchedule',
                id: s.schedule_id,
              })),
              { type: 'StaffSchedule', id: 'LIST' },
            ]
          : [{ type: 'StaffSchedule', id: 'LIST' }],
    }),

    deleteStaffSchedule: builder.mutation({
      query: (id) => ({
        url: `/school-admin/schedules/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'StaffSchedule', id: 'LIST' }],
    }),
  }),
});

export const {
  // Staff Portal
  useGetStaffDashboardStatsQuery,
  useGetStaffScheduleQuery,
  useGetStaffAttendanceQuery,
  useClockInOutMutation,
  useGetStaffLeavesQuery,
  useRequestLeaveMutation,
  useGetStaffTasksQuery,
  useUpdateTaskStatusMutation,

  // School Admin Management
  useAssignTaskMutation,
  useListSchoolTasksQuery,
  useDeleteStaffTaskMutation,
  useListSchoolLeaveRequestsQuery,
  useReviewLeaveRequestMutation,
  useCreateStaffScheduleMutation,
  useListSchoolSchedulesQuery,
  useDeleteStaffScheduleMutation,
} = staffActivityApi;
