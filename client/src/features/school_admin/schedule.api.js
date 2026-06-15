import { baseApi } from '@/app/baseApi';

export const scheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --- School Periods (Admin) ---
    getSchoolPeriods: builder.query({
      query: () => ({ url: '/school-admin/schedules/periods', method: 'GET' }),
      providesTags: (result) =>
        result?.data?.periods
          ? [
              ...result.data.periods.map((p) => ({
                type: 'SchoolPeriod',
                id: p.period_id,
              })),
              { type: 'SchoolPeriod', id: 'LIST' },
            ]
          : [{ type: 'SchoolPeriod', id: 'LIST' }],
    }),

    createSchoolPeriod: builder.mutation({
      query: (data) => ({
        url: '/school-admin/schedules/periods',
        method: 'POST',
        data,
      }),
      invalidatesTags: [{ type: 'SchoolPeriod', id: 'LIST' }],
    }),

    updateSchoolPeriod: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/school-admin/schedules/periods/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'SchoolPeriod', id },
        { type: 'SchoolPeriod', id: 'LIST' },
      ],
    }),

    deleteSchoolPeriod: builder.mutation({
      query: (id) => ({
        url: `/school-admin/schedules/periods/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'SchoolPeriod', id: 'LIST' }],
    }),

    // --- School Settings / Working Days (Admin) ---
    getSchoolSettings: builder.query({
      query: () => ({ url: '/school-admin/schedules/settings', method: 'GET' }),
      providesTags: ['SchoolSettings'],
    }),

    updateWorkingDays: builder.mutation({
      query: (data) => ({
        url: '/school-admin/schedules/settings/working-days',
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['SchoolSettings'],
    }),

    // --- Staff Portal Queries (Staff Roles) ---
    getStaffSchoolPeriods: builder.query({
      query: () => ({ url: '/staff/me/periods', method: 'GET' }),
      providesTags: [{ type: 'SchoolPeriod', id: 'LIST' }],
    }),

    getStaffSchoolSettings: builder.query({
      query: () => ({ url: '/staff/me/settings', method: 'GET' }),
      providesTags: ['SchoolSettings'],
    }),

    // --- Schedules (Admin) ---
    listSchoolSchedules: builder.query({
      query: (params) => ({
        url: '/school-admin/schedules',
        method: 'GET',
        params,
      }),
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

    createStaffSchedule: builder.mutation({
      query: (data) => ({
        url: '/school-admin/schedules',
        method: 'POST',
        data,
      }),
      invalidatesTags: [{ type: 'StaffSchedule', id: 'LIST' }],
    }),

    updateStaffSchedule: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/school-admin/schedules/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'StaffSchedule', id },
        { type: 'StaffSchedule', id: 'LIST' },
      ],
    }),

    deleteStaffSchedule: builder.mutation({
      query: (id) => ({
        url: `/school-admin/schedules/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'StaffSchedule', id: 'LIST' }],
    }),

    bulkCreateStaffSchedules: builder.mutation({
      query: (data) => ({
        url: '/school-admin/schedules/bulk',
        method: 'POST',
        data,
      }),
      invalidatesTags: [{ type: 'StaffSchedule', id: 'LIST' }],
    }),
  }),
});

export const {
  // Admin periods
  useGetSchoolPeriodsQuery,
  useCreateSchoolPeriodMutation,
  useUpdateSchoolPeriodMutation,
  useDeleteSchoolPeriodMutation,

  // Admin settings
  useGetSchoolSettingsQuery,
  useUpdateWorkingDaysMutation,

  // Staff periods & settings
  useGetStaffSchoolPeriodsQuery,
  useGetStaffSchoolSettingsQuery,

  // Admin schedules
  useListSchoolSchedulesQuery,
  useCreateStaffScheduleMutation,
  useUpdateStaffScheduleMutation,
  useDeleteStaffScheduleMutation,
  useBulkCreateStaffSchedulesMutation,
} = scheduleApi;
