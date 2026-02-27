import { ChessComGame, ChessComApiResponse, ChessComGameDetail } from '../types/chess-com';

// API configuration
const CHESS_COM_API_BASE = 'https://api.chess.com/pub';

// Rate limiting utility
class RateLimiter {
  private requests: number[] = [];
  private readonly limit = 10; // 10 requests per 10 seconds
  private readonly window = 10000; // 10 seconds
  
  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.window);
    return this.requests.length < this.limit;
  }
  
  recordRequest(): void {
    this.requests.push(Date.now());
  }
}

const rateLimiter = new RateLimiter();

// API functions
export const chessComApi = {
  // Get latest games for a user (current month)
  async getLatestGames(username: string, limit: number = 10): Promise<ChessComGame[]> {
    if (!rateLimiter.canMakeRequest()) {
      throw new Error('Rate limit exceeded. Please wait before making another request.');
    }
    
    rateLimiter.recordRequest();
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    const response = await fetch(
      `${CHESS_COM_API_BASE}/player/${username}/games/${year}/${month.toString().padStart(2, '0')}`
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Username not found on Chess.com');
      }
      throw new Error(`Failed to fetch games: ${response.status}`);
    }
    
    const data: ChessComApiResponse = await response.json();
    
    return data.games
      .sort((a, b) => new Date(b.end_time).getTime() - new Date(a.end_time).getTime())
      .slice(0, limit);
  },

  // get detailed game information including full PGN
  async getGameDetail(gameUrl: string): Promise<ChessComGameDetail> {
    if (!rateLimiter.canMakeRequest()) {
      throw new Error('Rate limit exceeded. Please wait before making another request.');
    }
    
    rateLimiter.recordRequest();
    
    const response = await fetch(gameUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch game details: ${response.status}`);
    }
    
    const data: ChessComGameDetail = await response.json();
    return data;
  },

  // Get PGN for a specific game
  async getGamePgn(gameUrl: string): Promise<string> {
    const gameDetail = await this.getGameDetail(gameUrl);
    return gameDetail.pgn;
  },

  // Validate username exists
  async validateUsername(username: string): Promise<boolean> {
    try {
      const response = await fetch(`${CHESS_COM_API_BASE}/player/${username}`);
      return response.ok;
    } catch {
      return false;
    }
  }
};

