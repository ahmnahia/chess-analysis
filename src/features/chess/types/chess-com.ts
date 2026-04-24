type Player = {
  username: string;
  rating: number;
  result: string;
}

export interface ChessComGame {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  fen: string;
  time_class: string;
  rules: string;
  black: Player;
  white: Player;
  result: string;
  uuid: string;
}

export interface ChessComApiResponse {
  games: ChessComGame[];
}

export interface ChessComGameDetail {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  fen: string;
  time_class: string;
  rules: string;
  white: string;
  black: string;
  result: string;
  uuid: string;
  moves: string;
  tournament: string;
  match: string;
}
