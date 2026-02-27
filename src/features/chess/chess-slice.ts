"use client";
import { RootState } from "@/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  SquareStyles,
  PossibleMoves,
  ChessPositions,
  ChessState,
} from "./types/chess-board";
import { handlePossibleMovesClassNames } from "./utils";
import { Color } from "chess.js";

const initialState: ChessState = {
  squareStyles: {},
  possibleMoves: { fromSquare: "", toSquares: [] },
  chessPositions: [],
  currentChessPositionIdx: -1,
  evaluation: 0,
};

const chessSlice = createSlice({
  name: "chess",
  initialState,
  reducers: {
    setSquareStyles: (state, action: PayloadAction<SquareStyles>) => {
      state.squareStyles = action.payload;
    },
    setPossibleMoves: (
      state,
      action: PayloadAction<{ possibleMoves: PossibleMoves; turn: Color }>,
    ) => {
      if (state.possibleMoves.toSquares.length > 0) {
        // clear the old possible moves cuz a new piece is selected
        handlePossibleMovesClassNames(state.possibleMoves, action.payload.turn);
      }
      state.possibleMoves = JSON.parse(
        JSON.stringify(action.payload.possibleMoves),
      );
      handlePossibleMovesClassNames(state.possibleMoves, action.payload.turn);
    },
    setChessPosition: (
      state,
      action: PayloadAction<{ fen: string; turn?: Color }>,
    ) => {
      state.chessPositions.push({ fen: action.payload.fen });
      state.currentChessPositionIdx = state.chessPositions.length - 1;

      //clear old possible moves
      if (action.payload.turn && state.possibleMoves.toSquares.length > 0) {
        // clear the old possible moves cuz a new piece is selected
        handlePossibleMovesClassNames(state.possibleMoves, action.payload.turn);
        state.possibleMoves = { fromSquare: "", toSquares: [] };
      }
    },
    setBestMove: (state, action: PayloadAction<string>) => {
      if (state.chessPositions.length > 0) {
        state.chessPositions[state.chessPositions.length - 1].bestMove =
          action.payload;
      }
    },
    clearPositionHistory: (state) => {
      state.chessPositions = [];
      state.currentChessPositionIdx = -1;
    },
    setCurrentChessPositionIdx: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.chessPositions.length) {
        state.currentChessPositionIdx = index;
      }
    },
    loadPositionsFromApi: (state, action: PayloadAction<ChessPositions>) => {
      state.chessPositions = action.payload;
      state.currentChessPositionIdx = action.payload.length > 0 ? 0 : -1;
    },
    setEvaluation: (state, action: PayloadAction<number>) => {
      state.evaluation = action.payload;
    },
  },
});

export const {
  setSquareStyles,
  setPossibleMoves,
  setChessPosition,
  setBestMove,
  clearPositionHistory,
  setCurrentChessPositionIdx,
  loadPositionsFromApi,
  setEvaluation,
} = chessSlice.actions;

export default chessSlice.reducer;

export const selectChessState = (state: RootState) => state.chess;
