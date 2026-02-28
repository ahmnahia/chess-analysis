import { ChessClassNames } from "./enums";
import { ChessJs, ChessPositions, PossibleMoves } from "./types/chess-board";
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
  // console.log("possibleMoves", possibleMoves);

  possibleMoves?.toSquares?.forEach((epm) => {
    const square = filterSquareString(epm, turn);
    if (epm.includes("x")) {
      // piece can be captured
      toggleSquareClassName(square, ChessClassNames.POSSIBLE_MOVE);
      toggleSquareClassName(square, ChessClassNames.CAN_CAPTURE_PIECE);
    } else if (epm.startsWith("O-O")) {
      if (epm === "O-O")
        toggleSquareClassName(
          square,
          ChessClassNames.POSSIBLE_MOVE,
        );
      if (epm === "O-O-O")
        toggleSquareClassName(
          square,
          ChessClassNames.POSSIBLE_MOVE,
        );
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
  if(square.startsWith("O-O")) {
    return getCastleSquare(square, turn);
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

export const getCurrentPosition = (
  chessPositions: ChessPositions,
  defaultFen: string,
) => {
  return chessPositions.length > 0
    ? chessPositions[chessPositions.length - 1].fen
    : defaultFen;
};

export const syncChessPosition = (
  chessPositions: ChessPositions,
  chessJs: ChessJs,
) => {
  const currentFen = getCurrentPosition(chessPositions, chessJs.fen());
  if (chessJs.fen() !== currentFen) {
    chessJs.load(currentFen);
  }
};

export const syncChessPositionWithCurrent = (
  currentChessPositionIdx: number,
  chessPositions: ChessPositions,
  chessJs: ChessJs,
) => {
  const currentFen =
    currentChessPositionIdx >= 0 && currentChessPositionIdx < chessPositions.length
      ? chessPositions[currentChessPositionIdx].fen
      : getCurrentPosition(chessPositions, chessJs.fen());
  if (chessJs.fen() !== currentFen) {
    chessJs.load(currentFen);
  }
};

export const pgnToFens = (
  chessJs: ChessJs,
  pgnString: string,
): string[] => {
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
