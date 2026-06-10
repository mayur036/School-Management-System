import { baseApi } from '@/app/baseApi';

export const schoolAdminsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolAdmins: builder.query({
      query: () => ({ url: '/school-admins', method: 'GET' }),
      providesTags: ['SchoolAdmin'],
    }),
    updateSchoolAdminStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/school-admins/${id}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: ['SchoolAdmin'],
    }),
    deleteSchoolAdmin: builder.mutation({
      query: (id) => ({
        url: `/school-admins/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SchoolAdmin'],
    }),
  }),
});

export const {
  useGetSchoolAdminsQuery,
  useUpdateSchoolAdminStatusMutation,
  useDeleteSchoolAdminMutation,
} = schoolAdminsApi;
