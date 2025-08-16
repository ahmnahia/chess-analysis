import { chessClassNames } from "./constants";

export const toggleSquareClassName = (square: string, className: string) => {
  const squareEle = document.querySelector(`div[data-square="${square}"]`);
  squareEle?.classList.contains(className)
    ? squareEle?.classList.remove(className)
    : squareEle?.classList.add(className);
};

export const handlePossibleMovesClassNames = (possibleMoves: string[]) => {
  possibleMoves.forEach((epm) => {
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
