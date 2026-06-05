import { Color } from "chess.js";
import { MoveClassification } from "../enums";
import {
  ChessBoard,
  OpeningName,
  RemainingPieces,
} from "../types/chess";
import { EMPTY_PIECE_COUNT } from "../components/custom-chess-board/components/game-player-info/constants";
import openingNames from "../../../../public/opening-names.json";
import { ENGINE_DEPTH_MAX, ENGINE_DEPTH_MIN } from "@/components/header/components/settings-modal/constants";

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
  if (deviceMemory >= 16) {
    hash = 1024;
  } else if (deviceMemory >= 8) {
    hash = 512;
  } else if (deviceMemory >= 4) {
    hash = 256;
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
  mateIn?: number | null;
} | null => {
  if (!infoMessage.startsWith("info") || !infoMessage.includes("score")) {
    return null;
  }

  const match = infoMessage.match(/score (cp|mate) (-?\d+)/);
  if (!match) return null;

  const type = match[1];
  const value = parseInt(match[2], 10);

  const isMate = type === "mate";
  const cpForSideToMove = isMate ? (value > 0 ? 10000 : -10000) : value;
  const cpForWhite = sideToMove === "w" ? cpForSideToMove : -cpForSideToMove;
  const whiteValue = cpForWhite / 100;
  const mateIn = isMate ? (sideToMove === "w" ? value : -value) : null;

  const WIN_PROB_K = 0.00368208;
  const rawWhiteShare = 1 / (1 + Math.exp(-WIN_PROB_K * cpForWhite));
  const whiteShare = Math.min(0.98, Math.max(0.02, rawWhiteShare));

  return {
    whiteValue,
    whiteShare,
    mateIn,
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
  currentWhiteShare?: number,
  previousWhiteShare?: number,
): MoveClassification => {
  if (openingName) return MoveClassification.OPENING;

  const normalizedPlayedMove = playedMove.trim().toLowerCase();
  const normalizedBestMove = bestMove.trim().toLowerCase();

  if (normalizedBestMove && normalizedPlayedMove === normalizedBestMove) {
    return MoveClassification.BEST;
  }

  if (legalMovesCount === 1) return MoveClassification.FORCED;

  if (currentWhiteShare != null && previousWhiteShare != null) {
    const winPctLoss =
      (playedBy === "w"
        ? previousWhiteShare - currentWhiteShare
        : currentWhiteShare - previousWhiteShare) * 100;

    const bothWinning =
      previousWhiteShare >= 0.9 && currentWhiteShare >= 0.9;
    const bothLosing =
      previousWhiteShare <= 0.1 && currentWhiteShare <= 0.1;
    const isAlreadyDecided = bothWinning || bothLosing;

    if (!isAlreadyDecided) {
      if (winPctLoss > 25) return MoveClassification.BLUNDER;
      if (winPctLoss > 12) return MoveClassification.MISTAKE;
    }
    if (winPctLoss > 6) return MoveClassification.INACCURACY;
    if (winPctLoss < -7) return MoveClassification.GREAT;
    if (winPctLoss > 2) return MoveClassification.GOOD;
    return MoveClassification.EXCELLENT;
  }

  const lossInPawns =
    playedBy === "w" ? previousEval - currentEval : currentEval - previousEval;

  if (lossInPawns > 3.0) return MoveClassification.BLUNDER;
  if (lossInPawns > 1.5) return MoveClassification.MISTAKE;
  if (lossInPawns > 0.7) return MoveClassification.INACCURACY;
  if (lossInPawns < -1.0) return MoveClassification.GREAT;
  if (lossInPawns > 0.2) return MoveClassification.GOOD;
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

export const clampEngineDepth = (depth: number) =>
  Math.min(ENGINE_DEPTH_MAX, Math.max(ENGINE_DEPTH_MIN, depth));
