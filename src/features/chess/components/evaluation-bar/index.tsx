"use client";

import { useSelector } from "react-redux";
import { selectChessState } from "../../chess-slice";
import { cn } from "@/lib/utils";

export const EvaluationBar = () => {
  const { chessPositions, currentChessPositionIdx, isBoardFlipped } =
    useSelector(selectChessState);

  const formatEvaluation = (value: number): string => {
    if (Math.abs(value) >= 99) {
      return value > 0 ? "+M" : "-M";
    }

    const rounded = Math.round(value * 10) / 10;
    return rounded > 0 ? `+${rounded.toFixed(1)}` : rounded.toFixed(1);
  };

  const evaluationView =
    currentChessPositionIdx <= 0
      ? {
          whiteValue: 0,
          whiteShare: 0.5,
        }
      : (chessPositions[currentChessPositionIdx]?.evaluationView ??
        chessPositions[currentChessPositionIdx - 1]?.evaluationView ?? {
          whiteValue: 0,
          whiteShare: 0.5,
        });

  const blackValue = -evaluationView.whiteValue;
  const blackShare = 1 - evaluationView.whiteShare;

  return (
    <div
      className={cn(
        "self-stretch my-2 w-10 min-w-10 rounded-md border border-border overflow-hidden flex flex-col",
        isBoardFlipped && "flex-col-reverse",
      )}
    >
      <div
        className={cn(
          "bg-zinc-700 text-white flex items-start justify-center pt-1 text-xs font-semibold transition-all duration-300",
          isBoardFlipped && "items-end pt-0 pb-1",
        )}
        style={{ flexGrow: blackShare }}
      >
        {blackValue >= evaluationView.whiteValue && (
          <span>{formatEvaluation(blackValue)}</span>
        )}
      </div>
      <div
        className={cn(
          "bg-white text-black flex items-end justify-center pb-1 text-xs font-semibold transition-all duration-300",
          isBoardFlipped && "items-start pt-1 pb-0",
        )}
        style={{ flexGrow: evaluationView.whiteShare }}
      >
        {evaluationView.whiteValue >= blackValue && (
          <span>{formatEvaluation(evaluationView.whiteValue)}</span>
        )}
      </div>
    </div>
  );
};

export default EvaluationBar;
