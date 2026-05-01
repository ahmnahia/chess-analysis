import { GAME_PLAYER_INFO_COLORS } from "./constants";

export type GamePlayInfoColors = keyof typeof GAME_PLAYER_INFO_COLORS;

export interface GamePlayInfoProps {
  name: string;
  color?: GamePlayInfoColors;
}
