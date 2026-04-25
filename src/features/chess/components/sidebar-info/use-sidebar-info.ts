import { useRef, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectChessState,
  selectActivePosition,
  setCurrentChessPositionIdx,
  toggleBoardRotation,
  undoCustomMove,
} from "../../chess-slice";
import { SIDEBAR_NAV_ICONS } from "./constants";
import { useChessContext } from "../../context/chess-provider";

export default function useSidebarInfo() {
  const activeRef = useRef<HTMLElement>(null);
  const {
    chessPositions,
    customChessPositions,
    currentChessPositionIdx,
    isAnalysisLoading,
  } = useSelector(selectChessState);
  const { isEngineLoading } = useChessContext();
  const activePosition = useSelector(selectActivePosition);
  const dispatch = useDispatch();
  const isCustom = customChessPositions.length > 0;
  const activePositions =
    isCustom && chessPositions.length === 0
      ? customChessPositions
      : chessPositions;
  const analizedCount = useMemo(
    () => chessPositions.filter((pos) => pos.moveClassification).length,
    [chessPositions],
  );

  useEffect(() => {
    const isBigScreen = window.innerWidth >= 768;
    if (activeRef.current && isBigScreen) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentChessPositionIdx, customChessPositions.length]);

  const canGoBack = currentChessPositionIdx >= 0;
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
      return (
        isCustom &&
        chessPositions.length > 0 &&
        (index === currentChessPositionIdx ||
          index + 1 === currentChessPositionIdx)
      );
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
    openingName: activePosition?.openingName,
    isAnalysisLoading,
    isEngineLoading,
    analizedCount,
  };
}
