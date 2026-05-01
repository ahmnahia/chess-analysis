"use client";
import { useSelector } from "react-redux";
import { Chessboard } from "react-chessboard";
import { selectChessState } from "../../chess-slice";
import useChessBoard from "./use-chess-board";
import GamePlayerInfo from "./components/GamePlayerInfo";
import { cn } from "@/lib/utils";
import PieceSelector from "./components/piece-selector";

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
    promotionPending,
    promotionColor,
    onPromotionPieceSelect,
    chessBoardRef,
    cancelPromotionSelection,
  } = useChessBoard();
  const { isBoardFlipped } = useSelector(selectChessState);

  return (
    <div
      className={cn(isBoardFlipped && "flipped-board flex flex-col-reverse")}
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
      <div ref={chessBoardRef} className="max-w-[80vh] relative">
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
        {promotionPending && promotionColor ? (
          <>
            <div
              className="absolute inset-0 z-10 bg-black/30"
              aria-hidden
            />
            <PieceSelector
              isBoardFlipped={isBoardFlipped}
              color={promotionColor}
              onPieceSelect={onPromotionPieceSelect}
              chessBoardRef={chessBoardRef}
              promotionPendingToSquare={promotionPending.to}
              cancelPromotionSelection={cancelPromotionSelection}
            />
          </>
        ) : null}
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
