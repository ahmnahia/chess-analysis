"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetChessState, selectChessState } from "../../chess-slice";
import { useChessContext } from "../../context/chess-provider";
import { clearAllSquareClassNames } from "../../utils";

export default function useClearBoardModal() {
  const dispatch = useDispatch();
  const { chessJs } = useChessContext();
  const { chessPositions, customChessPositions } = useSelector(selectChessState);

  const handleClearBoard = useCallback(() => {
    clearAllSquareClassNames();
    dispatch(resetChessState());
    chessJs.reset();
  }, [dispatch, chessJs]);

  return {
    handleClearBoard,
    isResetDisabled: chessPositions.length === 0 && customChessPositions.length === 0,
  };
}
