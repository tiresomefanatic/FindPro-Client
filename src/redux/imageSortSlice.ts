import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ImageSortState {
  portfolioMedia: { url: string; uploadedAt: Date }[];
}

const initialState: ImageSortState = {
  portfolioMedia: [],
};

export const imageSortSlice = createSlice({
  name: "imageSort",
  initialState,
  reducers: {
    setPortfolioMedia: (state, action: PayloadAction<{ url: string; uploadedAt: Date }[]>) => {
      state.portfolioMedia = action.payload;
    },
    reorderPortfolioMedia: (state, action: PayloadAction<{ url: string; uploadedAt: Date }[]>) => {
      state.portfolioMedia = action.payload;
    },
    addImageToPortfolioMedia: (state, action: PayloadAction<{ url: string; uploadedAt: Date }>) => {
      state.portfolioMedia.push(action.payload);
    },
    removeImageFromPortfolioMedia: (state, action: PayloadAction<string>) => {
      state.portfolioMedia = state.portfolioMedia.filter((media) => media.url !== action.payload);
    },
  },
});

export const {
  setPortfolioMedia,
  reorderPortfolioMedia,
  addImageToPortfolioMedia,
  removeImageFromPortfolioMedia,
} = imageSortSlice.actions;

export default imageSortSlice.reducer;