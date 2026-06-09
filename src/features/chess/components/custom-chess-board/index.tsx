"use client";
import { useSelector } from "react-redux";
import { Chessboard } from "react-chessboard";
import { selectChessState } from "../../chess-slice";
import useChessBoard from "./use-chess-board";
import GamePlayerInfo from "./components/game-player-info";
import { cn } from "@/lib/utils";
import PieceSelector from "./components/piece-selector";
import { Spinner } from "@/components/ui/spinner";

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
    isBulkAnalysisRunning,
    notifyWaitForAnalysis,
  } = useChessBoard();
  const state = useSelector(selectChessState);
  const { isBoardFlipped } = state;

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
      <div
        ref={chessBoardRef}
        className="relative aspect-square max-lg:w-full max-lg:max-w-[80vh] lg:w-[min(65vw,calc(100dvh-200px))]"
      >
        {isBulkAnalysisRunning && (
          <div
            className="absolute inset-0 z-10 flex cursor-not-allowed items-center justify-center bg-black/30 transition-opacity"
            onClick={notifyWaitForAnalysis}
          >
            <Spinner className="size-10 text-white" />
          </div>
        )}
        <Chessboard
          options={{
            position: currentPosition,
            onPieceDrop,
            onSquareClick,
            squareStyles,
            onPieceDrag,
            arrows,
            boardOrientation: isBoardFlipped ? "black" : "white",
            boardStyle: { width: "100%", height: "100%" },
          }}
        />
        {promotionPending && promotionColor ? (
          <>
            <div className="absolute inset-0 z-10 bg-black/30" />
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
