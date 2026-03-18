"use client";
import { Chessboard } from "react-chessboard";
import useChessBoard from "../../hooks/use-chess-board";

export default function CustomChessBoard() {
  const {
    onSquareClick,
    squareStyles,
    onPieceDrop,
    onPieceDrag,
    currentPosition,
    arrows,
  } = useChessBoard();

  return (
    <div className="" suppressHydrationWarning>
      <div className="flex justify-center items-center">
        <div className="max-w-[80vh]">
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
