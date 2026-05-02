export type Status =
  | "created"
  | "started"
  | "aborted"
  | "mate"
  | "resign"
  | "stalemate"
  | "timeout"
  | "draw"
  | "outoftime"
  | "cheat"
  | "noStart"
  | "unknownFinish"
  | "insufficientMaterialClaim"
  | "variantEnd";

export type Variant =
  | "standard"
  | "chess960"
  | "kingOfTheHill"
  | "threeCheck"
  | "antichess"
  | "byzantine"
  | "horde"
  | "racingKings"
  | "crazyhouse";

export interface LichessGamePlayerUser {
  id: string;
  name: string;
}

export interface LichessGamePlayer {
  user?: LichessGamePlayerUser;
  rating?: number;
  ratingDiff?: number;
  aiLevel?: number;
}

export interface LichessGame {
  id: string;
  rated: boolean;
  speed: string;
  status: Status;
  variant: Variant;
  players: {
    white: LichessGamePlayer;
    black: LichessGamePlayer;
  };
  initialFen: string;
  moves: string;
  pgn: string;
  source: string;
  winner?: "white" | "black";
  lastMoveAt: number;
}
