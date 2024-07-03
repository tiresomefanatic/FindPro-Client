import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from 'redux-persist';
//import storage from 'redux-persist/lib/storage';
import storage from "../lib/persistStorage" //https://github.com/vercel/next.js/discussions/15687
import filtersReducer from "./filtersSlice";
import searchReducer from "./searchSlice";
import gigsReducer from "./gigsSlice";
import authFlowReducer from './authFlowSlice';
import imageSortReducer from './imageSortSlice';
import authReducer, { setLoggedInAt } from './authSlice';
import portfolioMediaReducer from "./portfolioMediaSlice";



const authFlowPersistConfig = {
  key: 'authFlow',
  storage,
  whitelist: ['loggingInFromRoute', 'tryingToBookmarkId'],
};

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: [ 'isAuthenticated', 'user', 'loggedInAt', 'accessToken']
};

const rootReducer = combineReducers({
  filters: filtersReducer,
  search: searchReducer,
  gigs: gigsReducer,
  authFlow: persistReducer(authFlowPersistConfig, authFlowReducer),
  imageSort: imageSortReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  portfolioMedia: portfolioMediaReducer,



});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;