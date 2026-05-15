import { MoveClassification } from "../../enums";

export const SIDEBAR_INFO_CLASSES = {
  navButton: "dark:bg-dark-900",
  navIcon: "[&_svg]:w-6 [&_svg]:dark:fill-white",
  moveRow:
    "flex flex-wrap items-center text-sm text-dark-800 dark:text-dark-400 py-1 px-4",
  moveContainer: "flex gap-1 py-1 pe-2 cursor-pointer",
  activeBackground: "bg-zinc-300 dark:bg-dark-700",
  pieceIcon: "[&_svg]:w-5 [&_svg]:h-5",
  moveClassificationBadge:
    "relative inline-flex size-[25px] shrink-0 items-center justify-center " +
    "[&::before]:!left-1/2 [&::before]:!top-1/2 [&::before]:!right-auto [&::before]:!h-[25px] [&::before]:!w-[25px] " +
    "[&::before]:-translate-x-1/2 [&::before]:-translate-y-1/2 [&::before]:!bg-size-[20px_20px]",
} as const;

export const SIDEBAR_NAV_ICONS = {
  first: "/icons/forward-step.svg",
  previous: "/icons/angle-right.svg",
  next: "/icons/angle-right.svg",
  last: "/icons/forward-step.svg",
  rotate: "/icons/rotate.svg",
} as const;

export const MOVE_CLASSIFICATION_TEXTS: Record<
  MoveClassification | "BEST_ALTERNATIVE",
  string
> = {
  [MoveClassification.FORCED]: "is forced",
  [MoveClassification.INACCURACY]: "is inaccurate",
  [MoveClassification.MISTAKE]: "is a mistake",
  [MoveClassification.BLUNDER]: "is a blunder",
  [MoveClassification.GREAT]: "is a great move",
  [MoveClassification.GOOD]: "is good",
  [MoveClassification.EXCELLENT]: "is excellent",
  [MoveClassification.BEST]: "is the best move",
  [MoveClassification.OPENING]: "is an opening move",
  BEST_ALTERNATIVE: "was the best move",
} as const;

export const piceLettersWithoutP = ["N", "B", "R", "Q", "K"];
