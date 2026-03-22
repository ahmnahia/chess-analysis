"use client";
import { RootState } from "@/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  SquareStyles,
  PossibleMoves,
  ChessPositions,
  ChessState,
  EvaluationView,
  RemainingPieces,
} from "./components/custom-chess-board/types";
import { Color, Move } from "chess.js";
import { getMoveClassification } from "./utils";
import { ChessComGame } from "./types/chess-com";

const initialState: ChessState = {
  squareStyles: {},
  possibleMoves: { fromSquare: "", toSquares: [] },
  chessPositions: [],
  customChessPositions: [],
  currentChessPositionIdx: -1,
  isBoardFlipped: false,
  apiGame: undefined,
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
        remainingPieces: RemainingPieces;
      }>,
    ) => {
      state.chessPositions.push({
        ...(action.payload.move ?? {}),
        isCalculatingBestMove: true,
        isCheck: action.payload.isCheck,
        remainingPieces: action.payload.remainingPieces,
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
    setCurrentChessPositionIdx: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= -1 && index < state.chessPositions.length) {
        state.currentChessPositionIdx = index;
      }
    },
    loadPositionsFromApi: (
      state,
      action: PayloadAction<{
        chessPositions: ChessPositions;
        game: ChessComGame;
        isBoardFlipped: boolean;
      }>,
    ) => {
      state.chessPositions = action.payload.chessPositions;
      state.apiGame = action.payload.game;
      state.isBoardFlipped = action.payload.isBoardFlipped;
      state.currentChessPositionIdx = -1;
    },
    toggleBoardRotation: (state) => {
      state.isBoardFlipped = !state.isBoardFlipped;
    },
    resetChessState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setSquareStyles,
  setPossibleMoves,
  setChessPosition,
  setBestMove,
  setCurrentChessPositionIdx,
  loadPositionsFromApi,
  toggleBoardRotation,
  resetChessState,
} = chessSlice.actions;

export default chessSlice.reducer;

export const selectChessState = (state: RootState) => state.chess;
