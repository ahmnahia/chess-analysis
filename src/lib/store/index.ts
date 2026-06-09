import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import chessSliceReducer from "@/features/chess/chess-slice";

const chessPersistConfig = {
  key: "chess",
  storage: createWebStorage("local"),
  whitelist: ["engineDepth"],
};

export const store = configureStore({
  reducer: {
    chess: persistReducer(chessPersistConfig, chessSliceReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: ["register", "rehydrate"],
        ignoredPaths: ["chess._persist"],
      },
    }),
});

export const persistor = persistStore(store);

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
