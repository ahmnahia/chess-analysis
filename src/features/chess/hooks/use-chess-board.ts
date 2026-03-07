"use client";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PieceDropHandlerArgs, PieceHandlerArgs } from "react-chessboard";
import {
  selectChessState,
  setPossibleMoves,
  setChessPosition,
} from "../chess-slice";
import { SquareHandlerArgs } from "react-chessboard";
import { Square, Color } from "chess.js";
import {
  filterSquareString,
  getCastleSquare,
  filterPossibleToSquaresMoves,
  handlePossibleMovesClassNames,
} from "../utils";
import { useChessContext } from "../context/chess-provider";
import { Arrow, PossibleMoves } from "../types/chess-board";
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
  const previousPossibleMovesRef = useRef<PossibleMoves>({
    fromSquare: "",
    toSquares: [],
  });
  const previousTurnRef = useRef<Color>("w");

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
      dispatch(
        setChessPosition({
          fen: initialFen,
          turnBeforeMove: chessJs.turn(),
          movedToSquare: "",
        }),
      );
      calculateBestMove(initialFen, 0, 15);
    }
  }, []);

  useEffect(() => {
    const previousPossibleMoves = previousPossibleMovesRef.current;

    if (previousPossibleMoves.toSquares.length > 0) {
      handlePossibleMovesClassNames(
        previousPossibleMoves,
        previousTurnRef.current,
      );
    }

    if (possibleMoves.toSquares.length > 0) {
      const currentTurn = chessJs.turn();
      handlePossibleMovesClassNames(possibleMoves, currentTurn);
    }
    previousTurnRef.current = chessJs.turn();

    previousPossibleMovesRef.current = JSON.parse(
      JSON.stringify(possibleMoves),
    );
  }, [possibleMoves, chessJs]);

  const applyMoveAndAnalyze = (
    from: string,
    to: string,
    turnBeforeMove: Color,
  ) => {
    const nextIndex = chessPositions.length;

    chessJs.move({
      from,
      to,
      promotion: "q",
    });

    const nextFen = chessJs.fen();
    calculateBestMove(nextFen, nextIndex, 15);
    dispatch(
      setChessPosition({
        fen: nextFen,
        turnBeforeMove,
        isCheck: chessJs.isCheck(),
        movedToSquare: `${from}${to}`,
      }),
    );
  };

  function onSquareClick(args: SquareHandlerArgs) {
    const filteredPossibleMoves = filterPossibleToSquaresMoves(possibleMoves);
    if (filteredPossibleMoves.toSquares.length > 0) {
      for (let i = 0; i < filteredPossibleMoves.toSquares.length; i++) {
        const turnBeforeMove = chessJs.turn();
        const toSquare = filteredPossibleMoves.toSquares[i].startsWith("O-O")
          ? getCastleSquare(filteredPossibleMoves.toSquares[i], turnBeforeMove)
          : filterSquareString(
              filteredPossibleMoves.toSquares[i],
              turnBeforeMove,
            );

        if (toSquare.includes(args.square)) {
          applyMoveAndAnalyze(
            filteredPossibleMoves.fromSquare,
            toSquare,
            turnBeforeMove,
          );
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

    const turnBeforeMove = chessJs.turn();
    try {
      applyMoveAndAnalyze(sourceSquare, targetSquare, turnBeforeMove);
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
