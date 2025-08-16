"use client";
import { RootState } from "@/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chess } from "chess.js";
import { SquareStyles, PossibleMoves } from "./types";
import { handlePossibleMovesClassNames, toggleSquareClassName } from "./utils";

export interface ChessState {
  squareStyles: Record<string, React.CSSProperties>;
  possibleMoves: PossibleMoves;
  chessPosition: string;
}

const initialState: ChessState = {
  squareStyles: {},
  possibleMoves: { fromSquare: "", toSquares: [] },
  chessPosition: "",
};

const chessSlice = createSlice({
  name: "chess",
  initialState,
  reducers: {
    setSquareStyles: (state, action: PayloadAction<SquareStyles>) => {
      state.squareStyles = action.payload;
    },
    setPossibleMoves: (state, action: PayloadAction<PossibleMoves>) => {
      if (state.possibleMoves.toSquares.length > 0) {
        // clear the old possible moves cuz a new piece is selected
        // toggleSquareClassName(state.possibleMoves, "possible-move");
        handlePossibleMovesClassNames(state.possibleMoves.toSquares);
      }
      state.possibleMoves = action.payload;
    },
    setChessPosition: (state, action: PayloadAction<string>) => {
      state.chessPosition = action.payload;

      //clear old possible moves
      if (state.possibleMoves.toSquares.length > 0) {
        // clear the old possible moves cuz a new piece is selected
        // toggleSquareClassName(state.possibleMoves, "possible-move");
        handlePossibleMovesClassNames(state.possibleMoves.toSquares);
      }
      state.possibleMoves = { fromSquare: "", toSquares: [] };
    },
  },
});

export const { setSquareStyles, setPossibleMoves, setChessPosition } =
  chessSlice.actions;

export default chessSlice.reducer;

export const selectChessState = (state: RootState) => state.chess;
