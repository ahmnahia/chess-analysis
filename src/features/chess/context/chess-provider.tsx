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
import { ChessPositions } from "../types/chess-board";

const ChessContext = createContext<ChessContextValue | null>(null);

export function ChessProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const chessJsRef = useRef<InstanceType<typeof Chess>>(new Chess());
  const [engine, setEngine] = useState<Worker | undefined>();
  const isCalculatingRef = useRef(false);
  const sideToMoveRef = useRef<"w" | "b">("w");
  const pendingResolverRef = useRef<(() => void) | null>(null);
  const pendingTargetIndexRef = useRef<number | null>(null);
  const latestEvaluationRef = useRef(0);

  useEffect(() => {
    const worker = new Worker("/stockfish-nnue-16-single.js");

    worker.onmessage = (e) => {
      const message = e.data;
      
      if (message.startsWith("info") && message.includes("score")) {
        const match = message.match(/score (cp|mate) (-?\d+)/);

        if (match) {
          const type = match[1];
          const value = parseInt(match[2], 10);


          if (type === "cp") {
            latestEvaluationRef.current = value / 100;
          } else {
            latestEvaluationRef.current = value > 0 ? 100 : -100;
          }

          latestEvaluationRef.current =
            sideToMoveRef.current === "w" ? latestEvaluationRef.current : -latestEvaluationRef.current;
        }
      }

      if (message.startsWith("bestmove")) {
        const bestMove = message.split(" ")[1];

        if (pendingTargetIndexRef.current !== null) {
          dispatch(
            setBestMove({
              index: pendingTargetIndexRef.current,
              bestMove,
              evaluation: latestEvaluationRef.current,
            }),
          );
        } else {
          dispatch(setBestMove({bestMove, evaluation: latestEvaluationRef.current}));
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
      targetIndex?: number,
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
      latestEvaluationRef.current = 0;

      return new Promise<void>((resolve) => {
        pendingResolverRef.current = resolve;
        pendingTargetIndexRef.current =
          typeof targetIndex === "number" ? targetIndex : null;
        isCalculatingRef.current = true;
        engine.postMessage(`position fen ${fen}`);
        engine.postMessage(`go depth ${depth}`);
      });
    },
    [engine],
  );

  const calculateBestMove = useCallback(
    (fen: string, depth: number = 15, targetIndex?: number) => {
      void runBestMoveAnalysis(fen, depth, targetIndex);
    },
    [runBestMoveAnalysis],
  );

  const calculateBestMovesForPositions = useCallback(
    async (positions: ChessPositions, depth: number = 15) => {
      for (let index = 0; index < positions.length; index++) {
        const fen = positions[index].fen;
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
