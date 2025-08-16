"use client";
import ChessBoard from "./components/ChessBoard";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import "./index.css";
export default function ChessHome() {
  return (
    <Provider store={store}>
      <ChessBoard />
    </Provider>
  );
}
