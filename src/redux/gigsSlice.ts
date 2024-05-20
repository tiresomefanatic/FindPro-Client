import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GigsState {
  isLoading: boolean;
  noGigsFound: boolean;
}

const initialState: GigsState = {
  isLoading: false,
  noGigsFound: false,
};

export const gigsSlice = createSlice({
  name: "gigs",
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setNoGigsFound: (state, action: PayloadAction<boolean>) => {
      state.noGigsFound = action.payload;
    },
  },
});

export const { setIsLoading, setNoGigsFound } = gigsSlice.actions;

export default gigsSlice.reducer;