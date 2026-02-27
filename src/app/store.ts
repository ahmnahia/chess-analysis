import { configureStore } from "@reduxjs/toolkit";
import chessSliceReducer from "@/features/chess/chess-slice";

export const store = configureStore({
  reducer: {
    chess: chessSliceReducer,
  },
});


export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
