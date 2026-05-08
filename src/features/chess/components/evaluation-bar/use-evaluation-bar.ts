import { useSelector } from "react-redux";
import { selectChessState, selectActivePosition } from "../../chess-slice";

export function useEvaluationBar() {
  const { currentChessPositionIdx, isBoardFlipped } =
    useSelector(selectChessState);
  const activePosition = useSelector(selectActivePosition);

  const formatEvaluation = (value: number): string => {
    const mateIn = evaluationView.mateIn;
    if (mateIn != null) {
      return `M${Math.abs(mateIn)}`;
    }

    const rounded = Math.round(value * 10) / 10;
    return rounded > 0 ? `+${rounded.toFixed(1)}` : rounded.toFixed(1);
  };

  const evaluationView =
    currentChessPositionIdx === -1 && !activePosition?.evaluationView
      ? {
          whiteValue: 0,
          whiteShare: 0.5,
          mateIn: null,
        }
      : (activePosition?.evaluationView ?? {
          whiteValue: 0,
          whiteShare: 0.5,
          mateIn: null,
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
