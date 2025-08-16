"use client";
import clsx from "clsx";
import Image from "next/image";
import { piecesImgsMap } from "../constants";
import {
  selectChessState,
  setSelectedPiece,
  moveSelectedPiece,
} from "../chessSlice";
import { useDispatch, useSelector } from "react-redux";
import { PieceKey, PieceCords } from "../types";
import { isGridSelectedPartOfLegalMove, isSameCords } from "../utils";

type ChessGridProps = {
  pieceLetter: PieceKey | undefined;
  cords: PieceCords;
};

export default function ChessGrid({ pieceLetter, cords }: ChessGridProps) {
  const { selectedPieceLegalMoves, lastPieceMoved } =
    useSelector(selectChessState);
  const dispatch = useDispatch();

  return (
    <div
      onClick={() => {
        if (isGridSelectedPartOfLegalMove(cords, selectedPieceLegalMoves)) {
          dispatch(moveSelectedPiece(cords));
        } else {
          dispatch(
            setSelectedPiece(
              pieceLetter
                ? { pieceLetter, cords }
                : undefined
            )
          );
        }
      }}
      className={clsx(
        (cords.col % 2 === 0 && cords.row % 2 === 0) ||
          (cords.col % 2 !== 0 && cords.row % 2 !== 0)
          ? "even-grid"
          : "odd-grid",
        "flex-1 relative",

        "bg-yellow-900"
      )}
    >
      {pieceLetter && (
        <Image
          className="w-full cursor-grab z-20 absolute"
          alt="piece image"
          src={piecesImgsMap[pieceLetter].img}
        />
      )}
      {selectedPieceLegalMoves.map((eachLM, idx) => {
        if (eachLM.row === cords.row && eachLM.col === cords.col)
          return (
            <div
              key={idx}
              className="w-full h-full flex justify-center items-center absolute left-0 top-0"
            >
              <div
                className={clsx(
                  "rounded-full bg-gray-300/40 border-gray-300/40 z-10",
                  pieceLetter
                    ? "w-full h-full bg-transparent border-8"
                    : "w-[35px] h-[35px]"
                )}
              ></div>
            </div>
          );
        return null;
      })}
      {(isSameCords(lastPieceMoved?.oldCords, cords) ||
        isSameCords(lastPieceMoved?.newCords, cords)) && (
        <div className="w-full h-full flex justify-center items-center absolute left-0 top-0">
          <div className={clsx("w-full h-full  bg-blue-200/30  z-10")}></div>
        </div>
      )}
    </div>
  );
}
