"use client";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Color } from "chess.js";
import { selectChessState } from "../../chess-slice";
import { PiecesCount } from "../../types/chess";
import { TOTAL_COUNT_PIECES } from "./constants";

export default function useGamePlayerInfo(color: Color) {
  const { chessPositions, currentChessPositionIdx } =
    useSelector(selectChessState);

  const missingPieces = useMemo(() => {
    const remainingPiecesWhite =
      chessPositions[currentChessPositionIdx]?.remainingPieces?.black;
    const remainingPiecesBlack =
      chessPositions[currentChessPositionIdx]?.remainingPieces?.white;

    if (!remainingPiecesWhite || !remainingPiecesBlack) {
      return undefined;
    }

    const byColor = (Object.entries(TOTAL_COUNT_PIECES) as [
      keyof PiecesCount,
      number,
    ][]).reduce(
      (acc, [piece, count]) => {
        acc.w[piece] = count - remainingPiecesWhite[piece];
        acc.b[piece] = count - remainingPiecesBlack[piece];
        return acc;
      },
      { w: {} as PiecesCount, b: {} as PiecesCount },
    );

    return color === "w" ? byColor.w : byColor.b;
  }, [chessPositions, currentChessPositionIdx, color]);

  return { missingPieces };
}
