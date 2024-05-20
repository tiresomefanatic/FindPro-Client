import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookmarkedGigsState {
  bookmarkedGigs: any[];
}

const initialState: BookmarkedGigsState = {
  bookmarkedGigs: [],
};

const bookmarkedGigsSlice = createSlice({
  name: "bookmarkedGigs",
  initialState,
  reducers: {
    setBookmarkedGigs: (state, action: PayloadAction<any[]>) => {
      state.bookmarkedGigs = action.payload;
    },
  },
});

export const { setBookmarkedGigs } = bookmarkedGigsSlice.actions;

export default bookmarkedGigsSlice.reducer;