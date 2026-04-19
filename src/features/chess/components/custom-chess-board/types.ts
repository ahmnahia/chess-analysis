import { Chess, Color, Move, PieceSymbol, Square } from "chess.js";
import { MoveClassification } from "../../enums";
import { ChessComGame } from "../../types/chess-com";

export type ChessJs = InstanceType<typeof Chess>;

export type SquareStyles = Record<string, React.CSSProperties>;

export type PossibleMoves = { fromSquare: string; toSquares: string[] };

export type EvaluationView = {
  whiteValue: number;
  whiteShare: number;
};

export type Arrow = { startSquare: string; endSquare: string; color: string };

export interface ChessState {
  squareStyles: Record<string, React.CSSProperties>;
  possibleMoves: PossibleMoves;
  chessPositions: ChessPositions;
  customChessPositions: ChessPositions;
  currentChessPositionIdx: number;
  isBoardFlipped: boolean;
  apiGame?: ChessComGame;
}

export type ChessBoard = ({
  square: Square;
  type: PieceSymbol;
  color: Color;
} | null)[][];

export type PiecesCount = Record<PieceSymbol, number>;

export type RemainingPieces = {
  white: PiecesCount;
  black: PiecesCount;
};

export interface ChessPosition extends Partial<Move> {
  bestMove?: string;
  moveClassification?: MoveClassification;
  evaluationView?: EvaluationView;
  isCalculatingBestMove: boolean;
  isCheck?: boolean;
  remainingPieces?: RemainingPieces;
}

export type ChessPositions = ChessPosition[];
