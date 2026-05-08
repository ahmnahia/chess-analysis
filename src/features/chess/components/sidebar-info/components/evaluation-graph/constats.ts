import { MoveClassification } from "../../../../enums";

export const EVAL_SWING_THRESHOLD = 2;
export const VIEW_W = 260;
export const VIEW_H = 60;
export const PAD_X = 4;
export const PAD_Y = 5;

export const MOVE_CLASSIFICATION_COLORS: Record<
  MoveClassification | "DEFAULT",
  string
> = {
  [MoveClassification.FORCED]: "stroke-green-600 fill-green-600",
  [MoveClassification.INACCURACY]: "stroke-yellow-600 fill-yellow-600",
  [MoveClassification.MISTAKE]: "stroke-yellow-600 fill-yellow-600",
  [MoveClassification.BLUNDER]: "stroke-red-600 fill-red-600",
  [MoveClassification.GREAT]: "stroke-green-600 fill-green-600",
  [MoveClassification.GOOD]: "stroke-green-600 fill-green-600",
  [MoveClassification.EXCELLENT]: "stroke-green-600 fill-green-600",
  [MoveClassification.BEST]: "stroke-green-600 fill-green-600",
  [MoveClassification.OPENING]: "stroke-amber-500 fill-amber-500",
  DEFAULT: "stroke-zinc-500 fill-zinc-500",
};
