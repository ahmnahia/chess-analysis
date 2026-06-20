import { Color } from "chess.js";
import { ChessClassNames, MoveClassification } from "../enums";
import { PossibleMoves } from "../types/chess";

export const toggleSquareClassName = (
  square: string,
  className: ChessClassNames | MoveClassification,
) => {
  const squareEle = document.querySelector(`div[data-square="${square}"]`);
  squareEle?.classList.contains(className)
    ? squareEle?.classList.remove(className)
    : squareEle?.classList.add(className);
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

export const getCastleSquare = (move: string, turn: Color) => {
  if (move === "O-O") return turn === "w" ? "g1" : "g8";
  return turn === "w" ? "c1" : "c8";
};

export const filterSquareString = (square: string, turn: Color) => {
  const modifiedSquare = square.replace("#", "").replace("+", "");

  if (modifiedSquare.startsWith("O-O")) {
    return getCastleSquare(square, turn);
  }
  if (modifiedSquare.includes("=")) {
    return modifiedSquare.split("=")[0].slice(2);
  }
  if (modifiedSquare.length === 4) {
    return modifiedSquare.slice(2);
  }
  if (modifiedSquare.length === 3) {
    return modifiedSquare.slice(1);
  }
  return modifiedSquare;
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
    } else {
      toggleSquareClassName(square, ChessClassNames.POSSIBLE_MOVE);
    }
  });
};

export const clearAllSquareClassNames = () => {
  const allClasses = [
    ...Object.values(ChessClassNames),
    ...Object.values(MoveClassification),
  ];
  allClasses.forEach((cls) => {
    document.querySelectorAll(`.${cls}`).forEach((el) => {
      el.classList.remove(cls);
    });
  });
};

export const handleMoveClassificationClassNames = (
  square?: string,
  moveClassification?: MoveClassification,
  prevSquare?: string,
  prevMoveClassification?: MoveClassification,
) => {
  const getToSquareFromLan = (lan?: string) => {
    if (!lan || lan.length < 4) return undefined;
    return lan.slice(2, 4);
  };

  const toSquare = getToSquareFromLan(square);
  const prevToSquare = getToSquareFromLan(prevSquare);

  if (square && toSquare && moveClassification) {
    toggleSquareClassName(toSquare, ChessClassNames.MOVE_CLASSIFICATION);
    toggleSquareClassName(toSquare, moveClassification);
  }
  if (prevSquare && prevToSquare && prevMoveClassification) {
    toggleSquareClassName(prevToSquare, ChessClassNames.MOVE_CLASSIFICATION);
    toggleSquareClassName(prevToSquare, prevMoveClassification);
  }
};
