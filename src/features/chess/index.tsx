"use client";
import CustomChessBoard from "./CustomChessBoard";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import SidebarInfo from "./components/sidebarInfo";
export default function ChessHome() {
  return (
    <Provider store={store}>
      <div className="flex gap-6 w-full justify-center">
        <CustomChessBoard />
        <SidebarInfo />
      </div>
    </Provider>
  );
}
