import { ChessPositions } from "./chess-board";
import { Chess } from "chess.js";

export type ChessContextValue = {
	chessJs: InstanceType<typeof Chess>;
	engine?: Worker;
	calculateBestMove: (fen: string, targetIndex: number, depth?: number,) => void;
	calculateBestMovesForPositions: (positions: ChessPositions, depth?: number) => Promise<void>;
};

