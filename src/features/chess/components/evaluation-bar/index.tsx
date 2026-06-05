"use client";

import { cn } from "@/lib/utils";
import { useEvaluationBar } from "./use-evaluation-bar";

export default function EvaluationBar() {
  const {
    isBoardFlipped,
    blackShare,
    blackValue,
    evaluationView,
    formatEvaluation,
  } = useEvaluationBar();

  return (
    <div
      className={cn(
        "self-stretch my-2 w-10 max-lg:w-full min-w-10 max-lg:min-w-6 lg:overflow-hidden flex flex-col max-lg:flex-row bg-transparent",
        isBoardFlipped && "flex-col-reverse",
      )}
    >
      <div
        className={cn(
          "bg-zinc-700 text-white flex items-start max-lg:h-6 max-lg:items-center justify-center max-lg:justify-start pt-1 max-lg:p-0 max-lg:pl-1 text-xs max-lg:text-[10px] font-semibold transition-all duration-300 lg:rounded-t-md max-lg:rounded-l-md",
          isBoardFlipped &&
            "items-end pt-0 pb-1 lg:rounded-b-md lg:rounded-t-none",
        )}
        style={{ flexGrow: blackShare }}
      >
        {blackValue >= evaluationView.whiteValue && (
          <span>{formatEvaluation(blackValue)}</span>
        )}
      </div>
      <div
        className={cn(
          "bg-zinc-100 dark:bg-white text-black flex items-end max-lg:items-center justify-center max-lg:justify-end max-lg:h-6  pb-1 max-lg:p-0 max-lg:pr-1 text-xs max-lg:text-[10px] font-semibold transition-all duration-300 lg:rounded-b-md max-lg:rounded-r-md",
          isBoardFlipped &&
            "items-start pt-1 pb-0 lg:rounded-t-md lg:rounded-b-none",
        )}
        style={{ flexGrow: evaluationView.whiteShare }}
      >
        {evaluationView.whiteValue >= blackValue && (
          <span>{formatEvaluation(evaluationView.whiteValue)}</span>
        )}
      </div>
    </div>
  );
}
