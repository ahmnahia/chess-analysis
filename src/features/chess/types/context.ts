import { Chess } from "chess.js";

export type ChessContextValue = {
	chessJs: InstanceType<typeof Chess>;
	engine?: Worker;
	calculateBestMove: (fen: string, depth?: number) => void;
};

