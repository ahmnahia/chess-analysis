"use client";
import { useSelector } from "react-redux";
import { Chessboard } from "react-chessboard";
import { selectChessState } from "../../chess-slice";
import useChessBoard from "./use-chess-board";
import GamePlayerInfo from "../GamePlayerInfo";
import { cn } from "@/lib/utils";

export default function CustomChessBoard() {
  const {
    squareStyles,
    whiteCapturedDiff,
    blackCapturedDiff,
    currentPosition,
    arrows,
    apiGame,
    onPieceDrag,
    onPieceDrop,
    onSquareClick,
  } = useChessBoard();
  const { isBoardFlipped } = useSelector(selectChessState);

  return (
    <div
      className={cn(isBoardFlipped && "flex flex-col-reverse")}
      suppressHydrationWarning
    >
      <div className={cn(isBoardFlipped ? "mt-4" : "mb-4")}>
        <GamePlayerInfo
          name={apiGame?.black.username ?? "Black"}
          score={apiGame?.black.rating}
          bgColor="white"
          color="b"
          capturedDiff={blackCapturedDiff}
        />
      </div>
      <div className="max-w-[80vh]">
        <Chessboard
          options={{
            position: currentPosition,
            onPieceDrop,
            onSquareClick,
            squareStyles,
            onPieceDrag,
            arrows,
            boardOrientation: isBoardFlipped ? "black" : "white",
          }}
        />
      </div>
      <div className={cn(isBoardFlipped ? "mb-4" : "mt-4")}>
        <GamePlayerInfo
          name={apiGame?.white.username ?? "White"}
          score={apiGame?.white.rating}
          color="w"
          capturedDiff={whiteCapturedDiff}
        />
      </div>
    </div>
  );
}
