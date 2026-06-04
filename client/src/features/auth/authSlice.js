import { createSlice } from '@reduxjs/toolkit';

/**
 * Auth state is derived from the server, not from the cookie.
 * The token lives in an httpOnly cookie that JS cannot read — so we
 * never store it here. `isAuthLoading` stays true until the first
 * /auth/me call resolves (so guards don't redirect prematurely).
 */
const initialState = {
  user: null,
  isAuthenticated: false,
  isAuthLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isAuthLoading = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isAuthLoading = false;
    },
    logOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthLoading = false;
    },
  },
});

export const { logOut, setCredentials, setUser } = authSlice.actions;
export default authSlice.reducer;
