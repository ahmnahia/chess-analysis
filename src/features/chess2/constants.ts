import kingB from "@/assets/pieces/black/king.svg";
import queenB from "@/assets/pieces/black/queen.svg";
import rookB from "@/assets/pieces/black/rook.svg";
import bishopB from "@/assets/pieces/black/bishop.svg";
import knghitB from "@/assets/pieces/black/knight.svg";
import pawnB from "@/assets/pieces/black/pawn.svg";

import kingW from "@/assets/pieces/white/king.svg";
import queenW from "@/assets/pieces/white/queen.svg";
import rookW from "@/assets/pieces/white/rook.svg";
import bishopW from "@/assets/pieces/white/bishop.svg";
import knghitW from "@/assets/pieces/white/knight.svg";
import pawnW from "@/assets/pieces/white/pawn.svg";

import { ChessBoardType, PieceKey, PieceEntry } from "./types";

export const startingBoard: ChessBoardType = [
  [
    { pieceLetter: "r", hasBeenMoved: false },
    { pieceLetter: "n", hasBeenMoved: false },
    { pieceLetter: "b", hasBeenMoved: false },
    { pieceLetter: "q", hasBeenMoved: false },
    { pieceLetter: "k", hasBeenMoved: false },
    { pieceLetter: "b", hasBeenMoved: false },
    { pieceLetter: "n", hasBeenMoved: false },
    { pieceLetter: "r", hasBeenMoved: false },
  ],
  [
    { pieceLetter: "p", hasBeenMoved: false },
    { pieceLetter: "p", hasBeenMoved: false },
    { pieceLetter: "p", hasBeenMoved: false },
    { pieceLetter: "p", hasBeenMoved: false },
    { pieceLetter: "p", hasBeenMoved: false },
    { pieceLetter: "p", hasBeenMoved: false },
    { pieceLetter: "p", hasBeenMoved: false },
    { pieceLetter: "p", hasBeenMoved: false },
  ],
  [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
  [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
  [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
  [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
  [
    { pieceLetter: "P", hasBeenMoved: false },
    { pieceLetter: "P", hasBeenMoved: false },
    { pieceLetter: "P", hasBeenMoved: false },
    { pieceLetter: "P", hasBeenMoved: false },
    { pieceLetter: "P", hasBeenMoved: false },
    { pieceLetter: "P", hasBeenMoved: false },
    { pieceLetter: "P", hasBeenMoved: false },
    { pieceLetter: "P", hasBeenMoved: false },
  ],
  [
    { pieceLetter: "R", hasBeenMoved: false },
    { pieceLetter: "N", hasBeenMoved: false },
    { pieceLetter: "B", hasBeenMoved: false },
    { pieceLetter: "Q", hasBeenMoved: false },
    { pieceLetter: "K", hasBeenMoved: false },
    { pieceLetter: "B", hasBeenMoved: false },
    { pieceLetter: "N", hasBeenMoved: false },
    { pieceLetter: "R", hasBeenMoved: false },
  ],
];

export const piecesImgsMap: Record<PieceKey, PieceEntry> = {
  k: { img: kingB, title: "king" },
  q: { img: queenB, title: "queen" },
  r: { img: rookB, title: "rook" },
  b: { img: bishopB, title: "bishop" },
  n: { img: knghitB, title: "knight" },
  p: { img: pawnB, title: "pawn" },
  K: { img: kingW, title: "king" },
  Q: { img: queenW, title: "queen" },
  R: { img: rookW, title: "rook" },
  B: { img: bishopW, title: "bishop" },
  N: { img: knghitW, title: "knight" },
  P: { img: pawnW, title: "pawn" },
};
