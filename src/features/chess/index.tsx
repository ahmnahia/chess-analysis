"use client";
import CustomChessBoard from "./components/custom-chess-board";
import SidebarInfo from "./components/sidebar-info";
import EvaluationBar from "./components/evaluation-bar";
import { ChessProvider } from "./context/chess-provider";
import "./index.css";

export default function ChessHome() {
  return (
    <ChessProvider>
      <div className="flex max-md:flex-col max-md:items-center max-h-[90vh] max-md:max-h-full items-stretch gap-6 max-md:gap-3 w-full justify-center mt-8 max-md:mt-2 px-4 max-md:px-2">
        <EvaluationBar />
        <CustomChessBoard />
        <SidebarInfo />
      </div>
    </ChessProvider>
  );
}
