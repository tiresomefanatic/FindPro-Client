import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  searchTerm: string;
  searchInput: string;
}

const initialState: SearchState = {
  searchTerm: "",
  searchInput: ""
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSearchInput: (state, action: PayloadAction<string>) => {
      state.searchInput = action.payload;
    },
    
    
  },
});

export const { setSearchTerm, setSearchInput } = searchSlice.actions;

export default searchSlice.reducer;