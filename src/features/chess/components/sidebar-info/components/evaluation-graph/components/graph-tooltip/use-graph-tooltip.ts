import { TIP_CHAR_W, TIP_GAP, TIP_H, TIP_PAD_X } from "./constants";
import { Line } from "../../types";

export default function useGraphTooltip(
  hasHover: boolean,
  lineHoverIdx: number,
  lines: Line[],
  VIEW_W: number,
  equityY: number,
) {
  const hoveredLine =
    hasHover && lineHoverIdx >= 0 ? lines[lineHoverIdx] : undefined;

  const tipText = hoveredLine
    ? hoveredLine.mateIn != null
      ? `M${Math.abs(hoveredLine.mateIn)}`
      : hoveredLine.eval.toFixed(1)
    : "";
  const tipW = Math.max(10, tipText.length * TIP_CHAR_W + TIP_PAD_X * 2);
  const placeRight = hoveredLine
    ? hoveredLine.x + TIP_GAP + tipW <= VIEW_W - 0.5
    : true;
  const tipX = hoveredLine
    ? placeRight
      ? hoveredLine.x + TIP_GAP
      : hoveredLine.x - TIP_GAP - tipW
    : 0;
  const tipY = equityY - TIP_H / 2;
  return {
    tipX,
    tipY,
    tipW,
    tipText,
    hoveredLine,
  };
}
