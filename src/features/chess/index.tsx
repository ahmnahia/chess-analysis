"use client";
import CustomChessBoard from "./components/custom-chess-board";
import SidebarInfo from "./components/sidebar-info";
import EvaluationBar from "./components/evaluation-bar";
import { ChessProvider } from "./context/chess-provider";
import "./index.css";

export default function ChessHome() {
  return (
    <ChessProvider>
      <div className="flex h-full min-h-0 w-full justify-center items-center gap-6 lg:px-4 max-lg:h-auto max-lg:flex-col max-lg:items-center max-lg:gap-3 max-lg:px-2">
        <EvaluationBar />
        <CustomChessBoard />
        <SidebarInfo />
      </div>
    </ChessProvider>
  );
}
