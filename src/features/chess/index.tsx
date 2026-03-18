"use client";
import CustomChessBoard from "./components/custom-chess-board";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import SidebarInfo from "./components/sidebar-info";
import { ChessProvider } from "./context/chess-provider";
import { EvaluationBar } from "./components/evaluation-bar";
import "./index.css";

export default function ChessHome() {
  return (
    <Provider store={store}>
      <ChessProvider>
        <div className="flex h-full items-stretch gap-6 w-full justify-center mt-8">
          <EvaluationBar />
          <CustomChessBoard />
          <SidebarInfo />
        </div>
      </ChessProvider>
    </Provider>
  );
}

