"use client";
import React, { Fragment, ReactNode, ForwardedRef } from "react";
import { ReactSVG } from "react-svg";
import useSidebarInfo from "./use-sidebar-info";
import { Button } from "@/components/ui/button";
import { SIDEBAR_INFO_CLASSES } from "./constants";
import UserProfileModal from "../user-profile-modal";
import { cn } from "@/lib/utils";
import { ClearBoardModal } from "../clear-board-modal";
import { ChessPosition } from "../custom-chess-board/types";

interface MoveButtonProps {
  pos: ChessPosition;
  isActive: boolean;
  onClick: () => void;
  className?: string;
  isLatest?: boolean;
}

const MoveButton = React.forwardRef<HTMLElement, MoveButtonProps>(
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

MoveButton.displayName = "MoveButton";

export default function SidebarInfo() {
  const {
    activeRef,
    navButtons,
    customChessPositions,
    activePositions,
    handleChessPosition,
    isMoveActive,
    shouldShowCustomMoves,
    isLatestCustomMove,
    openingName,
  } = useSidebarInfo();

  return (
    <div className="h-full w-[300px] max-md:w-full flex flex-col justify-between bg-zinc-100 dark:bg-dark-800 rounded-sm py-4 max-md:pt-4 max-md:pb-0 max-md:mb-18">
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="flex items-center gap-2">
          <span className="p-1 bg-white dark:bg-zinc-950 rounded-full">
            <ReactSVG
              src="/icons/star.svg"
              className="[&_svg]:w-6 [&_svg]:fill-dark-800 [&_svg]:dark:fill-dark-200"
            />
          </span>
          <h3 className="text-center">Game Review</h3>
        </div>
        {openingName && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium px-4 text-center">
            {openingName}
          </p>
        )}
      </div>

      <div className="my-6 max-h-[40vh] overflow-y-auto">
        {activePositions.length > 0 ? (
          activePositions.map((pos, idx) => {
            if (idx % 2 !== 0) return null;

            return (
              <div
                key={pos.before ?? "" + idx + pos.san}
                className={cn(
                  SIDEBAR_INFO_CLASSES.moveRow,
                  "even:bg-zinc-200 even:dark:bg-dark-900",
                )}
              >
                <span className="w-1/5">{Math.floor(idx / 2) + 1}.</span>

                <MoveButton
                  ref={activeRef}
                  pos={pos}
                  isActive={isMoveActive(idx)}
                  onClick={() => handleChessPosition(idx)}
                />

                {activePositions[idx + 1] && (
                  <MoveButton
                    ref={activeRef}
                    pos={activePositions[idx + 1]}
                    isActive={isMoveActive(idx + 1)}
                    onClick={() => handleChessPosition(idx + 1)}
                  />
                )}

                {shouldShowCustomMoves(idx) && (
                  <div
                    key={`custom-moves-${idx}`}
                    className={cn(
                      SIDEBAR_INFO_CLASSES.moveRow,
                      "bg-blue-200 dark:bg-cyan-950 my-1 w-full rounded-sm px-0",
                    )}
                  >
                    {customChessPositions.map((cPos, cusMoveIdx) => (
                      <Fragment key={`custom-move-fragment-${cusMoveIdx}`}>
                        {cusMoveIdx % 2 === 0 && (
                          <span className="w-1/5"></span>
                        )}
                        <MoveButton
                          ref={activeRef}
                          pos={cPos}
                          isActive={false}
                          isLatest={isLatestCustomMove(cusMoveIdx)}
                          onClick={() => handleChessPosition(cusMoveIdx)}
                        />
                      </Fragment>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center gap-4 px-4">
            <p className="text-center text-sm text-gray-500">No moves yet</p>
            <UserProfileModal />
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 max-xl:gap-1 max-md:gap-x-3 max-[350px]:gap-x-1! px-4 max-md:px-1 max-md:fixed max-md:w-full max-md:bg-zinc-100 dark:max-md:bg-zinc-800 max-md:left-0 max-md:bottom-0 max-md:py-2 max-md:z-50">
        {navButtons.map((button) => (
          <Button
            key={button.key}
            variant="outline"
            className={SIDEBAR_INFO_CLASSES.navButton}
            onClick={button.onClick}
            disabled={button.disabled}
          >
            <ReactSVG
              src={button.icon}
              className={`${SIDEBAR_INFO_CLASSES.navIcon} ${
                button.rotate && "transform rotate-180"
              }`}
            />
          </Button>
        ))}
        <ClearBoardModal />
      </div>
    </div>
  );
}
