import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  selectedCategory: string;
  selectedSubcategory: string;
}

const initialState: FiltersState = {
  selectedCategory: '',
  selectedSubcategory: '',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      state.selectedSubcategory = '';
    },
    setSelectedSubcategory: (state, action: PayloadAction<string>) => {
      state.selectedSubcategory = action.payload;
    },
  },
});

export const { setSelectedCategory, setSelectedSubcategory } = filtersSlice.actions;

export default filtersSlice.reducer;