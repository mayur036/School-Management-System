import { baseApi } from '@/app/baseApi';

export const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaff: builder.query({
      query: (params) => ({ url: '/staff', method: 'GET', params }),
      transformResponse: (response) => {
        if (response?.data?.staff) {
          return {
            ...response,
            data: {
              ...response.data,
              staff: response.data.staff.filter(
                (s) => s.role_name !== 'school_admin'
              ),
            },
          };
        }
        return response;
      },
      providesTags: (result) =>
        result?.data?.staff
          ? [
              ...result.data.staff.map((s) => ({
                type: 'Staff',
                id: s.staff_id,
              })),
              { type: 'Staff', id: 'LIST' },
            ]
          : [{ type: 'Staff', id: 'LIST' }],
    }),

    getStaffById: builder.query({
      query: (id) => ({ url: `/staff/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Staff', id }],
    }),

    createStaff: builder.mutation({
      query: (data) => ({
        url: '/staff',
        method: 'POST',
        data,
      }),
      invalidatesTags: [{ type: 'Staff', id: 'LIST' }],
    }),

    updateStaffStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/staff/${id}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Staff', id },
        { type: 'Staff', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetStaffQuery,
  useGetStaffByIdQuery,
  useCreateStaffMutation,
  useUpdateStaffStatusMutation,
} = staffApi;
