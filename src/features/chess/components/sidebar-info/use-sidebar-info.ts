import { useRef, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectChessState,
  selectActivePosition,
  setCurrentChessPositionIdx,
  toggleBoardRotation,
  undoCustomMove,
  selectPreviousPosition,
} from "../../chess-slice";
import {
  piceLettersWithoutP,
  SIDEBAR_INFO_CLASSES,
  SIDEBAR_NAV_ICONS,
} from "./constants";
import { useChessContext } from "../../context/chess-provider";
import { Chess, PieceSymbol, Square } from "chess.js";
import { cn } from "@/lib/utils";
import { ChessPosition } from "../../types/chess";

export default function useSidebarInfo() {
  const activeRef = useRef<HTMLElement>(null);
  const {
    chessPositions,
    customChessPositions,
    currentChessPositionIdx,
    isAnalysisLoading,
    lastOpeningName,
    customLastOpeningName,
  } = useSelector(selectChessState);
  const { isEngineLoading } = useChessContext();
  const previousPosition = useSelector(selectPreviousPosition);
  const activePosition = useSelector(selectActivePosition);
  const dispatch = useDispatch();
  const tempChessClassRef = useRef<Chess>(new Chess());
  const isCustom = customChessPositions.length > 0;
  const activePositions =
    isCustom && chessPositions.length === 0
      ? customChessPositions
      : chessPositions;
  const analizedCount = useMemo(
    () =>
      chessPositions.filter((pos: ChessPosition) => pos.moveClassification)
        .length,
    [chessPositions],
  );
  const openingName = useMemo(() => {
    if (currentChessPositionIdx === -1) {
      return null;
    } else if (customChessPositions.length > 0) {
      return activePosition?.openingName || customLastOpeningName;
    } else if (chessPositions.length > 0) {
      return activePosition?.openingName || lastOpeningName;
    }
    return null;
  }, [
    activePosition,
    customLastOpeningName,
    lastOpeningName,
    customChessPositions.length,
    chessPositions.length,
  ]);
  const previousBestMove: {
    iconLetter: PieceSymbol;
    move: string;
    iconClassName: string;
  } | null = useMemo(() => {
    if (!previousPosition) return null;
    const bestMove = previousPosition.bestMove;
    if (!bestMove || bestMove.length < 4) return null;

    const fen = previousPosition.after;
    if (!fen) return null;

    tempChessClassRef.current.load(fen);
    const from = bestMove.slice(0, 2) as Square;
    const pieceOnFromSquare = tempChessClassRef.current.get(from);
    if (!pieceOnFromSquare) return null;

    return {
      iconLetter: pieceOnFromSquare.type,
      move: bestMove.slice(2, 4),
      iconClassName: cn(
        previousPosition.color === "b"
          ? "fill-dark-500 dark:fill-white"
          : "fill-dark-900 dark:fill-dark-600",
        `${SIDEBAR_INFO_CLASSES.pieceIcon} mr-1`,
      ),
    };
  }, [previousPosition]);
  const currentBestMove: {
    iconLetter: PieceSymbol;
    move: string;
    iconClassName: string;
  } | null = useMemo(() => {
    if (activePosition) {
      return {
        iconLetter: activePosition.piece as PieceSymbol,
        move: piceLettersWithoutP.includes(
          activePosition.san?.slice(0, 1) ?? "",
        )
          ? (activePosition.san?.slice(1) ?? "")
          : (activePosition.san ?? ""),
        iconClassName: cn(
          activePosition.color === "w"
            ? "fill-dark-500 dark:fill-white"
            : "fill-dark-900 dark:fill-dark-600",
          `${SIDEBAR_INFO_CLASSES.pieceIcon} mr-1`,
        ),
      };
    }
    return null;
  }, [activePosition]);

  useEffect(() => {
    const isBigScreen = window.innerWidth >= 768;
    if (activeRef.current && isBigScreen) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentChessPositionIdx, customChessPositions.length]);

  const canGoBack =
    currentChessPositionIdx >= 0 || customChessPositions.length > 0;
  const canGoForward =
    currentChessPositionIdx < chessPositions.length - 1 &&
    customChessPositions.length === 0;

  const handleChessPosition = useCallback(
    (index: number) => {
      if (customChessPositions.length > 0) {
        dispatch(undoCustomMove(index));
      } else {
        dispatch(setCurrentChessPositionIdx(index));
      }
    },
    [dispatch, customChessPositions.length],
  );

  const rotateBoard = useCallback(() => {
    dispatch(toggleBoardRotation());
  }, [dispatch]);

  const isMoveActive = useCallback(
    (index: number) => {
      return (
        currentChessPositionIdx === index &&
        (chessPositions.length === 0 ||
          isCustom ||
          index < chessPositions.length)
      );
    },
    [currentChessPositionIdx, chessPositions.length, isCustom],
  );

  const shouldShowCustomMoves = useCallback(
    (index: number) => {
      if (!isCustom || chessPositions.length === 0) return false;
      const branchIdx = currentChessPositionIdx;
      const branchRow =
        branchIdx === -1 ? 0 : branchIdx % 2 === 0 ? branchIdx : branchIdx - 1;
      return index === branchRow;
    },
    [isCustom, chessPositions.length, currentChessPositionIdx],
  );

  const isLatestCustomMove = useCallback(
    (index: number) => {
      return customChessPositions.length - 1 === index;
    },
    [customChessPositions.length],
  );

  const navButtons = useMemo(
    () =>
      [
        {
          key: "first",
          icon: SIDEBAR_NAV_ICONS.first,
          rotate: true,
          onClick: () => handleChessPosition(-1),
          disabled: !canGoBack,
        },
        {
          key: "previous",
          icon: SIDEBAR_NAV_ICONS.previous,
          rotate: true,
          onClick: () => handleChessPosition(currentChessPositionIdx - 1),
          disabled: !canGoBack,
        },
        {
          key: "next",
          icon: SIDEBAR_NAV_ICONS.next,
          rotate: false,
          onClick: () => handleChessPosition(currentChessPositionIdx + 1),
          disabled: !canGoForward,
        },
        {
          key: "last",
          icon: SIDEBAR_NAV_ICONS.last,
          rotate: false,
          onClick: () => handleChessPosition(chessPositions.length - 1),
          disabled: !canGoForward,
        },
        {
          key: "rotate",
          icon: SIDEBAR_NAV_ICONS.rotate,
          rotate: false,
          onClick: rotateBoard,
          disabled: false,
        },
      ] as const,
    [
      canGoBack,
      canGoForward,
      currentChessPositionIdx,
      chessPositions.length,
      handleChessPosition,
      rotateBoard,
    ],
  );

  const isAnalysisCompleteForMainLine =
    chessPositions.length > 0 && analizedCount === chessPositions.length;

  return {
    activeRef,
    navButtons,
    chessPositions,
    customChessPositions,
    activePosition,
    activePositions,
    currentChessPositionIdx,
    handleChessPosition,
    rotateBoard,
    isMoveActive,
    shouldShowCustomMoves,
    isLatestCustomMove,
    openingName,
    isAnalysisLoading,
    isEngineLoading,
    previousBestMove,
    analizedCount,
    isAnalysisCompleteForMainLine,
    currentBestMove,
  };
}
