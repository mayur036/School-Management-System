import { baseApi } from '@/app/baseApi';

import { setUser } from '../auth/authSlice';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Upload / replace the current user's avatar (multipart form-data).
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: '/staff/me/avatar',
        method: 'PATCH',
        data: formData,
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data.staff));
        } catch {
          // surfaced to the caller via unwrap()
        }
      },
    }),
    // Update personal details.
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: '/staff/me',
        method: 'PATCH',
        data: profileData,
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data.staff));
        } catch {
          // Handled by client mutation
        }
      },
    }),
    // Change own password.
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/staff/me/password',
        method: 'PATCH',
        data: passwordData,
      }),
    }),
  }),
});

export const {
  useUploadAvatarMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = profileApi;
