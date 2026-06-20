import { ChessComGame, Result } from "../../types/chess-com";
import { LichessGame, Status } from "../../types/lichess";
import { Platform, Outcome } from "./enum";

export type Game = ChessComGame | LichessGame;

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
  searchedUsername: string;
};
