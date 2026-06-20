"use client";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { PromotionPiece } from "./components/piece-selector/enum";
import { useDispatch, useSelector } from "react-redux";
import { PieceDropHandlerArgs, PieceHandlerArgs } from "react-chessboard";
import {
  selectChessState,
  setPossibleMoves,
  setChessPosition,
  selectActivePosition,
  selectPreviousPosition,
  setAnalysIsLoading,
  setArrows,
  setPromotionPending,
} from "../../chess-slice";
import { SquareHandlerArgs } from "react-chessboard";
import { Square, Color, KING, WHITE, BLACK } from "chess.js";
import {
  filterSquareString,
  getCastleSquare,
  filterPossibleToSquaresMoves,
  handlePossibleMovesClassNames,
  handleMoveClassificationClassNames,
  getRemainingAndCapturedPieces,
  clearAllSquareClassNames,
  toggleSquareClassName,
} from "../../utils";
import { useChessContext } from "../../context/chess-provider";
import { ChessPosition, PiecesCount, PossibleMoves } from "../../types/chess";
import {
  PIECES_SCORE,
  TOTAL_COUNT_PIECES,
} from "./components/game-player-info/constants";
import "@/lib/bigintToJson";
import { ChessClassNames, MoveClassification } from "../../enums";
import { Outcome } from "../user-profile-modal/enum";

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
    arrows,
    promotionPending,
    engineDepth,
  } = useSelector(selectChessState);
  const activePosition = useSelector(selectActivePosition);
  const previousPosition = useSelector(selectPreviousPosition);
  const previousPossibleMovesRef = useRef<PossibleMoves>({
    fromSquare: "",
    toSquares: [],
  });
  const previousTurnRef = useRef<Color>("w");
  const prevChessPosition = useRef<ChessPosition | undefined>(undefined);
  const prevIsBoardFlippedRef = useRef<boolean>(isBoardFlipped);
  const chessBoardRef = useRef<HTMLDivElement>(null);

  const getKingSquares = useCallback(() => {
    const whiteKingSquare = chessJs.findPiece({
      type: KING,
      color: WHITE,
    });
    const blackKingSquare = chessJs.findPiece({
      type: KING,
      color: BLACK,
    });

    return {
      whiteKingSquare: whiteKingSquare[0],
      blackKingSquare: blackKingSquare[0],
    };
  }, [chessJs]);

  const isBulkAnalysisRunning = useMemo(
    () =>
      chessPositions.length > 0 &&
      chessPositions.some((pos: ChessPosition) => !pos.moveClassification),
    [chessPositions],
  );

  const notifyWaitForAnalysis = useCallback(() => {
    toast.info(
      "Please wait for the analysis to finish before making custom moves.",
      { id: "wait-for-bulk-analysis", duration: 1500 },
    );
  }, []);

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
    if (
      !activePosition?.moveClassification ||
      activePosition?.moveClassification === MoveClassification.OPENING
    ) {
      dispatch(setArrows([]));
      return;
    }

    if (currentChessPositionIdx >= -1) {
      const bestMove = previousPosition?.bestMove;

      if (bestMove && bestMove !== "0000" && bestMove.length >= 4) {
        const startSquare = bestMove.slice(0, 2);
        const endSquare = bestMove.slice(2, 4);
        dispatch(setArrows([{ startSquare, endSquare, color: "#00ff00" }]));
      } else {
        dispatch(setArrows([]));
      }
    }
  }, [dispatch, previousPosition, activePosition, currentChessPositionIdx]);

  useEffect(() => {
    // syncing chessjs state
    if (customChessPositions.length > 0) {
      const fen = activePosition?.after;
      if (fen && fen !== chessJs.fen()) {
        chessJs.load(fen);
      }
      return;
    }

    if (currentChessPositionIdx === -1) {
      chessJs.reset();
      return;
    }

    const fen = activePosition?.after;
    if (fen && fen !== chessJs.fen()) {
      chessJs.load(fen);
    }
  }, [
    activePosition,
    chessJs,
    currentChessPositionIdx,
    customChessPositions.length,
    chessPositions.length,
  ]);

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

  useEffect(() => {
    // handling game end classes
    [
      ChessClassNames.GAME_END_LOSER,
      ChessClassNames.GAME_END_WINNER,
      ChessClassNames.GAME_END_DRAW,
    ].forEach((className) => {
      document.querySelectorAll(`.${className}`).forEach((el) => {
        const square = el.getAttribute("data-square");
        if (square) toggleSquareClassName(square, className);
      });
    });

    const { whiteKingSquare, blackKingSquare } = getKingSquares();
    if (!whiteKingSquare || !blackKingSquare) return;

    if (customChessPositions.length > 0) {
      if (chessJs.isCheckmate()) {
        const loserColor = chessJs.turn();
        const winnerColor = loserColor === "w" ? "b" : "w";

        toggleSquareClassName(
          loserColor === "w" ? whiteKingSquare : blackKingSquare,
          ChessClassNames.GAME_END_LOSER,
        );
        toggleSquareClassName(
          winnerColor === "w" ? whiteKingSquare : blackKingSquare,
          ChessClassNames.GAME_END_WINNER,
        );
      } else if (chessJs.isDraw() || chessJs.isStalemate()) {
        toggleSquareClassName(whiteKingSquare, ChessClassNames.GAME_END_DRAW);
        toggleSquareClassName(blackKingSquare, ChessClassNames.GAME_END_DRAW);
      }
    } else if (chessPositions.length > 0) {
      if (currentChessPositionIdx === chessPositions.length - 1) {
        if (apiGame?.outcome === Outcome.Draw) {
          toggleSquareClassName(whiteKingSquare, ChessClassNames.GAME_END_DRAW);
          toggleSquareClassName(blackKingSquare, ChessClassNames.GAME_END_DRAW);
          return;
        }

        const userColor =
          apiGame?.white.username === apiGame?.searchedUsername ? "w" : "b";
        toggleSquareClassName(
          userColor === "w" ? whiteKingSquare : blackKingSquare,
          apiGame?.outcome === Outcome.Win
            ? ChessClassNames.GAME_END_WINNER
            : ChessClassNames.GAME_END_LOSER,
        );
        toggleSquareClassName(
          userColor === "w" ? blackKingSquare : whiteKingSquare,
          apiGame?.outcome === Outcome.Win
            ? ChessClassNames.GAME_END_LOSER
            : ChessClassNames.GAME_END_WINNER,
        );
      }
    }
  }, [
    chessJs,
    getKingSquares,
    isBoardFlipped,
    currentChessPositionIdx,
    chessPositions.length,
    customChessPositions.length,
    apiGame,
  ]);

  function finalizeMoveAndAnalyze(
    from: string,
    to: string,
    promotion?: PromotionPiece,
  ): boolean {
    const nextIndex = customChessPositions.length;
    const legalMovesCount = chessJs.moves().length;

    let moved;
    try {
      moved = chessJs.move(
        promotion ? { from: from, to: to, promotion } : { from: from, to: to },
      );
    } catch {
      return false;
    }

    if (!moved) {
      return false;
    }

    dispatch(setAnalysIsLoading(true));

    const history = chessJs.history({ verbose: true });
    const move = history[history.length - 1];
    const serializableMove = move ? { ...move } : undefined;
    const nextFen = chessJs.fen();
    const remainingPieces = getRemainingAndCapturedPieces(chessJs.board());

    calculateBestMove(nextFen, nextIndex, legalMovesCount, engineDepth);
    dispatch(
      setChessPosition({
        isCheck: chessJs.isCheck(),
        move: serializableMove,
        remainingPieces,
      }),
    );
    return true;
  }

  function applyMoveAndAnalyze(from: string, to: string): boolean {
    const piece = chessJs.get(from as Square);
    const needsPromotion =
      piece?.type === "p" &&
      possibleMoves.toSquares.some((item: string) => item.includes(to)) &&
      ((piece.color === "w" && to[1] === "8") ||
        (piece.color === "b" && to[1] === "1"));

    if (needsPromotion) {
      dispatch(setPromotionPending({ from, to }));
      dispatch(
        setPossibleMoves({
          possibleMoves: { fromSquare: "", toSquares: [] },
          turn: chessJs.turn(),
        }),
      );
      return false;
    }

    return finalizeMoveAndAnalyze(from, to);
  }

  function onPromotionPieceSelect(piece: PromotionPiece) {
    if (!promotionPending) return;

    const { from, to } = promotionPending;
    dispatch(setPromotionPending(null));
    finalizeMoveAndAnalyze(from, to, piece);
  }

  function cancelPromotionSelection() {
    dispatch(setPromotionPending(null));
  }

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
      return applyMoveAndAnalyze(sourceSquare, targetSquare);
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
    currentPosition:
      activePosition?.after ??
      (currentChessPositionIdx === -1 && chessPositions[0]?.before
        ? chessPositions[0].before
        : undefined),
    arrows,
    apiGame,
    onPieceDrag,
    onPieceDrop,
    onSquareClick,
    promotionPending,
    promotionColor: promotionPending ? chessJs.turn() : null,
    onPromotionPieceSelect,
    chessBoardRef,
    cancelPromotionSelection,
    isBulkAnalysisRunning,
    notifyWaitForAnalysis,
  };
}
