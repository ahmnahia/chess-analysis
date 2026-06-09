import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Chess } from "chess.js";
import { getLatestGames } from "../../api/chess-com";
import { ChessComGame } from "../../types/chess-com";
import { loadPositionsFromApi, selectChessState } from "../../chess-slice";
import { useChessContext } from "../../context/chess-provider";
import { getRemainingAndCapturedPieces } from "../../utils";
import { Platform } from "./enum";
import { getLatestLichessGames } from "../../api/lichess";
import { GameInfo } from "./types";
import { LichessGame } from "../../types/lichess";
import { normalizeUsername, toGameInfo } from "./utils";

export default function useProfileModal() {
  const dispatch = useDispatch();
  const { chessJs, calculateBestMovesForPositions } = useChessContext();
  const { engineDepth } = useSelector(selectChessState);
  const [platform, setPlatform] = useState<Platform>(Platform.ChessCom);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [games, setGames] = useState<GameInfo[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!normalizeUsername(username)) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const query = username.trim();
      const fetchedGames =
        platform === Platform.ChessCom
          ? ((await getLatestGames(query)) as ChessComGame[])
          : ((await getLatestLichessGames(query)) as LichessGame[]);

      if (fetchedGames.length === 0) {
        setError("No games found for this month");
        return;
      }

      const gameInfos = fetchedGames.map((game) =>
        toGameInfo(platform, game, query),
      );
      setGames(gameInfos);
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
    setGames([]);
  };

  const handleGameClick = async (game: GameInfo) => {
    const tempChess = new Chess();
    tempChess.loadPgn(game.pgn);
    const history = tempChess.history({ verbose: true });
    const board = new Chess();
    const chessPositions = history.map((move) => {
      board.move(move);
      return {
        ...move,
        isCalculatingBestMove: true,
        remainingPieces: getRemainingAndCapturedPieces(board.board()),
      };
    });

    chessJs.reset();
    dispatch(
      loadPositionsFromApi({
        chessPositions,
        game,
        isBoardFlipped:
          normalizeUsername(username) ===
          normalizeUsername(game.black.username),
      }),
    );
    await calculateBestMovesForPositions(chessPositions, engineDepth);
  };

  const clearSearchData = () => {
    setGames([]);
    setError(null);
  };

  const onPlatformChange = (value: string) => {
    setPlatform(value as Platform);
    clearSearchData();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    clearSearchData();
  };

  return {
    username,
    loading,
    error,
    isOpen,
    games,
    platform,
    setIsOpen,
    handleSubmit,
    handleClose,
    handleGameClick,
    onPlatformChange,
    onInputChange,
  };
}
