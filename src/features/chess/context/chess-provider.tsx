"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Chess } from "chess.js";
import { useDispatch } from "react-redux";
import { ChessContextValue } from "../types/context";
import { setBestMove } from "../chess-slice";
import { ChessPositions } from "../components/custom-chess-board/types";
import { getEvaluationDataFromEngineInfo } from "../utils";

const ChessContext = createContext<ChessContextValue | null>(null);

export function ChessProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const chessJsRef = useRef<InstanceType<typeof Chess>>(new Chess());
  const [engine, setEngine] = useState<Worker | undefined>();
  const isCalculatingRef = useRef(false);
  const sideToMoveRef = useRef<"w" | "b">("w");
  const pendingResolverRef = useRef<(() => void) | null>(null);
  const pendingTargetIndexRef = useRef<number | null>(null);
  const latestEvaluationViewRef = useRef({
    whiteValue: 0,
    whiteShare: 0.5,
  });
  const movesCountRef = useRef(chessJsRef.current.moves().length);

  useEffect(() => {
    if (!dispatch) return;

    const worker = new Worker("/stockfish-nnue-16-single.js");

    worker.onmessage = (e) => {
      const message = e.data;

      const evaluationData = getEvaluationDataFromEngineInfo(
        message,
        sideToMoveRef.current,
      );

      if (evaluationData !== null) {
        latestEvaluationViewRef.current = evaluationData;
      }

      if (message.startsWith("bestmove")) {
        const bestMove = message.split(" ")[1];

        if (pendingTargetIndexRef.current !== null) {
          dispatch(
            setBestMove({
              index: pendingTargetIndexRef.current,
              bestMove,
              evaluationView: latestEvaluationViewRef.current,
              legalMovesCount: movesCountRef.current,
            }),
          );
          movesCountRef.current = chessJsRef.current.moves().length;
        }

        if (pendingResolverRef.current) {
          pendingResolverRef.current();
        }

        pendingResolverRef.current = null;
        pendingTargetIndexRef.current = null;
        isCalculatingRef.current = false;
      }
    };

    worker.postMessage("uci");
    worker.postMessage("isready");
    worker.postMessage("ucinewgame");

    setEngine(worker);

    return () => {
      worker.terminate();
    };
  }, [dispatch]);

  const runBestMoveAnalysis = useCallback(
    async (
      fen: string,
      depth: number = 15,
      targetIndex: number,
    ): Promise<void> => {
      if (!engine) return;

      await new Promise<void>((resolve) => {
        const waitUntilIdle = () => {
          if (!isCalculatingRef.current) {
            resolve();
            return;
          }

          setTimeout(waitUntilIdle, 20);
        };

        waitUntilIdle();
      });

      const fenParts = fen.trim().split(/\s+/);
      sideToMoveRef.current = fenParts[1] === "b" ? "b" : "w";
      movesCountRef.current = new Chess(fen).moves().length;
      latestEvaluationViewRef.current = {
        whiteValue: 0,
        whiteShare: 0.5,
      };

      return new Promise<void>((resolve) => {
        pendingResolverRef.current = resolve;
        pendingTargetIndexRef.current = targetIndex;
        isCalculatingRef.current = true;
        engine.postMessage(`position fen ${fen}`);
        engine.postMessage(`go depth ${depth}`);
      });
    },
    [engine],
  );

  const calculateBestMove = useCallback(
    (fen: string, targetIndex: number, depth: number = 15) => {
      void runBestMoveAnalysis(fen, depth, targetIndex);
    },
    [runBestMoveAnalysis],
  );

  const calculateBestMovesForPositions = useCallback(
    async (positions: ChessPositions, depth: number = 15) => {
      for (let index = 0; index < positions.length; index++) {
        const fen = positions[index].after;
        if (!fen) continue;
        await runBestMoveAnalysis(fen, depth, index);
      }
    },
    [runBestMoveAnalysis],
  );

  return (
    <ChessContext.Provider
      value={{
        chessJs: chessJsRef.current,
        engine,
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
