import { Chess, Color } from "chess.js";

export type ChessJs = InstanceType<typeof Chess>;

export type SquareStyles = Record<string, React.CSSProperties>;

export type PossibleMoves = { fromSquare: string; toSquares: string[] };

export type MovePlayed = { fromSquare: string; toSquare: string };

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

export type MoveClassification =
  | "forced"
  | "inaccuracy"
  | "mistake"
  | "blunder"
  | "great"
  | "good"
  | "excellent"
  | "best";

export type ChessPosition = {
  fen: string;
  movePlayed?: MovePlayed;
  bestMove?: string;
  moveClassification?: MoveClassification;
  evaluationView?: EvaluationView;
  isCalculatingBestMove: boolean;
  isCheck?: boolean;
  currentTurn: Color;
  movedToSquare: string;
};
