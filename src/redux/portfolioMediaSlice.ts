import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Image {
  uid: string;
  src: string;
  // alt: string
}

interface PortfolioMediaState {
  images: Image[];
  confirmUploadUrls: string[];
}

interface SwapImagesPayload {
  sourceId: string;
  targetId: string;
}

const initialState: PortfolioMediaState = {
  images: [
    // {
    //   id: "1",
    //   src: "https://files.edgestore.dev/b4qgt9tvc94ovz0g/publicFiles/_public/35334ba4-25a3-45d3-82d9-fa7fdb7d8ea7.jpg",
    // },
    // {
    //   id: "2",
    //   src: "https://files.edgestore.dev/b4qgt9tvc94ovz0g/publicFiles/_public/6378e460-6142-45cd-b4a9-38b9c691a538.png",
    // },
    // {
    //   id: "3",
    //   src: "https://files.edgestore.dev/b4qgt9tvc94ovz0g/publicFiles/_public/f6471048-2b6c-4e57-93d7-63614638abf8.png",
    // },
    // {
    //   id: "4",
    //   src: "https://files.edgestore.dev/b4qgt9tvc94ovz0g/publicFiles/_public/aa700de7-2a73-4488-b332-0b96505fc530.png",
    // },
    // {
    //   id: "5",
    //   src: "https://files.edgestore.dev/b4qgt9tvc94ovz0g/publicFiles/_public/1af7c43a-e951-4b0c-be03-8b6cd9ec3989.png",
    // },
    // {
    //   id: "6",
    //   src: "https://files.edgestore.dev/b4qgt9tvc94ovz0g/publicFiles/_public/ef604d93-d0b5-4174-8eda-c93e6721da86.jpg",
    // },
  ],
  confirmUploadUrls: [],
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
  },
});

export const {
  setImages,
  addConfirmUploadUrls,
  clearConfirmUploadUrls,
  removeConfirmUploadUrl,
  swapImages,
  removeImage,
} = portfolioMediaSlice.actions;

export default portfolioMediaSlice.reducer;
