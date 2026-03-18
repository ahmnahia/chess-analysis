"use client";
import { ReactSVG } from "react-svg";
import useSidebarInfo from "./use-sidebar-info";
import { Button } from "@/components/ui/button";
import { SIDEBAR_INFO_CLASSES } from "./constants";
import UserProfileModal from "../user-profile-modal";
import { cn } from "@/lib/utils";

export default function SidebarInfo() {
  const {
    activeRef,
    navButtons,
    chessPositions,
    currentChessPositionIdx,
    handleChessPosition,
  } = useSidebarInfo();

  console.log("CHESS POSITIONS IN SIDEBAR: ", chessPositions);

  return (
    <div className="h-full w-[300px] flex flex-col justify-between bg-zinc-100 dark:bg-dark-800 rounded-sm py-4 ">
      <div className="flex items-center justify-center gap-2">
        <span className="p-1 bg-white dark:bg-zinc-950 rounded-full">
          <ReactSVG
            src="/icons/star.svg"
            className="[&_svg]:w-6 [&_svg]:fill-dark-800 [&_svg]:dark:fill-dark-200"
          />
        </span>
        <h3 className="text-center">Game Review</h3>
      </div>
      <div className="my-6 max-h-[40vh] overflow-y-auto">
        {chessPositions.length > 0 ? (
          chessPositions.map((pos, idx) => {
            if (idx % 2 == 0)
              return (
                <div
                  key={pos.before ?? "" + idx + pos.san}
                  className="flex items-center gap-5 text-sm text-dark-800 dark:text-dark-400 even:bg-zinc-200 even:dark:bg-dark-900 py-1 px-4"
                >
                  <span className="w-4">{Math.floor(idx / 2) + 1}.</span>
                  <button
                    className="flex justify-start w-16 cursor-pointer"
                    onClick={() => {
                      handleChessPosition(idx);
                    }}
                  >
                    <div
                      ref={currentChessPositionIdx === idx ? activeRef : null}
                      className={cn(
                        "flex gap-1 py-1 pe-2",
                        currentChessPositionIdx === idx &&
                          "bg-zinc-300 dark:bg-dark-700",
                      )}
                    >
                      <ReactSVG
                        src={`/icons/piece-${pos.piece}.svg`}
                        className="[&_svg]:w-5 [&_svg]:h-5 fill-dark-500 dark:fill-white"
                      />
                      <span>{pos.san?.toLocaleLowerCase()}</span>
                    </div>
                  </button>
                  {chessPositions[idx + 1] && (
                    <button
                      className="flex justify-start cursor-pointer"
                      onClick={() => {
                        handleChessPosition(idx + 1);
                      }}
                    >
                      <div
                        ref={currentChessPositionIdx === idx + 1 ? activeRef : null}
                        className={cn(
                          "flex gap-1 py-1 pe-2",
                          currentChessPositionIdx === idx + 1 &&
                            "bg-zinc-300 dark:bg-dark-700",
                        )}
                      >
                        <ReactSVG
                          src={`/icons/piece-${chessPositions[idx + 1].piece}.svg`}
                          className="[&_svg]:w-5 [&_svg]:h-5 fill-dark-900 dark:fill-dark-600"
                        />
                        <span>
                          {chessPositions[idx + 1]?.san?.toLowerCase()}
                        </span>
                      </div>
                    </button>
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
      <div className="flex justify-between px-4">
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
      </div>
    </div>
  );
}
