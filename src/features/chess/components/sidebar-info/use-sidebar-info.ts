import { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectChessState,
  setCurrentChessPositionIdx,
} from "../../chess-slice";
import { SIDEBAR_NAV_ICONS } from "./constants";

export default function useSidebarInfo() {
  const activeRef = useRef<HTMLDivElement>(null);
  const { chessPositions, currentChessPositionIdx } =
    useSelector(selectChessState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentChessPositionIdx]);
  const canGoBack = currentChessPositionIdx >= 0;
  const canGoForward = currentChessPositionIdx < chessPositions.length - 1;

  const handleChessPosition = (index: number) => {
    dispatch(setCurrentChessPositionIdx(index));
  };

  const navButtons = [
    {
      key: "first",
      icon: SIDEBAR_NAV_ICONS.first,
      rotate: true,
      onClick: () => handleChessPosition(0),
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
  ] as const;

  return {
    activeRef,
    navButtons,
    chessPositions,
    currentChessPositionIdx,
    handleChessPosition,
  };
}
