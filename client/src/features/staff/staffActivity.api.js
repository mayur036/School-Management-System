import { baseApi } from '@/app/baseApi';

export const staffActivityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --- Staff Portal Queries/Mutations ---
    getStaffDashboardStats: builder.query({
      query: () => ({ url: '/staff/me/dashboard-stats', method: 'GET' }),
      providesTags: [
        { type: 'StaffSchedule', id: 'LIST' },
        { type: 'StaffAttendance', id: 'LIST' },
        { type: 'StaffLeave', id: 'LIST' },
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

    // --- School Admin Staff Management Queries/Mutations ---
    listSchoolLeaveRequests: builder.query({
      query: (params) => ({ url: '/school-admin/leaves', method: 'GET', params }),
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

  // School Admin Management
  useListSchoolLeaveRequestsQuery,
  useReviewLeaveRequestMutation,
} = staffActivityApi;
