"use client";
import CustomChessBoard from "./components/custom-chess-board";
import SidebarInfo from "./components/sidebar-info";
import EvaluationBar from "./components/evaluation-bar";
import { ChessProvider } from "./context/chess-provider";
import "./index.css";

export default function ChessHome() {
  return (
    <ChessProvider>
      <div className="flex w-full justify-center items-stretch gap-6 lg:px-4 lg:max-h-full max-lg:flex-col max-lg:items-center max-lg:gap-3 max-lg:px-2">
        <EvaluationBar />
        <CustomChessBoard />
        <SidebarInfo />
      </div>
    </ChessProvider>
  );
}
