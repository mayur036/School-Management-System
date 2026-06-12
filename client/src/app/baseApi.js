import { createApi } from '@reduxjs/toolkit/query/react';

import axiosInstance from '@/lib/axios';

// custom baseQuery using our axios instance (not fetchBaseQuery).
// Auth rides on the httpOnly cookie (axios withCredentials), so there is
// no token header to attach here.
const axiosBaseQuery =
  () =>
  async ({ url, method = 'GET', data, params, headers = {} }) => {
    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (err) {
      return {
        error: {
          status: err.response?.status,
          message: err.response?.data?.message || err.message,
        },
      };
    }
  };

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'User',
    'School',
    'Department',
    'Staff',
    'SchoolAdmin',
    'StaffSchedule',
    'StaffAttendance',
    'StaffLeave',
    'StaffTask',
  ],
  endpoints: () => ({}),
});
