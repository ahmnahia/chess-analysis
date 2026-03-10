import { ChessClassNames, MoveClassification } from "./enums";
import { ChessJs, PossibleMoves } from "./types/chess-board";
import { Color } from "chess.js";

const toggleSquareClassName = (square: string, className: ChessClassNames | MoveClassification) => {
  const squareEle = document.querySelector(`div[data-square="${square}"]`);
  squareEle?.classList.contains(className)
    ? squareEle?.classList.remove(className)
    : squareEle?.classList.add(className);
};

export const handlePossibleMovesClassNames = (
  possibleMoves: PossibleMoves,
  turn: Color,
) => {
  const filteredPossibleMoves = filterPossibleToSquaresMoves(possibleMoves);
  filteredPossibleMoves?.toSquares?.forEach((epm) => {
    const square = filterSquareString(epm, turn);
    if (epm.includes("x")) {
      // piece can be captured
      toggleSquareClassName(square, ChessClassNames.POSSIBLE_MOVE);
      toggleSquareClassName(square, ChessClassNames.CAN_CAPTURE_PIECE);
    } else if (epm.startsWith("O-O")) {
      // castling
      if (epm === "O-O")
        toggleSquareClassName(square, ChessClassNames.POSSIBLE_MOVE);
      if (epm === "O-O-O")
        toggleSquareClassName(square, ChessClassNames.POSSIBLE_MOVE);
    } else if (epm.length === 3) {
      toggleSquareClassName(square, ChessClassNames.POSSIBLE_MOVE);
    } else {
      toggleSquareClassName(square, ChessClassNames.POSSIBLE_MOVE);
    }
  });
};

export const getCastleSquare = (move: string, turn: Color) => {
  if (move === "O-O") return turn === "w" ? "g1" : "g8";
  else return turn === "w" ? "c1" : "c8";
};

export const filterSquareString = (square: string, turn: Color) => {
  const modifiedSquare = square.replace("#", "").replace("+", "");

  if (modifiedSquare.startsWith("O-O")) {
    return getCastleSquare(square, turn);
  } else if (modifiedSquare.includes("=")) {
    return modifiedSquare.split("=")[0].slice(2);
  } else if (modifiedSquare.length === 4) {
    return modifiedSquare.slice(2);
  } else if (modifiedSquare.length === 3) {
    return modifiedSquare.slice(1);
  }
  return modifiedSquare;
};

export const getEvaluationDataFromEngineInfo = (
  infoMessage: string,
  sideToMove: Color,
): {
  whiteValue: number;
  whiteShare: number;
} | null => {
  if (!infoMessage.startsWith("info") || !infoMessage.includes("score")) {
    return null;
  }

  const match = infoMessage.match(/score (cp|mate) (-?\d+)/);
  if (!match) return null;

  const type = match[1];
  const value = parseInt(match[2], 10);

  const scoreForSideToMove =
    type === "cp" ? value / 100 : value > 0 ? 100 : -100;
  const whiteValue =
    sideToMove === "w" ? scoreForSideToMove : -scoreForSideToMove;

  const sigmoid = (input: number) => 1 / (1 + Math.exp(-0.7 * input));
  const rawWhiteShare = sigmoid(whiteValue);
  const whiteShare = Math.min(0.98, Math.max(0.02, rawWhiteShare));

  return {
    whiteValue,
    whiteShare,
  };
};

export const pgnToFens = (chessJs: ChessJs, pgnString: string): string[] => {
  const fens: string[] = [];

  try {
    chessJs.loadPgn(pgnString);

    const moves = chessJs.history();

    chessJs.reset();
    fens.push(chessJs.fen());
    for (const move of moves) {
      chessJs.move(move);
      fens.push(chessJs.fen());
    }

    return fens;
  } catch (error) {
    console.error("Error parsing PGN:", error);
    return fens;
  }
};

export const filterPossibleToSquaresMoves = (
  possibleMoves: PossibleMoves,
): PossibleMoves => {
  const newToSquares: string[] = [];
  const uniqueToSquares: Record<string, boolean> = {};
  possibleMoves.toSquares.forEach((move) => {
    if (move.includes("8=") || move.includes("1=")) {
      const toSquare = move.split("=")[0];
      if (!uniqueToSquares[toSquare]) {
        uniqueToSquares[toSquare] = true;
        newToSquares.push(toSquare);
      }
    } else {
      newToSquares.push(move);
    }
  });

  const newPossibleMoves = { ...possibleMoves, toSquares: newToSquares };
  return newPossibleMoves;
};

export const getMoveClassification = (
  playedMove: string,
  currentEval: number,
  previousEval: number,
  bestMove: string,
  legalMovesCount: number,
  playedBy: Color,
): MoveClassification => {
  const normalizedPlayedMove = playedMove.trim().toLowerCase();
  const normalizedBestMove = bestMove.trim().toLowerCase();

  console.log("legal moves count", legalMovesCount);
  

  if (normalizedBestMove && normalizedPlayedMove === normalizedBestMove) {
    return MoveClassification.BEST;
  }

  if (legalMovesCount === 1) return MoveClassification.FORCED;

  const lossInPawns =
    playedBy === "w" ? previousEval - currentEval : currentEval - previousEval;

  if (lossInPawns > 2.5) return MoveClassification.BLUNDER;
  if (lossInPawns > 1.0) return MoveClassification.MISTAKE;
  if (lossInPawns > 0.5) return MoveClassification.INACCURACY;
  if (lossInPawns < -1.0) return MoveClassification.GREAT;
  if (lossInPawns > 0.1) return MoveClassification.GOOD;
  return MoveClassification.EXCELLENT;
};

export const handleMoveClassificationClassNames = (
  square?: string,
  moveClassification?: MoveClassification,
  prevSquare?: string,
  prevMoveClassification?: MoveClassification,
) => {

  if (square && moveClassification) {
    toggleSquareClassName(square.slice(-2), ChessClassNames.MOVE_CLASSIFICATION);
    toggleSquareClassName(square.slice(-2), moveClassification);
  }
  if (prevSquare && prevMoveClassification) {
    toggleSquareClassName(prevSquare.slice(-2), ChessClassNames.MOVE_CLASSIFICATION);
    toggleSquareClassName(prevSquare.slice(-2), prevMoveClassification);
  }
};
