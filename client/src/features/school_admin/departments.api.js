import { baseApi } from '@/app/baseApi';

export const departmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query({
      query: () => ({ url: '/departments', method: 'GET' }),
      providesTags: (result) =>
        result?.data?.departments
          ? [
              ...result.data.departments.map((d) => ({
                type: 'Department',
                id: d.department_id,
              })),
              { type: 'Department', id: 'LIST' },
            ]
          : [{ type: 'Department', id: 'LIST' }],
    }),

    createDepartment: builder.mutation({
      query: (data) => ({
        url: '/departments',
        method: 'POST',
        data,
      }),
      invalidatesTags: [{ type: 'Department', id: 'LIST' }],
    }),

    updateDepartmentStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/departments/${id}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Department', id },
        { type: 'Department', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentStatusMutation,
} = departmentsApi;
