"use client";
import CustomChessBoard from "./CustomChessBoard";
import { Provider } from "react-redux";
import { store } from "@/app/store";
export default function ChessHome() {
  return (
    <Provider store={store}>
      <CustomChessBoard />
    </Provider>
  );
}
