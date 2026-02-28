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
  getCastleSquare,
} from "../utils";
import { useChessContext } from "../context/chess-provider";
import { Arrow } from "../types/chess-board";
import "@/lib/bigintToJson";

export default function useChessBoard() {
  const {
    squareStyles,
    possibleMoves,
    chessPositions,
    currentChessPositionIdx,
  } = useSelector(selectChessState);
  const dispatch = useDispatch();
  const { chessJs, engine, calculateBestMove } = useChessContext();
  const [arrows, setArrows] = useState<Arrow[]>([]);

  const effectiveCurrentFen = chessPositions[currentChessPositionIdx]?.fen;
  const previousPositionData =
    currentChessPositionIdx > 0
      ? chessPositions[currentChessPositionIdx - 1]
      : undefined;
  const bestMove =
    currentChessPositionIdx > 0 ? (previousPositionData?.bestMove ?? "") : "";

  useEffect(() => {
    // update arrows when best move changes
    if (bestMove && bestMove !== "0000" && bestMove.length >= 4) {
      const startSquare = bestMove.slice(0, 2);
      const endSquare = bestMove.slice(2, 4);
      setArrows([{ startSquare, endSquare, color: "#00ff00" }]);
    } else {
      setArrows([]);
    }
  }, [bestMove]);

  useEffect(() => {
    // initialize with starting position if no positions exist
    if (chessPositions.length === 0) {
      const initialFen = chessJs.fen();
      dispatch(setChessPosition({ fen: initialFen, turn: chessJs.turn() }));
      calculateBestMove(initialFen, 15, 0);
    }
  }, []);

  useEffect(() => {
    if (!engine) return;
    if (chessPositions.length === 0) return;

    const firstPosition = chessPositions[0];
    if (!firstPosition.bestMove) {
      calculateBestMove(firstPosition.fen, 15, 0);
    }
  }, [engine, chessPositions, calculateBestMove]);

  function onSquareClick(args: SquareHandlerArgs) {
    if (possibleMoves.toSquares.length > 0) {
      for (let i = 0; i < possibleMoves.toSquares.length; i++) {
        const turn = chessJs.turn();
        const nextIndex = chessPositions.length;
        const toSquare = possibleMoves.toSquares[i].startsWith("O-O")
          ? getCastleSquare(possibleMoves.toSquares[i], turn)
          : filterSquareString(possibleMoves.toSquares[i], turn);
        if (toSquare.includes(args.square)) {
          chessJs.move({
            from: possibleMoves.fromSquare,
            to: toSquare,
            promotion: "q",
          });
          const nextFen = chessJs.fen();
          calculateBestMove(nextFen, 15, nextIndex);
          dispatch(setChessPosition({ fen: nextFen, turn: turn }));

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

  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    if (!targetSquare) {
      return false;
    }

    const turn = chessJs.turn();
    const nextIndex = chessPositions.length;
    try {
      chessJs.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      const nextFen = chessJs.fen();
      dispatch(setChessPosition({ fen: nextFen, turn: turn }));
      calculateBestMove(nextFen, 15, nextIndex);

      return true;
    } catch {
      return false;
    }
  }

  const onPieceDrag = ({ square }: PieceHandlerArgs) => {
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
    currentPosition: effectiveCurrentFen,
    arrows,
  };
}
