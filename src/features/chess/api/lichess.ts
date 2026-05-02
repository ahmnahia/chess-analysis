import { LichessGame } from "../types/lichess";
import { GAMES_PREVIEW_LIMIT } from "../components/user-profile-modal/constants";

const LICHESS_API_BASE = "https://lichess.org/api";

function parseNdjsonGames(text: string): LichessGame[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as LichessGame);
}

export async function getLatestLichessGames(
  username: string,
): Promise<LichessGame[]> {
  const response = await fetch(
    `${LICHESS_API_BASE}/games/user/${username}?max=${GAMES_PREVIEW_LIMIT}&pgnInJson=true`,
    {
      headers: {
        Accept: "application/x-ndjson",
      },
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Username ${username} not found on Lichess`);
    }
    throw new Error(`Failed to fetch games: ${response.status}`);
  }

  const text = await response.text();
  return parseNdjsonGames(text);
}
