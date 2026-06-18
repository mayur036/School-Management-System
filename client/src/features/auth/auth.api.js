import { baseApi } from '@/app/baseApi';

import { logOut, setCredentials, setUser } from './authSlice';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // API returns { success, message, data: { user } }
          dispatch(setCredentials({ user: data.data.user }));
          dispatch(baseApi.util.resetApiState());
        } catch {
          // surfaced to the caller via unwrap()
        }
      },
    }),

    googleLogin: builder.mutation({
      query: (credential) => ({
        url: '/auth/google-login',
        method: 'POST',
        data: { credential },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // API returns { success, message, data: { user } }
          dispatch(setCredentials({ user: data.data.user }));
          dispatch(baseApi.util.resetApiState());
        } catch {
          // surfaced to the caller via unwrap()
        }
      },
    }),

    getMe: builder.query({
      query: () => ({ url: '/auth/me', method: 'GET' }),
      providesTags: ['User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // API returns { success, message, data: { user } }
          dispatch(setUser(data.data.user));
        } catch {
          // No / invalid cookie → not authenticated
          dispatch(logOut());
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // Clear local auth state + wipe cached queries regardless of
          // whether the network call succeeded.
          dispatch(logOut());
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        data,
      }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useLoginMutation,
  useGoogleLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
