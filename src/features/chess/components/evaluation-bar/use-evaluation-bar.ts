import { useSelector } from "react-redux";
import { selectChessState, selectActivePosition } from "../../chess-slice";

export function useEvaluationBar() {
  const { currentChessPositionIdx, isBoardFlipped } =
    useSelector(selectChessState);
  const activePosition = useSelector(selectActivePosition);

  const formatEvaluation = (value: number): string => {
    if (Math.abs(value) >= 99) {
      return value > 0 ? "+M" : "-M";
    }

    const rounded = Math.round(value * 10) / 10;
    return rounded > 0 ? `+${rounded.toFixed(1)}` : rounded.toFixed(1);
  };

  const evaluationView =
    currentChessPositionIdx === -1 && !activePosition?.evaluationView
      ? {
          whiteValue: 0,
          whiteShare: 0.5,
        }
      : (activePosition?.evaluationView ?? {
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
