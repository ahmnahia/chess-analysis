export const SIDEBAR_INFO_CLASSES = {
  navButton: "dark:bg-dark-900",
  navIcon: "[&_svg]:w-6 [&_svg]:dark:fill-white",
  moveRow:
    "flex flex-wrap items-center text-sm text-dark-800 dark:text-dark-400 py-1 px-4",
  moveContainer: "flex gap-1 py-1 pe-2 cursor-pointer",
  activeBackground: "bg-zinc-300 dark:bg-dark-700",
  pieceIcon: "[&_svg]:w-5 [&_svg]:h-5",
} as const;

export const SIDEBAR_NAV_ICONS = {
  first: "/icons/forward-step.svg",
  previous: "/icons/angle-right.svg",
  next: "/icons/angle-right.svg",
  last: "/icons/forward-step.svg",
  rotate: "/icons/rotate.svg",
} as const;
