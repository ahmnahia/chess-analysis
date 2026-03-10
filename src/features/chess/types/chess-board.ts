import { Chess, Move } from "chess.js";
import { MoveClassification } from "../enums";

export type ChessJs = InstanceType<typeof Chess>;

export type SquareStyles = Record<string, React.CSSProperties>;

export type PossibleMoves = { fromSquare: string; toSquares: string[] };

export type EvaluationView = {
  whiteValue: number;
  whiteShare: number;
};

export type ChessPositions = ChessPosition[];

export type Arrow = { startSquare: string; endSquare: string; color: string };

export interface ChessState {
  squareStyles: Record<string, React.CSSProperties>;
  possibleMoves: PossibleMoves;
  chessPositions: ChessPositions;
  currentChessPositionIdx: number;
}

export interface ChessPosition extends Partial<Move> {
  bestMove?: string;
  moveClassification?: MoveClassification;
  evaluationView?: EvaluationView;
  isCalculatingBestMove: boolean;
  isCheck?: boolean;
}
