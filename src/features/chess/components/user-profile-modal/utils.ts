import { ChessComGame, Result } from "../../types/chess-com";
import { LichessGame } from "../../types/lichess";
import { Game, GameInfo, Outcome } from "./types";
import { Platform } from "./enum";

export const normalizeUsername = (u: string) => {
  return u.trim().toLowerCase();
};

const chessComResultToOutcome = (result: Result): Outcome => {
  if (result === "win") return "win";
  if (
    result === "agreed" ||
    result === "repetition" ||
    result === "stalemate" ||
    result === "insufficient" ||
    result === "50move"
  ) {
    return "draw";
  }
  return "loss";
};

const outcomeChessCom = (
  game: ChessComGame,
  searchedUsername: string,
): Outcome => {
  const q = normalizeUsername(searchedUsername);
  const w = normalizeUsername(game.white.username);
  const b = normalizeUsername(game.black.username);
  if (q === w) return chessComResultToOutcome(game.white.result);
  if (q === b) return chessComResultToOutcome(game.black.result);
  return "draw";
};

const outcomeLichess = (
  game: LichessGame,
  searchedUsername: string,
): Outcome => {
  const q = normalizeUsername(searchedUsername);
  const w = normalizeUsername(game.players.white.user?.name ?? "");
  const b = normalizeUsername(game.players.black.user?.name ?? "");
  const userIsWhite = q === w;
  const userIsBlack = q === b;
  if (!userIsWhite && !userIsBlack) return "draw";

  if (game.winner == null) return "draw";
  if (game.winner === "white") return userIsWhite ? "win" : "loss";
  return userIsBlack ? "win" : "loss";
};

const toGameInfoFromChessCom = (
  game: ChessComGame,
  searchedUsername: string,
): GameInfo => {
  return {
    white: {
      username: game.white.username,
      rating: game.white.rating,
      chessComResult: game.white.result,
    },
    black: {
      username: game.black.username,
      rating: game.black.rating,
      chessComResult: game.black.result,
    },
    platform: Platform.ChessCom,
    pgn: game.pgn,
    date: new Date(game.end_time * 1000).toISOString(),
    outcome: outcomeChessCom(game, searchedUsername),
  };
};

const toGameInfoFromLichess = (
  game: LichessGame,
  searchedUsername: string,
): GameInfo => {
  return {
    white: {
      username: game.players.white.user?.name ?? "White",
      rating: game.players.white.rating ?? 0,
    },
    black: {
      username: game.players.black.user?.name ?? "Black",
      rating: game.players.black.rating ?? 0,
    },
    platform: Platform.Lichess,
    pgn: game.pgn,
    date: new Date(game.lastMoveAt).toISOString(),
    lichessResult: game.status,
    outcome: outcomeLichess(game, searchedUsername),
  };
};

export const toGameInfo = (
  platform: Platform,
  game: Game,
  searchedUsername: string,
): GameInfo => {
  return platform === Platform.ChessCom
    ? toGameInfoFromChessCom(game as ChessComGame, searchedUsername)
    : toGameInfoFromLichess(game as LichessGame, searchedUsername);
};

export const gameRowResultLabel = (
  game: GameInfo,
  searchedUsername: string,
): string | undefined => {
  if (game.platform === Platform.Lichess) {
    return game.lichessResult;
  }
  return normalizeUsername(searchedUsername) ===
    normalizeUsername(game.white.username)
    ? game.white.chessComResult
    : game.black.chessComResult;
};
