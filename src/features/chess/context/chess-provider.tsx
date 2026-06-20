"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
} from "react";
import { Chess } from "chess.js";
import { ChessContextValue } from "../types/context";
import { ChessPositions } from "../types/chess";
import useEngine from "../hooks/use-engine";
import { getOpeningName } from "../utils";
import { SHALLOW_DEPTH_FOR_TRIVIAL_POSITIONS } from "../constants";

const ChessContext = createContext<ChessContextValue | null>(null);

export function ChessProvider({ children }: { children: ReactNode }) {
  const chessJsRef = useRef<InstanceType<typeof Chess>>(new Chess());
  const { engine, isEngineLoading, runBestMoveAnalysis } = useEngine();

  const calculateBestMove = useCallback(
    (
      fen: string,
      targetIndex: number,
      legalMovesCount: number,
      depth: number = 12,
    ) => {
      runBestMoveAnalysis(fen, targetIndex, legalMovesCount, depth);
    },
    [runBestMoveAnalysis],
  );

  const calculateBestMovesForPositions = useCallback(
    async (positions: ChessPositions, depth: number = 12) => {
      const shallowDepth = Math.min(SHALLOW_DEPTH_FOR_TRIVIAL_POSITIONS, depth);
      const board = new Chess();
      const sanHistory: string[] = [];
      let stillInOpeningBook = true;

      for (let index = 0; index < positions.length; index++) {
        const { before, after: fen } = positions[index];
        if (!fen) continue;
        sanHistory.push(positions[index].san || "");

        let legalMovesCount = 0;
        if (before) {
          board.load(before);
          legalMovesCount = board.moves().length;
        } else {
          board.load(fen);
          legalMovesCount = board.moves().length;
        }

        let isOpening = false;
        if (stillInOpeningBook) {
          if (getOpeningName(sanHistory) !== null) {
            isOpening = true;
          } else {
            stillInOpeningBook = false;
          }
        }
        const isForced = legalMovesCount === 1;

        const effectiveDepth = isOpening || isForced ? shallowDepth : depth;

        await runBestMoveAnalysis(fen, index, legalMovesCount, effectiveDepth);
      }
    },
    [runBestMoveAnalysis],
  );

  return (
    <ChessContext.Provider
      value={{
        chessJs: chessJsRef.current,
        engine,
        isEngineLoading,
        calculateBestMove,
        calculateBestMovesForPositions,
      }}
    >
      {children}
    </ChessContext.Provider>
  );
}

export function useChessContext() {
  const context = useContext(ChessContext);

  if (!context) {
    throw new Error("useChessContext must be used within ChessProvider");
  }

  return context;
}
