"use client";
import { RootState } from "@/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { startingBoard } from "./constants";
import {
  isCastleForSlice,
  isEnPassantForSlice,
  isWhitePiece,
  pieceLegalMoves,
} from "./utils";
import {
  PieceCords,
  SelectedPiece,
  ChessBoardType,
  LastPieceMoved,
} from "./types";

export interface ChessState {
  chessBoard: ChessBoardType;
  currentTurn: "w" | "b";
  currentSelectedPiece: SelectedPiece;
  selectedPieceLegalMoves: PieceCords[];
  lastPieceMoved: LastPieceMoved;
}

const initialState: ChessState = {
  chessBoard: JSON.parse(JSON.stringify(startingBoard)),
  currentTurn: "w",
  currentSelectedPiece: undefined,
  selectedPieceLegalMoves: [],
  lastPieceMoved: undefined,
};

const chessSlice = createSlice({
  name: "chess",
  initialState,
  reducers: {
    switchTurns(state) {
      state.currentTurn = state.currentTurn === "w" ? "b" : "w";
    },
    setSelectedPiece(state, action: PayloadAction<SelectedPiece>) {
      if (
        (state.currentTurn === "w" &&
          action.payload &&
          isWhitePiece(action.payload.pieceLetter)) ||
        (state.currentTurn === "b" &&
          action.payload &&
          !isWhitePiece(action.payload.pieceLetter))
      ) {
        state.currentSelectedPiece = action.payload;
        if (action.payload) {
          state.selectedPieceLegalMoves = pieceLegalMoves(
            action.payload.pieceLetter,
            state.lastPieceMoved,
            action.payload.cords,
            state.chessBoard
          );
        }
      } else {
        state.currentSelectedPiece = undefined;
        state.selectedPieceLegalMoves = [];
      }
    },
    moveSelectedPiece(state, action: PayloadAction<PieceCords>) {
      if (state.currentSelectedPiece?.cords) {
        const oldCords = state.currentSelectedPiece.cords;
        const newCords = action.payload;

        // check if en passant
        if (
          state.currentSelectedPiece.pieceLetter.toLocaleLowerCase() === "p" &&
          isEnPassantForSlice(newCords, state.selectedPieceLegalMoves) &&
          state.lastPieceMoved
        ) {
          state.chessBoard[state.lastPieceMoved.newCords.row][
            state.lastPieceMoved.newCords.col
          ] = undefined;
        }
        // check if castle move
        const direction = isCastleForSlice(
          newCords,
          state.selectedPieceLegalMoves
        );

        if (
          state.currentSelectedPiece.pieceLetter.toLowerCase() === "k" &&
          !state.chessBoard[oldCords.row][oldCords.col]?.hasBeenMoved &&
          direction
        ) {
          const row = newCords.row;
          const rookFromCol =
            direction === "short" ? newCords.col + 1 : newCords.col - 2;
          const rookToCol =
            direction === "short" ? newCords.col - 1 : newCords.col + 1;

          state.chessBoard[row][rookToCol] = {
            pieceLetter: state.chessBoard[row][rookFromCol]!.pieceLetter,
            hasBeenMoved: true,
          };
          state.chessBoard[row][rookFromCol] = undefined;
        }

        // updating the board
        state.chessBoard[oldCords.row][oldCords.col] = undefined;
        state.chessBoard[newCords.row][newCords.col] = {
          ...state.currentSelectedPiece,
          hasBeenMoved: true,
        };

        // last piece moved will be the new piece now
        state.lastPieceMoved = {
          piece: state.currentSelectedPiece.pieceLetter,
          oldCords: oldCords,
          newCords: newCords,
        };

        // switch turns
        state.currentTurn = state.currentTurn === "w" ? "b" : "w";
        // state.currentTurn = "b";

        //resetting values
        state.selectedPieceLegalMoves = [];
        state.currentSelectedPiece = undefined;
      }
    },
  },
});

export const { switchTurns, setSelectedPiece, moveSelectedPiece } =
  chessSlice.actions;

export default chessSlice.reducer;

export const selectChessState = (state: RootState) => state.chess;
