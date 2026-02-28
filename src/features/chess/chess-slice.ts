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
      state.chessPositions.push({ fen: action.payload.fen, isCalculatingBestMove: true });
      state.currentChessPositionIdx = state.chessPositions.length - 1;

      //clear old possible moves
      if (action.payload.turn && state.possibleMoves.toSquares.length > 0) {
        handlePossibleMovesClassNames(state.possibleMoves, action.payload.turn);
        state.possibleMoves = { fromSquare: "", toSquares: [] };
      }
    },
    setBestMove: (
      state,
      action: PayloadAction<{
        bestMove: string;
        evaluation: number;
        index?: number;
      }>,
    ) => {
      if (state.chessPositions.length === 0) return;

      const targetIndex =
        typeof action.payload.index === "number"
          ? action.payload.index
          : state.chessPositions.length - 1;

      if (targetIndex < 0 || targetIndex >= state.chessPositions.length) return;

      state.chessPositions[targetIndex].bestMove = action.payload.bestMove;
      state.chessPositions[targetIndex].evaluation = action.payload.evaluation;
      state.chessPositions[targetIndex].isCalculatingBestMove = false;
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
} = chessSlice.actions;

export default chessSlice.reducer;

export const selectChessState = (state: RootState) => state.chess;
