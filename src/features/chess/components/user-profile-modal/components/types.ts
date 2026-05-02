import { GameInfo } from "../types";

export interface GameRowProps {
  game: GameInfo;
  searchedUsername: string;
  onSelect: (game: GameInfo) => void;
}
