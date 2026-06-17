import { baseApi } from '@/app/baseApi';

export const schoolAdminsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolAdmins: builder.query({
      query: (params) => ({ url: '/school-admins', method: 'GET', params }),
      providesTags: (result) =>
        result?.data?.admins
          ? [
              ...result.data.admins.map((a) => ({
                type: 'SchoolAdmin',
                id: a.staff_id,
              })),
              { type: 'SchoolAdmin', id: 'LIST' },
            ]
          : [{ type: 'SchoolAdmin', id: 'LIST' }],
    }),
    updateSchoolAdminStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/school-admins/${id}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'SchoolAdmin', id },
        { type: 'SchoolAdmin', id: 'LIST' },
      ],
    }),
    deleteSchoolAdmin: builder.mutation({
      query: (id) => ({
        url: `/school-admins/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'SchoolAdmin', id },
        { type: 'SchoolAdmin', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetSchoolAdminsQuery,
  useUpdateSchoolAdminStatusMutation,
  useDeleteSchoolAdminMutation,
} = schoolAdminsApi;
