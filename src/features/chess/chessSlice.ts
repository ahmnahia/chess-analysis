"use client";
import { RootState } from "@/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SquareStyles, PossibleMoves, ChessPositions } from "./types";
import { handlePossibleMovesClassNames } from "./utils";

export interface ChessState {
  squareStyles: Record<string, React.CSSProperties>;
  possibleMoves: PossibleMoves;
  chessPositions: ChessPositions;
  currentChessPosition: string;
  bestmove: string;
}

const initialState: ChessState = {
  squareStyles: {},
  possibleMoves: { fromSquare: "", toSquares: [] },
  chessPositions: { fens: [] },
  currentChessPosition: "",
  bestmove: "",
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
        handlePossibleMovesClassNames(state.possibleMoves);
      }
      state.possibleMoves = JSON.parse(JSON.stringify(action.payload));
      handlePossibleMovesClassNames(state.possibleMoves);
    },
    setChessPosition: (state, action: PayloadAction<string>) => {
      state.chessPositions.fens.push(action.payload);
      state.currentChessPosition = action.payload;

      //clear old possible moves
      if (state.possibleMoves.toSquares.length > 0) {
        // clear the old possible moves cuz a new piece is selected
        handlePossibleMovesClassNames(state.possibleMoves);
        state.possibleMoves = { fromSquare: "", toSquares: [] };
      }
    },
    setBestMove: (state, action: PayloadAction<string>) => {
      state.bestmove = action.payload;
    },
    clearPositionHistory: (state) => {
      state.chessPositions = { fens: [] };
    },
    goToPosition: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.chessPositions.fens.length) {
        state.currentChessPosition = state.chessPositions.fens[index];
      }
    },
    setCurrentChessPosition: (state, action: PayloadAction<string>) => {
      state.currentChessPosition = action.payload;
    },
    convertPgnToFens: (state, action: PayloadAction<ChessPositions>) => {
      state.chessPositions = action.payload;
      state.currentChessPosition = action.payload.fens[0];
    },
  },
});

export const {
  setSquareStyles,
  setPossibleMoves,
  setChessPosition,
  setBestMove,
  clearPositionHistory,
  goToPosition,
  setCurrentChessPosition,
  convertPgnToFens,
} = chessSlice.actions;

export default chessSlice.reducer;

export const selectChessState = (state: RootState) => state.chess;
