import { configureStore } from '@reduxjs/toolkit';
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import rootReducer, { RootState } from './rootReducer';

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  })

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

export default store;
export type { RootState };