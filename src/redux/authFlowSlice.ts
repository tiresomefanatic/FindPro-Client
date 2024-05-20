// authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface AuthState {
  loggingInFromRoute: string;
}

const initialState: AuthState = {
  loggingInFromRoute: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggingInFromRoute: (state, action: PayloadAction<string>) => {
      state.loggingInFromRoute = action.payload;
    },
  },
});

export const { setLoggingInFromRoute } = authSlice.actions;

export const setLoggingInFromRouteAsync = createAsyncThunk(
  'auth/setLoggingInFromRouteAsync',
  async (route: string, { dispatch }) => {
    dispatch(setLoggingInFromRoute(route));
  }
);

export default authSlice.reducer; 