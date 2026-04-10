import { ChessPositions } from "../components/custom-chess-board/types";
import { Chess } from "chess.js";

export type ChessContextValue = {
  chessJs: InstanceType<typeof Chess>;
  engine?: Worker;
  calculateBestMove: (
    fen: string,
    targetIndex: number,
    legalMovesCount: number,
    depth?: number,
  ) => void;
  calculateBestMovesForPositions: (
    positions: ChessPositions,
    depth?: number,
  ) => Promise<void>;
};
