import { ChessComGame, ChessComApiResponse } from "../types/chess-com";

const CHESS_COM_API_BASE = "https://api.chess.com/pub";

export async function getLatestGames(
  username: string,
): Promise<ChessComGame[]> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const response = await fetch(
    `${CHESS_COM_API_BASE}/player/${username}/games/${year}/${(month - 1).toString().padStart(2, "0")}`,
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Username ${username} not found on Chess.com`);
    }
    throw new Error(`Failed to fetch games: ${response.status}`);
  }

  const data: ChessComApiResponse = await response.json();

  return data.games.sort(
    (a, b) => new Date(b.end_time).getTime() - new Date(a.end_time).getTime(),
  );
}
