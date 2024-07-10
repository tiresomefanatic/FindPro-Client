import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Image {
  uid: string;
  src: string;
  // alt: string
}

interface PortfolioMediaState {
  images: Image[];
  confirmUploadUrls: string[];
  gigID: string; // New state added
}

interface SwapImagesPayload {
  sourceId: string;
  targetId: string;
}

const initialState: PortfolioMediaState = {
  images: [
    // ... (previous image objects)
  ],
  confirmUploadUrls: [],
  gigID: "", // Initialize gigID as an empty string
};

const portfolioMediaSlice = createSlice({
  name: "portfolioMedia",
  initialState,
  reducers: {
    setImages: (state, action: PayloadAction<Image[]>) => {
      state.images = action.payload;
    },
    addConfirmUploadUrls: (state, action: PayloadAction<string>) => {
      state.confirmUploadUrls.push(action.payload);
    },
    clearConfirmUploadUrls: (state) => {
      state.confirmUploadUrls = [];
    },
    removeConfirmUploadUrl: (state, action: PayloadAction<string>) => {
      const url = action.payload;
      state.confirmUploadUrls = state.confirmUploadUrls.filter(
        (u) => u !== url
      );
    },
    swapImages: (state, action: PayloadAction<SwapImagesPayload>) => {
      const { sourceId, targetId } = action.payload;
      const startIndex = state.images.findIndex(
        (image) => image.uid === sourceId
      );
      const destinationIndex = state.images.findIndex(
        (image) => image.uid === targetId
      );

      if (startIndex !== -1 && destinationIndex !== -1) {
        const updatedImages = [...state.images];
        [updatedImages[startIndex], updatedImages[destinationIndex]] = [
          updatedImages[destinationIndex],
          updatedImages[startIndex],
        ];
        state.images = updatedImages;
      }
    },
    removeImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.filter(
        (image) => image.uid !== action.payload
      );
    },
    setGigID: (state, action: PayloadAction<string>) => {
      state.gigID = action.payload;
    },
  },
});

export const {
  setImages,
  addConfirmUploadUrls,
  clearConfirmUploadUrls,
  removeConfirmUploadUrl,
  swapImages,
  removeImage,
  setGigID, // New action exported
} = portfolioMediaSlice.actions;

export default portfolioMediaSlice.reducer;