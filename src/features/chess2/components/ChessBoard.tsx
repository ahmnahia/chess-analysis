"use client";
import { useSelector, useDispatch } from "react-redux";
import { selectChessBoard, selectChessState } from "../chessSlice";
import ChessGrid from "./ChessGrid";

export default function ChessBoard() {
  const chessBoard = useSelector(selectChessBoard);
  const chessState = useSelector(selectChessState);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[888px] h-[888px] flex flex-col">
        {chessBoard.map((erow, idx) => (
          <div className="flex flex-1" key={idx}>
            {erow.map((ecol, idxJ) => (
              <ChessGrid
                key={idxJ}
                cords={{ row: idx, col: idxJ }}
                pieceLetter={chessBoard[idx][idxJ]?.pieceLetter}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
