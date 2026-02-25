"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { chessComApi } from "@/services/api/chessComAi";
import { ChessComGame } from "@/services/types/chessCom";
import { convertPgnToFens, } from "../../chessSlice";
import useChess from "../../useChess";
import { useDispatch } from "react-redux";
import { pgnToFens } from "../../utils";

interface UserProfileModalProps {
  onGamesLoaded?: (games: ChessComGame[]) => void;
}

export default function UserProfileModal({
  onGamesLoaded,
}: UserProfileModalProps) {
  const dispatch = useDispatch();
  const { chessJs } = useChess();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [games, setGames] = useState<ChessComGame[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch latest games from Chess.com
      const games = await chessComApi.getLatestGames(username, 10);

      if (games.length === 0) {
        setError("No games found for this username");
        return;
      }

      // Call the callback with the fetched games
      //   onGamesLoaded?.(games);

      // Close the modal
      //   setIsOpen(false);
    //   setUsername("");
      setGames(games);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch games");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setUsername("");
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Load Game
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] z-50">
        <DialogHeader>
          <DialogTitle>Load Games from Chess.com</DialogTitle>
          <DialogDescription>
            Enter a Chess.com username to load their latest games.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="username">Chess.com Username</Label>
              <Input
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username (e.g., hikaru)"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" disabled={loading || !username.trim()}>
              {loading ? "Fetching..." : "Fetch Games"}
            </Button>
          </DialogFooter>
        </form>
        <div>
          {games.length > 0 && <p className="font-bold">Last 10 Games</p>}
          {games.map((game) => {
            const result = game.white.username === username ? game.white.result : game.black.result;
            const resultColor = result === "win"  ? "text-green-500" : result === "loss" || result === "checkmated" || result === "timeout" || result === "resigned" ? "text-red-500" : "text-zinc-500";
            return <div className="underline cursor-pointer" key={game.url}>
              <button onClick={() => {
                chessJs.loadPgn(game.pgn);
                dispatch(convertPgnToFens(pgnToFens(chessJs, game.pgn))); 
              }}>

                <h3>{game.black.username} - {game.white.username} (<span className={resultColor}>{result}</span>)</h3>
              </button>

            </div>
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
