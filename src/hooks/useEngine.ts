"use client";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setBestMove } from "@/features/chess/chessSlice";

export default function useEngine() {
  const [engine, setEngine] = useState<Worker | undefined>();
  const dispatch = useDispatch();
  const isCalculatingRef = useRef(false);

  useEffect(() => {
    const worker = new Worker("/stockfish-nnue-16-single.js");
    
    worker.onmessage = (e) => {
      const message = e.data;
      console.log("Stockfish:", message);
      
      // Parse best move from engine response
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
  }, [dispatch]);

  const calculateBestMove = (fen: string, depth: number = 15) => {
    if (!engine || isCalculatingRef.current) return;
    
    isCalculatingRef.current = true;
    engine.postMessage(`position fen ${fen}`);
    engine.postMessage(`go depth ${depth}`);
  };

  return { engine, calculateBestMove };
}
