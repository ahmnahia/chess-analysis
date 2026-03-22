"use client";

import { cn } from "@/lib/utils";
import { GAME_PLAYER_INFO_COLORS } from "./constants";
import { GamePlayInfoColors } from "./types";
import { PiecesCount } from "../custom-chess-board/types";
import { Color } from "chess.js";
import useGamePlayerInfo from "./use-game-player-info";
import { ReactSVG } from "react-svg";

interface GamePlayInfoProps {
  name: string;
  score?: number;
  bgColor?: GamePlayInfoColors;
  color: Color;
  capturedDiff?: number;
}

export default function GamePlayerInfo({
  name,
  score,
  color,
  bgColor = "orange",
  capturedDiff,
}: GamePlayInfoProps) {
  const selectedColor = GAME_PLAYER_INFO_COLORS[bgColor];
  const { missingPieces } = useGamePlayerInfo(color);

  return (
    <div className="flex gap-2 items-center rounded-lg">
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          selectedColor.background,
        )}
      >
        <span className={selectedColor.text}>
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <p className="text-xs font-medium">{name}</p>
          {score && <p className="text-xs text-gray-500">({score})</p>}
        </div>
        <div className="flex items-center">
          {missingPieces &&
            Object.keys(missingPieces).map((ep, idxI) => {
              return (
                <div
                  key={`missing-piece-div-${ep}-${idxI}`}
                  className="text-xs text-gray-500 flex"
                >
                  {Array.from({
                    length: missingPieces[ep as keyof PiecesCount],
                  }).map((_, idxJ) => (
                    <span
                      key={`missing-piece-span-${ep}-${idxJ}`}
                      className={idxJ > 0 ? "-ms-2" : ""}
                    >
                      <ReactSVG
                        src={`/icons/piece-${ep}.svg`}
                        className={cn(
                          "[&_svg]:w-4",
                          color === "w"
                            ? "[&_svg]:fill-dark-900 [&_svg]:dark:fill-dark-500"
                            : "[&_svg]:fill-dark-400 [&_svg]:dark:fill-white",
                        )}
                      />
                    </span>
                  ))}
                </div>
              );
            })}
          {capturedDiff !== undefined && capturedDiff > 0 && (
            <span className="text-xs text-gray-400 ms-1">
              +({capturedDiff})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
