import { createSlice, PayloadAction, } from '@reduxjs/toolkit';

interface AuthFlowState {
  loggingInFromRoute: string;
  tryingToBookmarkId: string;
}

const initialState: AuthFlowState = {
  loggingInFromRoute: '',
  tryingToBookmarkId: '',

};

const authFlowSlice = createSlice({
  name: 'authFlow',
  initialState,
  reducers: {
    setLoggingInFromRoute: (state, action: PayloadAction<string>) => {
      state.loggingInFromRoute = action.payload;
    },
    setTryingToBookmarkId: (state, action: PayloadAction<string>) => {
      state.tryingToBookmarkId = action.payload;
    },

  },
});

export const { setLoggingInFromRoute, setTryingToBookmarkId } = authFlowSlice.actions;



export default authFlowSlice.reducer; 