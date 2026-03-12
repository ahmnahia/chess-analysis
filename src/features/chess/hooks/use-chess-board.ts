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
  handleMoveClassificationClassNames,
} from "../utils";
import { useChessContext } from "../context/chess-provider";
import { Arrow, ChessPosition, PossibleMoves } from "../types/chess-board";
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
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const previousPossibleMovesRef = useRef<PossibleMoves>({
    fromSquare: "",
    toSquares: [],
  });
  const previousTurnRef = useRef<Color>("w");
  const effectiveCurrentFen = chessPositions[currentChessPositionIdx]?.after;
  const prevChessPosition = useRef<ChessPosition | undefined>(undefined);

  useEffect(() => {
    // handeling best move arrows
    if (currentChessPositionIdx > 0) {
      const prevPos = chessPositions[currentChessPositionIdx - 1];
      const bestMove = prevPos?.bestMove;

      if (bestMove && bestMove !== "0000" && bestMove.length >= 4) {
        const startSquare = bestMove.slice(0, 2);
        const endSquare = bestMove.slice(2, 4);
        setArrows([{ startSquare, endSquare, color: "#00ff00" }]);
      } else {
        setArrows([]);
      }
    }
  }, [currentChessPositionIdx]);

  useEffect(() => {
    // initialize with starting position if no positions exist
    if (chessPositions.length === 0) {
      const initialFen = chessJs.fen();
      dispatch(setChessPosition({}));
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

  useEffect(() => {
    // handles the move classification class names
    if (chessPositions.length === 0) return;

    const currentPosition = chessPositions[currentChessPositionIdx];
    if (currentPosition.moveClassification || currentChessPositionIdx === 0) {
      handleMoveClassificationClassNames(
        currentPosition.lan,
        currentPosition.moveClassification,
        prevChessPosition.current?.lan,
        prevChessPosition.current?.moveClassification,
      );
      prevChessPosition.current = currentPosition;
    }
  }, [chessPositions, currentChessPositionIdx, dispatch]);

  const applyMoveAndAnalyze = (from: string, to: string) => {
    const nextIndex = chessPositions.length;
    const moved = chessJs.move({
      from,
      to,
      promotion: "q",
    });

    if (!moved) {
      return;
    }

    const history = chessJs.history({ verbose: true });
    const move = history[history.length - 1];
    const serializableMove = move ? { ...move } : undefined;
    const nextFen = chessJs.fen();

    calculateBestMove(nextFen, nextIndex, 15);
    dispatch(
      setChessPosition({
        isCheck: chessJs.isCheck(),
        move: serializableMove,
      }),
    );
  };

  function onSquareClick(args: SquareHandlerArgs) {
    const filteredPossibleMoves = filterPossibleToSquaresMoves(possibleMoves);
    if (filteredPossibleMoves.toSquares.length > 0) {
      for (let i = 0; i < filteredPossibleMoves.toSquares.length; i++) {
        const currentTurn = chessJs.turn();
        const toSquare = filteredPossibleMoves.toSquares[i].startsWith("O-O")
          ? getCastleSquare(filteredPossibleMoves.toSquares[i], currentTurn)
          : filterSquareString(filteredPossibleMoves.toSquares[i], currentTurn);

        if (toSquare.includes(args.square)) {
          applyMoveAndAnalyze(filteredPossibleMoves.fromSquare, toSquare);
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

    try {
      applyMoveAndAnalyze(sourceSquare, targetSquare);
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
    currentPosition: effectiveCurrentFen,
    arrows,
  };
}
