"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PieceDropHandlerArgs, PieceHandlerArgs } from "react-chessboard";
import {
  selectChessState,
  setPossibleMoves,
  setChessPosition,
} from "../chess-slice";
import { SquareHandlerArgs } from "react-chessboard";
import { Square } from "chess.js";
import {
  filterSquareString,
  handlePossibleMovesClassNames,
  getCurrentPosition,
  syncChessPositionWithCurrent,
  getCastleSquare,
} from "../utils";
import { useChessContext } from "../context/chess-provider";
import "@/lib/bigintToJson";

export default function useChessBoard() {
  const {
    squareStyles,
    possibleMoves,
    chessPositions,
    currentChessPositionIdx,
  } = useSelector(selectChessState);
  const dispatch = useDispatch();
  const { chessJs, calculateBestMove } = useChessContext();

  const effectiveCurrentIdx =
    currentChessPositionIdx >= 0
      ? currentChessPositionIdx
      : chessPositions.length - 1;
  const effectiveCurrentFen =
    effectiveCurrentIdx >= 0
      ? chessPositions[effectiveCurrentIdx].fen
      : getCurrentPosition(chessPositions, chessJs.fen());
  const currentPositionData =
    effectiveCurrentIdx >= 0 ? chessPositions[effectiveCurrentIdx] : undefined;
  const bestMove = currentPositionData?.bestMove ?? "";

  console.log(chessPositions);
  

  // State for arrows
  const [arrows, setArrows] = useState<
    Array<{ startSquare: string; endSquare: string; color: string }>
  >([]);

  // Effect to update arrows when best move changes
  useEffect(() => {
    if (bestMove && bestMove !== "0000" && bestMove.length >= 4) {
      const startSquare = bestMove.slice(0, 2);
      const endSquare = bestMove.slice(2, 4);
      setArrows([{ startSquare, endSquare, color: "#00ff00" }]);
    } else {
      setArrows([]);
    }
  }, [bestMove]);

  useEffect(() => {
    // Initialize with starting position if no positions exist
    if (chessPositions.length === 0) {
      dispatch(setChessPosition({ fen: chessJs.fen(), turn: chessJs.turn() }));
    }
  }, []);

  function onSquareClick(args: SquareHandlerArgs) {
    if (possibleMoves.toSquares.length > 0) {
      for (let i = 0; i < possibleMoves.toSquares.length; i++) {
        const turn = chessJs.turn();
        const toSquare = possibleMoves.toSquares[i].startsWith("O-O")
          ? getCastleSquare(possibleMoves.toSquares[i], turn)
          : filterSquareString(possibleMoves.toSquares[i], turn);
        if (toSquare.includes(args.square)) {
          calculateBestMove(
            chessPositions[chessPositions.length - 1].fen,
          );
          chessJs.move({
            from: possibleMoves.fromSquare,
            to: toSquare,
          });
          // update the position state upon successful move to trigger a re-render of the chessboard
          dispatch(
            setChessPosition({ fen: chessJs.fen(), turn: turn }),
          );
          // syncChessPositionWithCurrent(
          //   currentChessPositionIdx,
          //   chessPositions,
          //   chessJs
          // );
          return;
        }
      }
    }

    const newPossibleMoves = chessJs.moves({
      square: args.square as Square,
    });

    dispatch(
      setPossibleMoves({
        possibleMoves: {
          fromSquare: args.square,
          toSquares: newPossibleMoves,
        },
        turn: chessJs.turn(),
      }),
    );
  }

  // handle piece drop
  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    // type narrow targetSquare potentially being null (e.g. if dropped off board)
    if (!targetSquare) {
      return false;
    }

    // Sync chess.js with current position from Redux
    // syncChessPositionWithCurrent(currentChessPositionIdx, chessPositions, chessJs);
    const turn = chessJs.turn();
    try {
      chessJs.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      dispatch(setChessPosition({ fen: chessJs.fen(), turn: turn }));
      calculateBestMove(chessPositions[chessPositions.length - 1].fen);

      return true;
    } catch {
      return false;
    }
  }

  const onPieceDrag = ({ square }: PieceHandlerArgs) => {
    // syncChessPositionWithCurrent(currentChessPositionIdx, chessPositions, chessJs);

    const possibleMoves = chessJs.moves({ square: square as Square });
    dispatch(
      setPossibleMoves({
        possibleMoves: {
          fromSquare: square ? square : "",
          toSquares: possibleMoves,
        },
        turn: chessJs.turn(),
      }),
    );
  };

  return {
    chessJs,
    onSquareClick,
    squareStyles,
    onPieceDrop,
    chessPositions,
    onPieceDrag,
    bestMove,
    getCurrentPosition: () =>
      getCurrentPosition(chessPositions, chessJs.fen()),
    currentPosition:
      effectiveCurrentFen,
    arrows,
  };
}
