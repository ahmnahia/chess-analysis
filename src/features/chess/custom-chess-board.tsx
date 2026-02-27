"use client";
import { Chessboard } from "react-chessboard";
import useChessBoard from "./hooks/use-chess-board";
import "./index.css";

export default function CustomChessBoard() {
  const {
    onSquareClick,
    squareStyles,
    onPieceDrop,
    chessPositions,
    onPieceDrag,
    currentPosition,
    arrows,
  } = useChessBoard();

  return (
    <div className="" suppressHydrationWarning>
      <div className="flex justify-center items-center">
        <div className="max-w-[800px]">
          <Chessboard
            options={{
              position: currentPosition,
              onPieceDrop,
              onSquareClick,
              squareStyles,
              onPieceDrag,
              arrows,
            }}
          />
        </div>
      </div>
    </div>
  );
}
