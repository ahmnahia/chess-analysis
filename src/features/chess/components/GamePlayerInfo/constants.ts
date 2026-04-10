import { PieceSymbol } from "chess.js";
import { PiecesCount } from "../custom-chess-board/types";

export const GAME_PLAYER_INFO_COLORS = {
  orange: {
    background: "bg-orange-500",
    text: "text-white fw-bold",
  },
  white: {
    background: "bg-zinc-100 dark:bg-white",
    text: "text-zinc-900 fw-bold",
  },
} as const;

export const TOTAL_COUNT_PIECES: PiecesCount = {
  p: 8,
  n: 2,
  b: 2,
  r: 2,
  q: 1,
  k: 1,
};

export const PIECES_SCORE: PiecesCount = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

export const EMPTY_PIECE_COUNT: Record<PieceSymbol, number> = {
  p: 0,
  n: 0,
  b: 0,
  r: 0,
  q: 0,
  k: 0,
};
