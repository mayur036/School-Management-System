import { baseApi } from '@/app/baseApi';

import { setUser } from '../auth/authSlice';

export const schoolApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolProfile: builder.query({
      query: () => ({ url: '/school-admin/settings/school', method: 'GET' }),
      providesTags: ['School'],
    }),

    updateSchoolProfile: builder.mutation({
      query: (data) => ({
        url: '/school-admin/settings/school',
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['School'],
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const newName = data?.data?.school?.name;
          if (newName) {
            const currentUser = getState().auth.user;
            if (currentUser) {
              dispatch(
                setUser({
                  ...currentUser,
                  school_name: newName,
                })
              );
            }
          }
        } catch {
          // Handled by client mutation caller
        }
      },
    }),
  }),
});

export const { useGetSchoolProfileQuery, useUpdateSchoolProfileMutation } =
  schoolApi;
