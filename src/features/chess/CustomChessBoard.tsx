"use client";
import { useEffect, useRef, useState } from "react";
import { Chessboard, PieceDropHandlerArgs } from "react-chessboard";
import useChess from "./useChess";
import "./index.css";

export default function CustomChessBoard() {
  const {
    onSquareClick,
    squareStyles,
    onPieceDrop,
    chessPosition,
    onPieceDrag,
  } = useChess();

  return (
    <div className="" suppressHydrationWarning>
      <div className="flex justify-center items-center">
        <div className="max-w-[800px]">
          <Chessboard
            options={{
              position: chessPosition,
              onPieceDrop,
              onSquareClick,
              squareStyles,
              onPieceDrag,
            }}
          />
        </div>
      </div>
    </div>
  );
}
