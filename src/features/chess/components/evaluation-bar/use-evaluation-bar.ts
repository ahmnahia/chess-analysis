import { useSelector } from "react-redux";
import { selectChessState } from "../../chess-slice";

export function useEvaluationBar() {
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

  return {
    isBoardFlipped,
    blackShare,
    blackValue,
    evaluationView,
    formatEvaluation,
  };
}
