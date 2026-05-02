import { ChessComGame, Result } from "../../types/chess-com";
import { LichessGame, Status } from "../../types/lichess";
import { Platform } from "./enum";

export type Game = ChessComGame | LichessGame;

export type Outcome = "win" | "loss" | "draw";

export type GameInfo = {
  white: {
    username: string;
    rating: number;
    chessComResult?: Result;
  };
  black: {
    username: string;
    rating: number;
    chessComResult?: Result;
  };
  pgn: string;
  platform: Platform;
  date: string;
  lichessResult?: Status;
  outcome: Outcome;
};
