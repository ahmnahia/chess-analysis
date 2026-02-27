"use client";

import { useSelector } from "react-redux";
import { selectChessState } from "../../chess-slice";

export const EvaluationBar = () => {
  const { evaluation } = useSelector(selectChessState);
  const whiteEvaluation = evaluation;

  const sigmoid = (value: number) => 1 / (1 + Math.exp(-0.7 * value));
  const rawWhiteShare = sigmoid(whiteEvaluation);
  const whiteShare = Math.min(0.98, Math.max(0.02, rawWhiteShare));
  const blackShare = 1 - whiteShare;

  const formatEval = (value: number) => {
    if (Math.abs(value) >= 99) {
      return value > 0 ? "+M" : "-M";
    }

    const rounded = Math.round(value * 10) / 10;
    const signed = rounded > 0 ? `+${rounded.toFixed(1)}` : rounded.toFixed(1);
    return signed;
  };

  return (
    <div className="self-stretch my-2 w-10 min-w-10 rounded-md border border-border overflow-hidden flex flex-col">
      <div
        className="bg-black text-white flex items-start justify-center pt-1 text-xs font-semibold transition-all duration-300"
        style={{ flexGrow: blackShare }}
      >
        <span>{formatEval(-whiteEvaluation)}</span>
      </div>
      <div
        className="bg-white text-black flex items-end justify-center pb-1 text-xs font-semibold transition-all duration-300"
        style={{ flexGrow: whiteShare }}
      >
        <span>{formatEval(whiteEvaluation)}</span>
      </div>
    </div>
  );
};

export default EvaluationBar;
