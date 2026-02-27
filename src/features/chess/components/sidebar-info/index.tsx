"use client";
import { useSelector, useDispatch } from "react-redux";
import {
  selectChessState,
  clearPositionHistory,
  setCurrentChessPositionIdx,
} from "../../chess-slice";
import UserProfileModal from "../user-profile-modal";

export default function SidebarInfo() {
  const { chessPositions, currentChessPositionIdx } =
    useSelector(selectChessState);
  const dispatch = useDispatch();

  const currentIndex = currentChessPositionIdx;
  const currentMoveNumber =
    currentIndex >= 0 ? currentIndex : chessPositions.length - 1;
  const activeIndex = currentIndex >= 0 ? currentIndex : chessPositions.length - 1;
  const bestMove = activeIndex >= 0 ? chessPositions[activeIndex].bestMove : "";

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < chessPositions.length - 1;

  const handlePrevious = () => {
    if (canGoBack) {
      dispatch(setCurrentChessPositionIdx(currentIndex - 1));
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      dispatch(setCurrentChessPositionIdx(currentIndex + 1));
    }
  };

  const handleReset = () => {
    dispatch(clearPositionHistory());
  };

  const handleGoToLatest = () => {
    if (chessPositions.length > 0) {
      dispatch(
        setCurrentChessPositionIdx(chessPositions.length - 1)
      );
    }
  };

  return (
    <div className="h-full w-[300px] flex flex-col justify-between">
      <div>
        <h3>Chess Analysis</h3>
        <div className="mt-4">
          <h4 className="font-semibold">Game Progress</h4>
          <div className="mt-2 p-3 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">Current Move:</p>
            <p className="font-mono text-lg">
              {currentMoveNumber >= 0 ? currentMoveNumber : 0}
            </p>
            <p className="text-sm text-gray-600">Total Positions:</p>
            <p className="font-mono text-lg">{chessPositions.length}</p>
            <p className="text-sm text-gray-600">Position Index:</p>
            <p className="font-mono text-lg">
              {currentIndex >= 0 ? currentIndex : "Latest"}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold">Engine Analysis</h4>
          <div className="mt-2 p-3 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">Best Move:</p>
            <p className="font-mono text-lg">{bestMove || "Calculating..."}</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            disabled={!canGoBack}
            className="px-3 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            // disabled={!canGoForward}
            className="px-3 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleGoToLatest}
            disabled={currentIndex === chessPositions.length - 1}
            className="px-3 py-2 bg-green-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Latest
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-2 bg-red-500 text-white rounded"
          >
            Reset Game
          </button>
        </div>
        <div>
          <UserProfileModal />
        </div>
      </div>
    </div>
  );
}
