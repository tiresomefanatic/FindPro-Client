import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import filtersReducer from "./filtersSlice";
import searchReducer from "./searchSlice";
import gigsReducer from "./gigsSlice";
import bookmarkedGigsReducer from './bookmarkedGigsSlice';
import authFlowReducer from './authFlowSlice';

const authFlowPersistConfig = {
  key: 'authFlow',
  storage,
  whitelist: ['loggingInFromRoute'],
};

const rootReducer = combineReducers({
  filters: filtersReducer,
  search: searchReducer,
  gigs: gigsReducer,
  bookmarkedGigs: bookmarkedGigsReducer,
  authFlow: persistReducer(authFlowPersistConfig, authFlowReducer),
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;