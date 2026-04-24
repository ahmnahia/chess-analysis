"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PieceDropHandlerArgs, PieceHandlerArgs } from "react-chessboard";
import {
  selectChessState,
  setPossibleMoves,
  setChessPosition,
  selectActivePosition,
  selectPreviousPosition,
} from "../../chess-slice";
import { SquareHandlerArgs } from "react-chessboard";
import { Square, Color } from "chess.js";
import {
  filterSquareString,
  getCastleSquare,
  filterPossibleToSquaresMoves,
  handlePossibleMovesClassNames,
  handleMoveClassificationClassNames,
  getRemainingAndCapturedPieces,
  clearAllSquareClassNames,
} from "../../utils";
import { useChessContext } from "../../context/chess-provider";
import { Arrow, ChessPosition, PiecesCount, PossibleMoves } from "../../types/chess";
import { PIECES_SCORE, TOTAL_COUNT_PIECES } from "../GamePlayerInfo/constants";
import "@/lib/bigintToJson";

export default function useChessBoard() {
  const { chessJs, calculateBestMove } = useChessContext();
  const dispatch = useDispatch();
  const {
    squareStyles,
    possibleMoves,
    chessPositions,
    customChessPositions,
    apiGame,
    currentChessPositionIdx,
    isBoardFlipped,
  } = useSelector(selectChessState);
  const activePosition = useSelector(selectActivePosition);
  const previousPosition = useSelector(selectPreviousPosition);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const previousPossibleMovesRef = useRef<PossibleMoves>({
    fromSquare: "",
    toSquares: [],
  });
  const previousTurnRef = useRef<Color>("w");
  const prevChessPosition = useRef<ChessPosition | undefined>(undefined);
  const prevIsBoardFlippedRef = useRef<boolean>(isBoardFlipped);

  const { whiteCapturedDiff, blackCapturedDiff } = useMemo(() => {
    const remainingPiecesWhite = activePosition?.remainingPieces?.black;
    const remainingPiecesBlack = activePosition?.remainingPieces?.white;

    if (!remainingPiecesWhite || !remainingPiecesBlack) {
      return { whiteCapturedDiff: 0, blackCapturedDiff: 0 };
    }

    let whiteCapturedScore = 0;
    let blackCapturedScore = 0;

    for (const [piece, count] of Object.entries(TOTAL_COUNT_PIECES)) {
      const pieceKey = piece as keyof PiecesCount;
      const whiteMissingCount = count - remainingPiecesWhite[pieceKey];
      const blackMissingCount = count - remainingPiecesBlack[pieceKey];

      whiteCapturedScore += whiteMissingCount * PIECES_SCORE[pieceKey];
      blackCapturedScore += blackMissingCount * PIECES_SCORE[pieceKey];
    }

    const whiteDiff = Math.max(whiteCapturedScore - blackCapturedScore, 0);
    const blackDiff = Math.max(blackCapturedScore - whiteCapturedScore, 0);

    return { whiteCapturedDiff: whiteDiff, blackCapturedDiff: blackDiff };
  }, [activePosition]);

  useEffect(() => {
    // handling best move arrows
    if (currentChessPositionIdx >= -1) {
      const bestMove = previousPosition?.bestMove;

      if (bestMove && bestMove !== "0000" && bestMove.length >= 4) {
        const startSquare = bestMove.slice(0, 2);
        const endSquare = bestMove.slice(2, 4);
        setArrows([{ startSquare, endSquare, color: "#00ff00" }]);
      } else {
        setArrows([]);
      }
    }
  }, [previousPosition]);

  useEffect(() => {
    // syncing chessjs state
    if (currentChessPositionIdx === -1) {
      chessJs.reset();
    } else if (chessJs && activePosition?.after !== chessJs.fen()) {
      chessJs.load(activePosition?.after ?? chessJs.fen());
    }
  }, [activePosition, chessJs]);

  useEffect(() => {
    // handles the possible moves class names
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
    if (customChessPositions.length === 0 && chessPositions.length === 0) {
      prevChessPosition.current = undefined;
      previousPossibleMovesRef.current = { fromSquare: "", toSquares: [] };
      clearAllSquareClassNames();
      return;
    }

    handleMoveClassificationClassNames(
      activePosition?.lan,
      activePosition?.moveClassification,
      prevChessPosition.current?.lan,
      prevChessPosition.current?.moveClassification,
    );
    prevChessPosition.current = activePosition;
  }, [activePosition, customChessPositions, chessPositions]);

  useEffect(() => {
    // reapply classes after board re-mounts due to orientation change
    if (prevIsBoardFlippedRef.current === isBoardFlipped) return;

    prevIsBoardFlippedRef.current = isBoardFlipped;
    const timeout = setTimeout(() => {
      if (activePosition?.lan && activePosition?.moveClassification) {
        handleMoveClassificationClassNames(
          activePosition.lan,
          activePosition.moveClassification,
        );
      }
      if (possibleMoves.toSquares.length > 0) {
        handlePossibleMovesClassNames(possibleMoves, chessJs.turn());
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [isBoardFlipped, activePosition, possibleMoves, chessJs]);

  const applyMoveAndAnalyze = (from: string, to: string) => {
    const nextIndex = customChessPositions.length;
    const legalMovesCount = chessJs.moves().length;

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
    const remainingPieces = getRemainingAndCapturedPieces(chessJs.board());

    calculateBestMove(nextFen, nextIndex, legalMovesCount, 15);
    dispatch(
      setChessPosition({
        isCheck: chessJs.isCheck(),
        move: serializableMove,
        remainingPieces,
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
    squareStyles,
    customChessPositions,
    currentChessPositionIdx,
    whiteCapturedDiff,
    blackCapturedDiff,
    currentPosition: activePosition?.after,
    arrows,
    apiGame,
    onPieceDrag,
    onPieceDrop,
    onSquareClick,
  };
}
