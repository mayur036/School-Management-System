import { baseApi } from '@/app/baseApi';

export const schoolsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Schools ──────────────────────────────────────────────

    getSchools: builder.query({
      query: () => ({ url: '/schools', method: 'GET' }),
      providesTags: (result) =>
        result?.data?.schools
          ? [
              ...result.data.schools.map((s) => ({
                type: 'School',
                id: s.school_id,
              })),
              { type: 'School', id: 'LIST' },
            ]
          : [{ type: 'School', id: 'LIST' }],
    }),

    getSchool: builder.query({
      query: (id) => ({ url: `/schools/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'School', id }],
    }),

    createSchool: builder.mutation({
      query: (data) => ({
        url: '/schools',
        method: 'POST',
        data,
      }),
      invalidatesTags: [{ type: 'School', id: 'LIST' }],
    }),

    updateSchoolStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/schools/${id}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'School', id },
        { type: 'School', id: 'LIST' },
      ],
    }),

    // ── School Admins ────────────────────────────────────────

    createSchoolAdmin: builder.mutation({
      query: ({ schoolId, ...data }) => ({
        url: `/schools/${schoolId}/admins`,
        method: 'POST',
        data,
      }),
      invalidatesTags: (result, error, { schoolId }) => [
        { type: 'School', id: schoolId },
        { type: 'School', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetSchoolsQuery,
  useGetSchoolQuery,
  useCreateSchoolMutation,
  useUpdateSchoolStatusMutation,
  useCreateSchoolAdminMutation,
} = schoolsApi;
