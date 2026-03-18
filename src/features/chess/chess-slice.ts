"use client";
import { RootState } from "@/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  SquareStyles,
  PossibleMoves,
  ChessPositions,
  ChessState,
  EvaluationView,
} from "./types/chess-board";
import { Color, Move } from "chess.js";
import { getMoveClassification } from "./utils";

const initialState: ChessState = {
  squareStyles: {},
  possibleMoves: { fromSquare: "", toSquares: [] },
  chessPositions: [],
  currentChessPositionIdx: -1,
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
      state.possibleMoves = JSON.parse(
        JSON.stringify(action.payload.possibleMoves),
      );
    },
    setChessPosition: (
      state,
      action: PayloadAction<{
        move?: Partial<Move>;
        isCheck?: boolean;
      }>,
    ) => {
      state.chessPositions.push({
        ...(action.payload.move ?? {}),
        isCalculatingBestMove: true,
        isCheck: action.payload.isCheck,
      });
      state.currentChessPositionIdx = state.chessPositions.length - 1;
      state.possibleMoves = { fromSquare: "", toSquares: [] };
    },
    setBestMove: (
      state,
      action: PayloadAction<{
        bestMove: string;
        evaluationView: EvaluationView;
        index?: number;
        legalMovesCount?: number;
      }>,
    ) => {
      if (state.chessPositions.length === 0) return;

      const targetIndex = action.payload.index
        ? action.payload.index
        : state.chessPositions.length - 1;

      if (targetIndex < 0 || targetIndex >= state.chessPositions.length) return;

      state.chessPositions[targetIndex].bestMove = action.payload.bestMove;
      state.chessPositions[targetIndex].evaluationView =
        action.payload.evaluationView;
      state.chessPositions[targetIndex].isCalculatingBestMove = false;

      const previousPosition = state.chessPositions[targetIndex - 1];
      const currentPosition = state.chessPositions[targetIndex];

      if (currentPosition.from && currentPosition.to && currentPosition.color) {
        state.chessPositions[targetIndex].moveClassification =
          getMoveClassification(
            currentPosition.lan ?? "",
            action.payload.evaluationView.whiteValue,
            previousPosition?.evaluationView?.whiteValue || 0,
            previousPosition?.bestMove || "",
            action.payload.legalMovesCount || 0,
            currentPosition.color,
          );
      }
    },
    clearPositionHistory: (state) => {
      state.chessPositions = [];
      state.currentChessPositionIdx = -1;
    },
    setCurrentChessPositionIdx: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= -1 && index < state.chessPositions.length) {
        state.currentChessPositionIdx = index;
      }
    },
    loadPositionsFromApi: (state, action: PayloadAction<ChessPositions>) => {
      state.chessPositions = action.payload;
      state.currentChessPositionIdx = -1;
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
