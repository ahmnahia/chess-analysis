"use client";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectChessState,
  setPossibleMoves,
  setChessPosition,
} from "./chessSlice";
import { SquareHandlerArgs } from "react-chessboard";
import { setSquareStyles } from "./chessSlice";
import { Piece, PieceSymbol, Square } from "chess.js";
import { squareStylesCss } from "./styles";
import { Chess } from "chess.js";
import {
  filterSquareString,
  handlePossibleMovesClassNames,
  toggleSquareClassName,
} from "./utils";
import { PieceDropHandlerArgs, PieceHandlerArgs } from "react-chessboard";

// to fix Uncaught TypeError: Do not know how to serialize a BigInt
declare global {
  interface BigInt {
    toJSON(): Number;
  }
}

BigInt.prototype.toJSON = function () {
  return Number(this);
};

export default function useChess() {
  const { squareStyles, possibleMoves, chessPosition } =
    useSelector(selectChessState);
  const dispatch = useDispatch();

  const chessJsRef = useRef<InstanceType<typeof Chess>>(new Chess());
  const chessJs = chessJsRef.current;

  useEffect(() => {
    if (possibleMoves.toSquares.length > 0) {
      handlePossibleMovesClassNames(possibleMoves.toSquares);
    }
  }, [possibleMoves]);

  useEffect(() => {
    dispatch(setChessPosition(chessJs.fen()));
  }, []);

  function onSquareClick(args: SquareHandlerArgs) {
    if (possibleMoves.toSquares.length > 0) {
      for (let i = 0; i < possibleMoves.toSquares.length; i++) {
        if (possibleMoves.toSquares[i].includes(args.square)) {
          chessJs.move({
            from: possibleMoves.fromSquare,
            to: filterSquareString(possibleMoves.toSquares[i]),
          });
          // update the position state upon successful move to trigger a re-render of the chessboard
          dispatch(setChessPosition(chessJs.fen()));
          return;
        }
      }
    }

    const newPossibleMoves = chessJsRef.current.moves({
      square: args.square as Square,
    });

    dispatch(
      setPossibleMoves({ fromSquare: args.square, toSquares: newPossibleMoves })
    );
  }

  // handle piece drop
  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    // type narrow targetSquare potentially being null (e.g. if dropped off board)
    if (!targetSquare) {
      return false;
    }

    // try to make the move according to chess.js logic
    try {
      chessJs.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for example simplicity
      });

      // update the position state upon successful move to trigger a re-render of the chessboard
      dispatch(setChessPosition(chessJs.fen()));

      // return true as the move was successful
      return true;
    } catch {
      // return false as the move was not successful
      return false;
    }
  }
  const onPieceDrag = ({ square, piece, isSparePiece }: PieceHandlerArgs) => {
    const possibleMoves = chessJs.moves({ square: square as Square });
    dispatch(
      setPossibleMoves({
        fromSquare: square ? square : "",
        toSquares: possibleMoves,
      })
    );
  };

  console.log(possibleMoves);

  return {
    chessJs,
    onSquareClick,
    squareStyles,
    onPieceDrop,
    chessPosition,
    onPieceDrag,
  };
}
