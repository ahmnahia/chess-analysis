import { Color } from "chess.js";
import { MoveClassification } from "../enums";
import {
  ChessBoard,
  OpeningName,
  RemainingPieces,
} from "../types/chess";
import { EMPTY_PIECE_COUNT } from "../components/custom-chess-board/components/GamePlayerInfo/constants";
import openingNames from "../../../../public/opening-names.json";

export const getAdaptiveEngineConfig = () => {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const hardwareThreads = nav.hardwareConcurrency ?? 2;
  const deviceMemory = nav.deviceMemory ?? 4;

  const isCrossOriginIsolated =
    typeof window !== "undefined" && !!window.crossOriginIsolated;
  const threads = isCrossOriginIsolated
    ? Math.min(Math.max(hardwareThreads - 1, 1), 12)
    : 1;

  let hash = 64;
  if (deviceMemory >= 8) {
    hash = 256;
  } else if (deviceMemory >= 4) {
    hash = 128;
  } else if (deviceMemory <= 1) {
    hash = 16;
  }

  const isWasmSupported =
    typeof WebAssembly === "object" &&
    typeof WebAssembly.instantiate === "function";

  return {
    threads,
    hash,
    supportsMultiThread: !!window.SharedArrayBuffer && !!crossOriginIsolated,
    isWasmSupported,
  };
};

export const getEvaluationDataFromEngineInfo = (
  infoMessage: string,
  sideToMove: Color,
): {
  whiteValue: number;
  whiteShare: number;
} | null => {
  if (!infoMessage.startsWith("info") || !infoMessage.includes("score")) {
    return null;
  }

  const match = infoMessage.match(/score (cp|mate) (-?\d+)/);
  if (!match) return null;

  const type = match[1];
  const value = parseInt(match[2], 10);

  const scoreForSideToMove =
    type === "cp" ? value / 100 : value > 0 ? 100 : -100;
  const whiteValue =
    sideToMove === "w" ? scoreForSideToMove : -scoreForSideToMove;

  const sigmoid = (input: number) => 1 / (1 + Math.exp(-0.7 * input));
  const rawWhiteShare = sigmoid(whiteValue);
  const whiteShare = Math.min(0.98, Math.max(0.02, rawWhiteShare));

  return {
    whiteValue,
    whiteShare,
  };
};

export const getMoveClassification = (
  playedMove: string,
  currentEval: number,
  previousEval: number,
  bestMove: string,
  legalMovesCount: number,
  playedBy: Color,
  openingName?: OpeningName,
): MoveClassification => {
  const normalizedPlayedMove = playedMove.trim().toLowerCase();
  const normalizedBestMove = bestMove.trim().toLowerCase();

  if (openingName) {
    return MoveClassification.OPENING;
  }

  if (normalizedBestMove && normalizedPlayedMove === normalizedBestMove) {
    return MoveClassification.BEST;
  }

  if (legalMovesCount === 1) return MoveClassification.FORCED;

  const lossInPawns =
    playedBy === "w" ? previousEval - currentEval : currentEval - previousEval;

  if (lossInPawns > 2.5) return MoveClassification.BLUNDER;
  if (lossInPawns > 1.0) return MoveClassification.MISTAKE;
  if (lossInPawns > 0.5) return MoveClassification.INACCURACY;
  if (lossInPawns < -1.0) return MoveClassification.GREAT;
  if (lossInPawns > 0.1) return MoveClassification.GOOD;
  return MoveClassification.EXCELLENT;
};

export const getRemainingAndCapturedPieces = (
  board: ChessBoard,
): RemainingPieces => {
  const remainingPieces: RemainingPieces = {
    white: { ...EMPTY_PIECE_COUNT },
    black: { ...EMPTY_PIECE_COUNT },
  };

  for (const row of board) {
    for (const cell of row) {
      if (cell) {
        const colorKey = cell.color === "w" ? "white" : "black";
        remainingPieces[colorKey][cell.type]++;
      }
    }
  }

  return remainingPieces;
};

export const chooseEngine: (
  threads: number,
  hash: number,
  supportsMultiThread: boolean,
  isWasmSupported: boolean,
) => string = (threads, hash, supportsMultiThread, isWasmSupported) => {
  if (!isWasmSupported) return "stockfish-18-asm.js";

  if (!supportsMultiThread || threads === 1) {
    return hash <= 32
      ? "stockfish-18-lite-single.js"
      : "stockfish-18-single.js";
  }
  if (threads > 2 && hash > 64) {
    return "stockfish-18.js";
  }

  return "stockfish-18-lite.js";
};

export function formatMovesToOpeningKey(history: string[]): string {
  const parts: string[] = [];
  for (let i = 0; i < history.length; i++) {
    if (i % 2 === 0) {
      parts.push(`${Math.floor(i / 2) + 1}. ${history[i]}`);
    } else {
      parts.push(history[i]);
    }
  }
  return parts.join(" ");
}

export function getOpeningName(history: string[]): OpeningName {
  const openingMap = openingNames as Record<string, string>;
  let lastFoundName: OpeningName = null;

  for (let i = 1; i <= history.length; i++) {
    const subHistory = history.slice(0, i);
    const key = formatMovesToOpeningKey(subHistory);

    if (openingMap[key]) {
      lastFoundName = openingMap[key];
    } else {
      lastFoundName = null;
      break;
    }
  }

  return lastFoundName;
}
