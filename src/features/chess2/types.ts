export type PieceKey =
  | "k"
  | "q"
  | "r"
  | "b"
  | "n"
  | "p"
  | "K"
  | "Q"
  | "R"
  | "B"
  | "N"
  | "P";

export type PieceTitle =
  | "king"
  | "queen"
  | "rook"
  | "bishop"
  | "knight"
  | "pawn";

export type PieceEntry = {
  img: string;
  title: PieceTitle;
};

export type CastleDirection = "short" | "long" | undefined;
export type PieceCords = {
  row: number;
  col: number;
  isEnPassantMove?: boolean;
  castleMove?: { isCastleMove?: boolean; direction: CastleDirection };
};

export type ChessPiece = {
  pieceLetter: PieceKey;
  cords: PieceCords;
};

export type ChessBoardType = (
  | { pieceLetter: PieceKey; hasBeenMoved: boolean }
  | undefined
)[][];

export type SelectedPiece = ChessPiece | undefined;

export type LastPieceMoved =
  | {
      piece: PieceKey;
      oldCords: PieceCords;
      newCords: PieceCords;
    }
  | undefined;
