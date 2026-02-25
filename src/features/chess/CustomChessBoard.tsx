"use client";
import { Chessboard } from "react-chessboard";
import useChess from "./useChess";
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
  } = useChess();

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
