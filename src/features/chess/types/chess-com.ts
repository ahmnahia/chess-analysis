export type Result =
  | "win"
  | "checkmated"
  | "agreed"
  | "repetition"
  | "timeout"
  | "resigned"
  | "stalemate"
  | "lose"
  | "insufficient"
  | "50move"
  | "abandoned";

type Player = {
  username: string;
  rating: number;
  result: Result;
};

export interface ChessComGame {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  fen: string;
  time_class: string;
  black: Player;
  white: Player;
}

export interface ChessComApiResponse {
  games: ChessComGame[];
}
