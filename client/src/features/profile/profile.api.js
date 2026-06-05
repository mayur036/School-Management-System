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
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // API returns { success, message, data: { staff } } — push the
          // updated user into auth state so every avatar (header, sidebar,
          // profile) refreshes immediately.
          dispatch(setUser(data.data.staff));
        } catch {
          // surfaced to the caller via unwrap()
        }
      },
    }),
  }),
});

export const { useUploadAvatarMutation } = profileApi;
