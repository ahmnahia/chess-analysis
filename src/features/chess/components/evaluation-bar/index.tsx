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
        "self-stretch my-2 w-10 max-md:w-full min-w-10 max-md:min-w-6 md:overflow-hidden flex flex-col max-md:flex-row bg-transparent",
        isBoardFlipped && "flex-col-reverse",
      )}
    >
      <div
        className={cn(
          "bg-zinc-700 text-white flex items-start max-md:h-6 max-md:items-center justify-center max-md:justify-start pt-1 max-md:p-0 max-md:pl-1 text-xs max-md:text-[10px] font-semibold transition-all duration-300 md:rounded-t-md max-md:rounded-l-md",
          isBoardFlipped &&
            "items-end pt-0 pb-1 md:rounded-b-md md:rounded-t-none",
        )}
        style={{ flexGrow: blackShare }}
      >
        {blackValue >= evaluationView.whiteValue && (
          <span>{formatEvaluation(blackValue)}</span>
        )}
      </div>
      <div
        className={cn(
          "bg-zinc-100 dark:bg-white text-black flex items-end max-md:items-center justify-center max-md:justify-end max-md:h-6  pb-1 max-md:p-0 max-md:pr-1 text-xs max-md:text-[10px] font-semibold transition-all duration-300 md:rounded-b-md max-md:rounded-r-md",
          isBoardFlipped &&
            "items-start pt-1 pb-0 md:rounded-t-md md:rounded-b-none",
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
