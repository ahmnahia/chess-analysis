import { Chess } from "chess.js";

export type ChessJs = InstanceType<typeof Chess>;

export type SquareStyles = Record<string, React.CSSProperties>;

export type PossibleMoves = { fromSquare: string; toSquares: string[] };

export type ChessPosition = { fen: string; bestMove?: string };

export type ChessPositions = ChessPosition[];

export interface ChessState {
	squareStyles: Record<string, React.CSSProperties>;
	possibleMoves: PossibleMoves;
	chessPositions: ChessPositions;
	currentChessPositionIdx: number;
	evaluation: number;
}

