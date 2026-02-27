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
import { setBestMove, setEvaluation } from "../chess-slice";

const ChessContext = createContext<ChessContextValue | null>(null);

export function ChessProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const chessJsRef = useRef<InstanceType<typeof Chess>>(new Chess());
  const [engine, setEngine] = useState<Worker | undefined>();
  const isCalculatingRef = useRef(false);
  const sideToMoveRef = useRef<"w" | "b">("w");

  useEffect(() => {
    const worker = new Worker("/stockfish-nnue-16-single.js");

    worker.onmessage = (e) => {
      const message = e.data;

      if (message.startsWith("info") && message.includes("score")) {
        const match = message.match(/score (cp|mate) (-?\d+)/);

        if (match) {
          const type = match[1];
          const value = parseInt(match[2], 10);

          let evaluation;

          if (type === "cp") {
            evaluation = value / 100;
          } else {
            evaluation = value > 0 ? 100 : -100;
          }

          const whitePerspectiveEvaluation =
            sideToMoveRef.current === "w" ? evaluation : -evaluation;

          dispatch(setEvaluation(whitePerspectiveEvaluation));
        }
      }

      if (message.startsWith("bestmove")) {
        const bestMove = message.split(" ")[1];
        dispatch(setBestMove(bestMove));
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

  const calculateBestMove = useCallback(
    (fen: string, depth: number = 15) => {
      if (!engine || isCalculatingRef.current) return;

      const fenParts = fen.trim().split(/\s+/);
      sideToMoveRef.current = fenParts[1] === "b" ? "b" : "w";

      isCalculatingRef.current = true;
      engine.postMessage(`position fen ${fen}`);
      engine.postMessage(`go depth ${depth}`);
    },
    [engine],
  );

  return (
    <ChessContext.Provider
      value={{
        chessJs: chessJsRef.current,
        engine,
        calculateBestMove,
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
