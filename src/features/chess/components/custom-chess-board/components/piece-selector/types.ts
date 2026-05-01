import type { RefObject } from "react";
import { Color } from "chess.js";
import { PromotionPiece } from "./enum";

export type SquareLayout = { left: number; top: number; size: number };

export interface PieceSelectorProps {
  color: Color;
  onPieceSelect: (piece: PromotionPiece) => void;
  chessBoardRef: RefObject<HTMLDivElement | null>;
  promotionPendingToSquare: string;
  isBoardFlipped: boolean;
  cancelPromotionSelection: () => void;
}
