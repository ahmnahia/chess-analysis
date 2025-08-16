"use client";
import { useEffect, useState } from "react";
import { startingBoard } from "@/features/chess2/constants";

export default function useEngine() {
  const [engine, setEngine] = useState<Worker | undefined>();



  useEffect(() => {
    const worker = new Worker("/stockfish-nnue-16-single.js");
    worker.onmessage = (e) => {
      //   console.log("Stockfish:", e.data);
    };

    worker.postMessage("uci");
    worker.postMessage("isready");
    worker.postMessage("ucinewgame");
    // worker.postMessage('position startpos moves e2e4 e7e5');
    // worker.postMessage('go depth 10');

    setEngine(worker);
  }, []);

  return { engine };
}
