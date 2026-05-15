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
      const board = new Chess();
      for (let index = 0; index < positions.length; index++) {
        const fen = positions[index].after;
        if (!fen) continue;
        board.load(fen);
        const legalMovesCount = board.moves().length;
        await runBestMoveAnalysis(fen, index, legalMovesCount, depth);
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
