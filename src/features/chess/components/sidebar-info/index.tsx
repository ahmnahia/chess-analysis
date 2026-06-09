"use client";
import React, { Fragment } from "react";
import { ReactSVG } from "react-svg";
import useSidebarInfo from "./use-sidebar-info";
import { Button } from "@/components/ui/button";
import { MOVE_CLASSIFICATION_TEXTS, SIDEBAR_INFO_CLASSES } from "./constants";
import UserProfileModal from "../user-profile-modal";
import { cn } from "@/lib/utils";
import { ClearBoardModal } from "../clear-board-modal";
import MoveButton from "./components/move-button/index";
import { Spinner } from "@/components/ui/spinner";
import Progress from "./components/progress";
import EvaluationGraph from "./components/evaluation-graph";
import { MoveClassification } from "../../enums";
import { ChessPosition } from "../../types/chess";

export default function SidebarInfo() {
  const {
    activeRef,
    navButtons,
    customChessPositions,
    chessPositions,
    activePositions,
    handleChessPosition,
    isMoveActive,
    shouldShowCustomMoves,
    isLatestCustomMove,
    openingName,
    isAnalysisLoading,
    isEngineLoading,
    analizedCount,
    isAnalysisCompleteForMainLine,
    previousBestMove,
    currentBestMove,
    activePosition,
  } = useSidebarInfo();

  return (
    <div className="flex min-h-0 w-full max-w-[450px] max-lg:max-w-full flex-col bg-zinc-100 dark:bg-dark-800 rounded-sm py-4 max-lg:pt-4 max-lg:pb-0 max-lg:mb-18 max-lg:mt-4 max-lg:h-auto lg:h-[85%] lg:self-center">
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
        <div
          className={cn(
            "flex items-center justify-center gap-2 px-4",
            !isAnalysisLoading && "invisible",
          )}
        >
          <p className="text-center text-sm">Loading analysis...</p>
          <Spinner className="size-4" />
        </div>
        {analizedCount !== chessPositions.length && (
          <div className="w-full px-4">
            <Progress
              label="Analyzing..."
              analizedCount={analizedCount}
              movesCount={chessPositions.length}
            />
          </div>
        )}
        {activePosition?.moveClassification && (
          <div className="my-2 flex w-full flex-row flex-wrap items-center justify-center gap-x-2 gap-y-2 px-4 py-1">
            <div className="inline-flex max-w-full shrink-0 items-center gap-1">
              <div
                className={cn(
                  "move-classification",
                  activePosition.moveClassification,
                  SIDEBAR_INFO_CLASSES.moveClassificationBadge,
                )}
              />
              <span className="text-sm leading-none flex items-center">
                <ReactSVG
                  src={`/icons/piece-${currentBestMove?.iconLetter?.toLowerCase()}.svg`}
                  className={currentBestMove?.iconClassName}
                />
                {currentBestMove?.move}{" "}
                {MOVE_CLASSIFICATION_TEXTS[activePosition.moveClassification as MoveClassification]}
              </span>
            </div>
            {activePosition.moveClassification !== MoveClassification.BEST &&
              activePosition.moveClassification !==
                MoveClassification.OPENING && (
                <div className="inline-flex max-w-full shrink-0 items-center gap-1">
                  <div
                    className={cn(
                      "move-classification",
                      MoveClassification.BEST,
                      SIDEBAR_INFO_CLASSES.moveClassificationBadge,
                    )}
                  />
                  <span className="text-sm leading-none flex items-center">
                    <ReactSVG
                      src={`/icons/piece-${previousBestMove?.iconLetter?.toLowerCase()}.svg`}
                      className={previousBestMove?.iconClassName}
                    />
                    {previousBestMove?.move}{" "}
                    {MOVE_CLASSIFICATION_TEXTS.BEST_ALTERNATIVE}
                  </span>
                </div>
              )}
          </div>
        )}
      </div>
      <div className="my-3 min-h-0 flex-1 overflow-y-auto max-lg:max-h-[40vh] max-lg:flex-none">
        {activePositions.length > 0 ? (
          activePositions.map((pos: ChessPosition, idx: number) => {
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
                    {customChessPositions.map((cPos: ChessPosition, cusMoveIdx: number) => (
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
            {!isEngineLoading && (
              <p className="text-center text-sm">No moves yet</p>
            )}
            {isEngineLoading && (
              <div className="flex items-center justify-center gap-2">
                <p className="text-center text-sm">Loading engine</p>
                <Spinner className="size-4" />
              </div>
            )}
            <UserProfileModal />
          </div>
        )}
      </div>
      {isAnalysisCompleteForMainLine && <EvaluationGraph />}
      <div className="flex flex-wrap justify-center gap-4 max-xl:gap-1 max-lg:gap-x-3 max-[350px]:gap-x-1! px-4 max-lg:px-1 max-lg:fixed max-lg:w-full max-lg:bg-zinc-100 dark:max-lg:bg-zinc-800 max-lg:left-0 max-lg:bottom-0 max-lg:py-2 max-lg:z-50 max-lg:border-t border-zinc-200 dark:border-zinc-950">
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
