import { Outcome } from "./enum";

export const GAMES_PREVIEW_LIMIT = 20;

export const OUTCOME_BADGE_CLASS: Record<Outcome, string> = {
  win: "text-green-600 dark:text-green-400",
  loss: "text-red-600 dark:text-red-400",
  draw: "text-zinc-500 dark:text-zinc-400",
};
