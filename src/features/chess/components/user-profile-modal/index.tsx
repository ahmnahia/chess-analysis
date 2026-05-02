"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Platform } from "./enum";
import useProfileModal from "./use-profile-modal";
import { GameRow } from "./components/game-row";
import { GAMES_PREVIEW_LIMIT } from "./constants";

export default function UserProfileModal() {
  const {
    username,
    loading,
    error,
    isOpen,
    games,
    platform,
    setIsOpen,
    handleSubmit,
    handleGameClick,
    onPlatformChange,
    onInputChange,
  } = useProfileModal();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Load Game
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] z-50">
        <div className="flex justify-center">
          <Tabs value={platform} onValueChange={onPlatformChange}>
            <TabsList>
              <TabsTrigger value={Platform.ChessCom}>Chess.com</TabsTrigger>
              <TabsTrigger value={Platform.Lichess}>Lichess</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <DialogHeader>
          <DialogTitle>Load Games from {platform}</DialogTitle>
          <DialogDescription>
            Enter a {platform} username to load their latest games.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="username">{platform} username</Label>
              <Input
                id="username"
                name="username"
                value={username}
                onChange={onInputChange}
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
          {games.length > 0 ? (
            <p className="font-bold mb-1">Last {GAMES_PREVIEW_LIMIT} Games</p>
          ) : null}
          <div className="max-h-[300px] max-sm:max-h-[200px] overflow-y-auto pr-1">
            {games.slice(0, GAMES_PREVIEW_LIMIT).map((game, index) => (
              <GameRow
                key={`${game.white.username}-${game.black.username}-${index}`}
                game={game}
                searchedUsername={username}
                onSelect={handleGameClick}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
