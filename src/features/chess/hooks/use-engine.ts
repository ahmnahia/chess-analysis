"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setBestMove } from "../chess-slice";
import { EvaluationView } from "../types/chess";
import {
  chooseEngine,
  getAdaptiveEngineConfig,
  getEvaluationDataFromEngineInfo,
} from "../utils";

export default function useEngine() {
  const dispatch = useDispatch();
  const [engine, setEngine] = useState<Worker | undefined>();
  const [isEngineLoading, setIsEngineLoading] = useState(true);
  const isCalculatingRef = useRef(false);
  const sideToMoveRef = useRef<"w" | "b">("w");
  const pendingResolverRef = useRef<(() => void) | null>(null);
  const pendingTargetIndexRef = useRef<number | null>(null);
  const latestEvaluationViewRef = useRef<EvaluationView>({
    whiteValue: 0,
    whiteShare: 0.5,
    mateIn: null,
  });
  const movesCountChessJsRef = useRef<number>(0);

  useEffect(() => {
    if (!dispatch) return;

    const { threads, hash, supportsMultiThread, isWasmSupported } =
      getAdaptiveEngineConfig();

    const workerPath = `/engines/${chooseEngine(threads, hash, supportsMultiThread, isWasmSupported)}`;

    const worker = new window.Worker(workerPath);

    worker.onmessage = (e) => {
      const message = e.data;

      if (message.endsWith("readyok")) {
        setIsEngineLoading(false);
      }

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
              legalMovesCount: movesCountChessJsRef.current,
            }),
          );
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
    worker.postMessage(`setoption name Threads value ${threads}`);
    worker.postMessage(`setoption name Hash value ${hash}`);
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
      targetIndex: number,
      legalMovesCount: number,
      depth: number = 10,
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
      sideToMoveRef.current = fenParts[1] as "w" | "b";
      movesCountChessJsRef.current = legalMovesCount;
      latestEvaluationViewRef.current = {
        whiteValue: 0,
        whiteShare: 0.5,
        mateIn: null,
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

  return {
    engine,
    isEngineLoading,
    runBestMoveAnalysis,
  };
}
