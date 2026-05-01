import React from "react";
import { PieceSelectorProps } from "./types";
import { ReactSVG } from "react-svg";
import usePieceSelector from "./use-piece-selector";
import { cn } from "@/lib/utils";
import {
  PIECE_SELECTOR_ICON_BASE,
  PIECE_SELECTOR_OPTION_BUTTON,
} from "./constants";

export default function PieceSelector({
  color,
  onPieceSelect,
  chessBoardRef,
  promotionPendingToSquare,
  isBoardFlipped,
  cancelPromotionSelection,
}: PieceSelectorProps) {
  const { layout, pieces } = usePieceSelector(
    chessBoardRef,
    promotionPendingToSquare,
    color,
    isBoardFlipped,
  );

  if (!layout) return null;

  const { left, top, size } = layout;

  return (
    <div
      className={cn(
        "absolute z-30 flex overflow-hidden rounded-sm border border-dark-500/40 bg-white shadow-md dark:bg-dark-900",
        color === "b" && "dark:bg-white",
        color === "w" && "bg-zinc-900 dark:bg-zinc-900",
        color === "b" && (isBoardFlipped ? "flex-col" : "flex-col-reverse"),
        color === "w" && (isBoardFlipped ? "flex-col-reverse" : "flex-col"),
      )}
      style={{
        left,
        top,
        width: size,
        height: size * (pieces.length + 1),
      }}
      role="listbox"
      aria-label="Choose promotion piece"
    >
      {pieces.map((piece) => (
        <button
          type="button"
          key={piece}
          className={PIECE_SELECTOR_OPTION_BUTTON}
          style={{ width: size, height: size }}
          onClick={() => onPieceSelect(piece)}
        >
          <ReactSVG
            className={cn(
              PIECE_SELECTOR_ICON_BASE,
              color === "b" && "[&_svg]:fill-dark-900",
              color === "w" && "[&_svg]:fill-white",
            )}
            src={`/icons/piece-${piece}.svg`}
          />
        </button>
      ))}
      <button
        type="button"
        className={PIECE_SELECTOR_OPTION_BUTTON}
        style={{ width: size, height: size }}
        onClick={cancelPromotionSelection}
      >
        <ReactSVG
          className={cn(
            PIECE_SELECTOR_ICON_BASE,
            color === "b" && "[&_svg]:fill-dark-900",
            color === "w" && "[&_svg]:fill-white",
          )}
          src="/icons/xmark.svg"
        />
      </button>
    </div>
  );
}
