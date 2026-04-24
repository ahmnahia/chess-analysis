"use client";
import { RootState } from "@/app/store";
import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
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
import { getOpeningName } from "./utils/";

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
      state.possibleMoves = action.payload.possibleMoves;
    },
    setChessPosition: (
      state,
      {
        payload,
      }: PayloadAction<{
        move?: Partial<Move>;
        isCheck?: boolean;
        remainingPieces: RemainingPieces;
      }>,
    ) => {
      const isBranching = state.chessPositions.length > 0;

      // pass previous evaluation until new one is calculated to avoid flicker
      const prevPosition =
        state.customChessPositions[state.customChessPositions.length - 1] ||
        state.chessPositions[state.currentChessPositionIdx];

      const history = [
        ...state.chessPositions
          .slice(0, state.currentChessPositionIdx + 1)
          .map((p) => p.san || ""),
        ...state.customChessPositions.map((p) => p.san || ""),
        payload.move?.san || "",
      ];

      state.customChessPositions.push({
        ...payload.move,
        isCalculatingBestMove: true,
        isCheck: payload.isCheck,
        remainingPieces: payload.remainingPieces,
        evaluationView: prevPosition?.evaluationView,
        openingName: getOpeningName(history),
      });

      if (!isBranching) {
        state.currentChessPositionIdx = state.customChessPositions.length - 1;
      }

      state.possibleMoves = { fromSquare: "", toSquares: [] };
    },
    setBestMove: (
      state,
      {
        payload,
      }: PayloadAction<{
        bestMove: string;
        evaluationView: EvaluationView;
        index: number;
        legalMovesCount?: number;
      }>,
    ) => {
      const isCustom = state.customChessPositions.length > 0;
      const positions = isCustom
        ? state.customChessPositions
        : state.chessPositions;
      const idx = isCustom ? positions.length - 1 : payload.index;
      const pos = positions[idx];

      if (!pos) return;

      pos.bestMove = payload.bestMove;
      pos.evaluationView = payload.evaluationView;
      pos.isCalculatingBestMove = false;

      const prev =
        isCustom && idx === 0
          ? state.chessPositions[state.currentChessPositionIdx]
          : positions[idx - 1];

      if (pos.from && pos.to && pos.color) {
        pos.moveClassification = getMoveClassification(
          pos.lan ?? "",
          payload.evaluationView.whiteValue,
          prev?.evaluationView?.whiteValue || 0,
          prev?.bestMove || "",
          payload.legalMovesCount || 0,
          pos.color,
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
      state.customChessPositions = [];
      state.chessPositions = action.payload.chessPositions.map(
        (pos, idx, arr) => {
          const history = arr
            .slice(0, idx + 1)
            .map((p) => p.san || "")
          return {
            ...pos,
            openingName: getOpeningName(history),
          };
        },
      );
      state.apiGame = action.payload.game;
      state.isBoardFlipped = action.payload.isBoardFlipped;
      state.currentChessPositionIdx = -1;
    },
    toggleBoardRotation: (state) => {
      state.isBoardFlipped = !state.isBoardFlipped;
    },
    resetChessState: () => initialState,
    undoCustomMove: (state, action: PayloadAction<number>) => {
      const isBranching = state.chessPositions.length > 0;

      if (action.payload === -1 && isBranching) {
        state.customChessPositions = [];
        state.possibleMoves = { fromSquare: "", toSquares: [] };
        return;
      }

      const index = isBranching
        ? state.customChessPositions.length - 1
        : action.payload;
      state.customChessPositions.splice(isBranching ? index : index + 1);

      if (!isBranching) {
        state.currentChessPositionIdx = index;
      }

      state.possibleMoves = { fromSquare: "", toSquares: [] };
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
  undoCustomMove,
} = chessSlice.actions;

export default chessSlice.reducer;

export const selectChessState = (state: RootState) => state.chess;

export const selectActivePosition = createSelector(
  [selectChessState],
  (chess) => {
    const { chessPositions, customChessPositions, currentChessPositionIdx } =
      chess;
    return customChessPositions.length > 0
      ? customChessPositions[customChessPositions.length - 1]
      : chessPositions[currentChessPositionIdx];
  },
);

export const selectPreviousPosition = createSelector(
  [selectChessState],
  (chess) => {
    const { chessPositions, customChessPositions, currentChessPositionIdx } =
      chess;

    if (customChessPositions.length > 0) {
      if (customChessPositions.length >= 2) {
        return customChessPositions[customChessPositions.length - 2];
      }
      if (chessPositions.length > 0) {
        return chessPositions[currentChessPositionIdx];
      }
      return undefined;
    }

    if (currentChessPositionIdx >= 1) {
      return chessPositions[currentChessPositionIdx - 1];
    }

    return undefined;
  },
);
