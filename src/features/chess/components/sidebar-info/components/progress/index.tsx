import React from "react";
import { ProgressProps } from "./types";
import { Progress as CnProgress } from "@/components/ui/progress";

export default function Progress({
  label,
  analizedCount,
  movesCount,
}: ProgressProps) {
  const percentage = (analizedCount / movesCount) * 100;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between">
        <span>{label}</span>
        <span>{percentage.toFixed(0)}%</span>
      </div>
      <CnProgress value={percentage} className="w-full" />
    </div>
  );
}
