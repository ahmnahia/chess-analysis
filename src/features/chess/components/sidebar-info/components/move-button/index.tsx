import React from "react";
import { ReactSVG } from "react-svg";
import { SIDEBAR_INFO_CLASSES } from "../../constants";
import { cn } from "@/lib/utils";
import { MoveButtonProps } from "./types";

export default React.forwardRef<HTMLElement, MoveButtonProps>(
  ({ pos, isActive, onClick, className, isLatest }, ref) => {
    return (
      <button
        ref={
          isActive || isLatest
            ? (ref as React.RefObject<HTMLButtonElement>)
            : null
        }
        className={cn("w-2/5", className)}
        onClick={onClick}
      >
        <div
          className={cn(
            SIDEBAR_INFO_CLASSES.moveContainer,
            "w-3/4",
            (isActive || isLatest) && SIDEBAR_INFO_CLASSES.activeBackground,
          )}
        >
          <ReactSVG
            src={`/icons/piece-${pos.piece}.svg`}
            className={cn(
              SIDEBAR_INFO_CLASSES.pieceIcon,
              pos.color === "w"
                ? "fill-dark-500 dark:fill-white"
                : "fill-dark-900 dark:fill-dark-600",
            )}
          />
          <span className="lowercase">{pos.san}</span>
        </div>
      </button>
    );
  },
);
