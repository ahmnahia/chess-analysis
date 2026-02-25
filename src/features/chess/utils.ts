import { chessClassNames } from "./constants";
import { ChessJs, ChessPositions, PossibleMoves } from "./types";

export const toggleSquareClassName = (square: string, className: string) => {
  const squareEle = document.querySelector(`div[data-square="${square}"]`);
  squareEle?.classList.contains(className)
    ? squareEle?.classList.remove(className)
    : squareEle?.classList.add(className);
};

export const handlePossibleMovesClassNames = (possibleMoves: PossibleMoves) => {
  console.log("possibleMoves", possibleMoves);

  possibleMoves?.toSquares?.forEach((epm) => {
    const square = filterSquareString(epm);
    if (epm.includes("x")) {
      // piece can be captured
      toggleSquareClassName(square, chessClassNames.POSSIBLE_MOVE);
      toggleSquareClassName(square, chessClassNames.CAN_CAPTURE_PIECE);
    } else if (epm.length === 3) {
      toggleSquareClassName(square, chessClassNames.POSSIBLE_MOVE);
    } else {
      toggleSquareClassName(square, chessClassNames.POSSIBLE_MOVE);
    }
  });
};

export const filterSquareString = (square: string) => {
  const modifiedSquare = square.replace("#", "").replace("+", "");

  if (modifiedSquare.length === 4) {
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
  chessPositions: string[],
  defaultFen: string
) => {
  return chessPositions.length > 0
    ? chessPositions[chessPositions.length - 1]
    : defaultFen;
};

export const syncChessPosition = (
  chessPositions: string[],
  chessJs: ChessJs
) => {
  const currentFen = getCurrentPosition(chessPositions, chessJs.fen());
  if (chessJs.fen() !== currentFen) {
    chessJs.load(currentFen);
  }
};

export const syncChessPositionWithCurrent = (
  currentChessPosition: string,
  chessPositions: string[],
  chessJs: ChessJs
) => {
  const currentFen =
    currentChessPosition || getCurrentPosition(chessPositions, chessJs.fen());
  if (chessJs.fen() !== currentFen) {
    chessJs.load(currentFen);
  }
};

export const pgnToFens = (
  chessJs: ChessJs,
  pgnString: string
): ChessPositions => {
  const fens: ChessPositions = [];

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
    return [];
  }
};
