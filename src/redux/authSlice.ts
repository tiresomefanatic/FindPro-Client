import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
//import storage from "redux-persist/lib/storage";
import storage from "../lib/persistStorage"

interface UserData {
  bio: string;
  bookmarkedGigs: string[];
  email: string;
  googleId: string;
  isSeller: boolean;
  languages: string[];
  location: string;
  myGigs: string[];
  name: string;
  orders: string[];
  phoneNumber: string;
  profilePic: string;
  refreshToken: string;
  skills: string[];
  _id: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  loggedInAt: number | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loggedInAt: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action: PayloadAction<Partial<UserData>>) => {
      state.user = action.payload;
    },
    setLoggedInAt: (state, action: PayloadAction<number>) => {
      state.loggedInAt = action.payload;
    },
    clearAuthState: (state) => {
      console.log('clear auth state hitting?')
      state.isAuthenticated = false;
      state.user = null;
      state.loggedInAt = null;
    },
    addBookmarkedGig: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.bookmarkedGigs.push(action.payload);
      }
    },
    removeBookmarkedGig: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.bookmarkedGigs = state.user.bookmarkedGigs.filter((gigId: string) => gigId !== action.payload);
      }
    },
  }
});

export const { setIsAuthenticated, setUser, setLoggedInAt, clearAuthState, addBookmarkedGig, removeBookmarkedGig } = authSlice.actions;

const persistConfig = {
  key: "auth",
  storage,
  transforms: [
    {
      in: (state: AuthState) => {
        if (state && state.loggedInAt !== null) {
          if (Date.now() - state.loggedInAt > 30 * 24 * 60 * 60 * 1000) {
            return initialState;
          }
        }
        return state;
      },
      out: (state: AuthState) => state,
    },
  ],
};

export default persistReducer(persistConfig, authSlice.reducer);