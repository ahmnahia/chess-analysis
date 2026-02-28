import { ChessClassNames } from "./enums";
import { ChessJs, PossibleMoves } from "./types/chess-board";
import { Color } from "chess.js";

const toggleSquareClassName = (square: string, className: ChessClassNames) => {
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
  console.log("modified square: ", modifiedSquare);

  if (modifiedSquare.startsWith("O-O")) {
    return getCastleSquare(square, turn);
  } else if (modifiedSquare.includes("=")) {
    const newSquare = modifiedSquare.split("=")[0].slice(2);
    console.log("new square after handling promotion: ", newSquare);
    return newSquare;
  } else if (modifiedSquare.length === 4) {
    return modifiedSquare.slice(2);
  } else if (modifiedSquare.length === 3) {
    return modifiedSquare.slice(1);
  }
  return modifiedSquare;
};

export const calculateBestMove = (engine: Worker, fen: string) => {
  engine?.postMessage("position fen " + fen);
  engine?.postMessage("go depth 15");
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

const filterPossibleToSquaresMoves = (
  possibleMoves: PossibleMoves,
): PossibleMoves => {
  const newToSquares: string[] = [];
  const uniqueToSquares: Record<string, boolean> = {};
  possibleMoves.toSquares.forEach((move) => {
    if (move.includes("8=")) {
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
