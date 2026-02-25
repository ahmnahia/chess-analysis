"use client";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectChessState,
  setPossibleMoves,
  setChessPosition,
} from "./chessSlice";
import { SquareHandlerArgs } from "react-chessboard";
import { Square } from "chess.js";
import { Chess } from "chess.js";
import {
  filterSquareString,
  handlePossibleMovesClassNames,
  getCurrentPosition,
  syncChessPositionWithCurrent,
} from "./utils";
import { PieceDropHandlerArgs, PieceHandlerArgs } from "react-chessboard";
import useEngine from "@/hooks/useEngine";

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
  const {
    squareStyles,
    possibleMoves,
    chessPositions,
    currentChessPosition,
    bestmove,
  } = useSelector(selectChessState);
  const dispatch = useDispatch();
  const { calculateBestMove } = useEngine();

  const chessJsRef = useRef<InstanceType<typeof Chess>>(new Chess());
  const chessJs = chessJsRef.current;

  // State for arrows
  const [arrows, setArrows] = useState<
    Array<{ startSquare: string; endSquare: string; color: string }>
  >([]);

  // Effect to update arrows when best move changes
  useEffect(() => {
    if (bestmove && bestmove !== "0000" && bestmove.length >= 4) {
      const startSquare = bestmove.slice(0, 2);
      const endSquare = bestmove.slice(2, 4);
      setArrows([{ startSquare, endSquare, color: "#00ff00" }]);
    } else {
      setArrows([]);
    }
  }, [bestmove]);
  

  useEffect(() => {
    // Initialize with starting position if no positions exist
    if (chessPositions.length === 0) {
      dispatch(setChessPosition(chessJs.fen()));
    }
  }, []);

  function onSquareClick(args: SquareHandlerArgs) {
    if (possibleMoves.toSquares.length > 0) {
      for (let i = 0; i < possibleMoves.toSquares.length; i++) {
        if (possibleMoves.toSquares[i].includes(args.square)) {
          calculateBestMove(chessPositions[chessPositions.length - 1]);
          chessJs.move({
            from: possibleMoves.fromSquare,
            to: filterSquareString(possibleMoves.toSquares[i]),
          });
          // update the position state upon successful move to trigger a re-render of the chessboard
          dispatch(setChessPosition(chessJs.fen()));
          // syncChessPositionWithCurrent(
          //   currentChessPosition,
          //   chessPositions,
          //   chessJs
          // );
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

    // Sync chess.js with current position from Redux
    // syncChessPositionWithCurrent(currentChessPosition, chessPositions, chessJs);

    try {
      chessJs.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      dispatch(setChessPosition(chessJs.fen()));
      calculateBestMove(chessPositions[chessPositions.length - 1]);

      return true;
    } catch {
      return false;
    }
  }

  const onPieceDrag = ({ square }: PieceHandlerArgs) => {
    // syncChessPositionWithCurrent(currentChessPosition, chessPositions, chessJs);

    const possibleMoves = chessJs.moves({ square: square as Square });
    dispatch(
      setPossibleMoves({
        fromSquare: square ? square : "",
        toSquares: possibleMoves,
      })
    );
  };

  return {
    chessJs,
    onSquareClick,
    squareStyles,
    onPieceDrop,
    chessPositions,
    onPieceDrag,
    bestmove,
    getCurrentPosition: () => getCurrentPosition(chessPositions, chessJs.fen()),
    currentPosition:
      currentChessPosition || getCurrentPosition(chessPositions, chessJs.fen()),
    arrows,
  };
}
