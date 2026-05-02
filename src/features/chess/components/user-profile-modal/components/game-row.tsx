import { OUTCOME_BADGE_CLASS } from "../constants";
import { gameRowResultLabel } from "../utils";
import { GameRowProps } from "./types";

const chipBase = "text-xs py-1 px-2 rounded-full bg-zinc-200 dark:bg-zinc-800";

export function GameRow({ game, searchedUsername, onSelect }: GameRowProps) {
  const resultLabel = gameRowResultLabel(game, searchedUsername);
  const outcomeClass = OUTCOME_BADGE_CLASS[game.outcome];

  return (
    <button
      type="button"
      className="flex flex-col gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 px-2 my-2 w-full text-left cursor-pointer hover:bg-zinc-200/70 dark:hover:bg-zinc-900/80"
      onClick={() => onSelect(game)}
    >
      <h3>
        {game.white.username}
        <span className="text-xs mx-2 text-zinc-500"> vs </span>
        {game.black.username}
      </h3>
      <div className="flex gap-1 flex-wrap">
        {resultLabel ? (
          <span
            className={`capitalize ${chipBase} font-medium ${outcomeClass}`}
          >
            {resultLabel}
          </span>
        ) : null}
        {game.date ? (
          <span className={chipBase}>
            {new Date(game.date).toLocaleDateString()}
          </span>
        ) : null}
      </div>
    </button>
  );
}
