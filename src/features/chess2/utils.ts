import { PieceKey, PieceCords, ChessBoardType, LastPieceMoved } from "./types";

export const isWhitePiece = (piece: PieceKey): boolean => {
  return ["K", "Q", "R", "B", "N", "P"].includes(piece);
};

// if the grid selected is a legal move for the current selected piece, then this function will return true.
export const isGridSelectedPartOfLegalMove = (
  currentSelectedPiece: PieceCords,
  selectedPieceLegalMoves: PieceCords[]
): boolean => {
  for (let i = 0; i < selectedPieceLegalMoves.length; i++) {
    if (
      currentSelectedPiece.row === selectedPieceLegalMoves[i].row &&
      currentSelectedPiece.col === selectedPieceLegalMoves[i].col
    )
      return true;
  }
  return false;
};

export const isSameCords = (
  cords1: PieceCords | undefined,
  cords2: PieceCords | undefined
): boolean => {
  if (!cords1 || !cords2) return false;
  return cords1.row === cords2.row && cords1.col === cords2.col;
};

export const isEnPassantForSlice = (
  newCords: PieceCords,
  legelMovesForMovedPiece: PieceCords[]
): boolean => {
  for (let lm of legelMovesForMovedPiece) {
    if (
      lm.row === newCords.row &&
      lm.col === newCords.col &&
      lm.isEnPassantMove
    )
      return true;
  }
  return false;
};

export const isCastleForSlice = (
  newCords: PieceCords,
  legelMovesForMovedPiece: PieceCords[]
): "short" | "long" | undefined => {
  for (let lm of legelMovesForMovedPiece) {
    if (
      lm.row === newCords.row &&
      lm.col === newCords.col &&
      lm.castleMove?.isCastleMove
    )
      return lm.castleMove.direction;
  }
  return undefined;
};

const calculatePawnLegalMoves = (
  piece: PieceKey,
  lastPieceMoved: LastPieceMoved,
  cords: PieceCords,
  board: ChessBoardType
): PieceCords[] => {
  const legalMoves: PieceCords[] = [];
  const isWhite = isWhitePiece(piece);
  const direction = isWhite ? -1 : 1; // white moves up and black moves down
  const startRow = isWhite ? 6 : 1;
  const { row, col } = cords;

  // forward move by 1
  if (!board[row + direction][col]) {
    legalMoves.push({ row: row + direction, col });

    // move by 2 on first move
    if (row === startRow && !board[row + 2 * direction][col]) {
      legalMoves.push({ row: row + 2 * direction, col });
    }
  }

  // captures diagonally
  for (const offset of [-1, 1]) {
    const targetCol = col + offset;
    const targetRow = row + direction;
    const targetPiece = board[targetRow][targetCol];

    if (targetPiece && isWhitePiece(targetPiece.pieceLetter) !== isWhite) {
      legalMoves.push({ row: targetRow, col: targetCol });
    }

    // en passant
    const adjacentCol = col + offset;
    const adjacentRow = row;
    const adjacentPiece = board[adjacentRow][adjacentCol];

    if (
      adjacentPiece?.pieceLetter.toLocaleLowerCase() === "p" &&
      isSameCords(lastPieceMoved?.newCords, {
        col: adjacentCol,
        row: adjacentRow,
      }) &&
      isWhitePiece(adjacentPiece.pieceLetter) !== isWhite &&
      ((lastPieceMoved?.newCords.row === 3 &&
        !isWhitePiece(lastPieceMoved.piece)) ||
        (lastPieceMoved?.newCords.row === 4 &&
          isWhitePiece(lastPieceMoved.piece)))
    ) {
      legalMoves.push({
        row: targetRow,
        col: adjacentCol,
        isEnPassantMove: true,
      });
    }
  }

  return legalMoves;
};

const calculateKnightLegalMoves = (
  piece: PieceKey,
  cords: PieceCords,
  board: ChessBoardType
): PieceCords[] => {
  const legalMoves: PieceCords[] = [];
  const isWhite = isWhitePiece(piece);
  const { row, col } = cords;

  // All possible knight moves (row offset, col offset)
  const moveOffsets = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];

  for (const [dr, dc] of moveOffsets) {
    const targetRow = row + dr;
    const targetCol = col + dc;

    // Check if target is inside the board
    if (targetRow < 0 || targetRow > 7 || targetCol < 0 || targetCol > 7)
      continue;

    const targetPiece = board[targetRow][targetCol];

    // Square is either empty or has an opponent's piece
    if (!targetPiece || isWhitePiece(targetPiece.pieceLetter) !== isWhite) {
      legalMoves.push({ row: targetRow, col: targetCol });
    }
  }

  return legalMoves;
};

const calculateBishopLegalMoves = (
  piece: PieceKey,
  cords: PieceCords,
  board: ChessBoardType
): PieceCords[] => {
  const legalMoves: PieceCords[] = [];
  const isWhite = isWhitePiece(piece);
  const { row, col } = cords;

  const directions = [
    [-1, -1], // up-left
    [-1, 1], // up-right
    [1, -1], // down-left
    [1, 1], // down-right
  ];

  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;

    // keep going in the same direction until out of bounds or blocked
    while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
      const targetPiece = board[r][c];

      if (!targetPiece) {
        // empty square, can move here
        legalMoves.push({ row: r, col: c });
      } else {
        // not empty, can capture if it is the opponent
        if (isWhitePiece(targetPiece.pieceLetter) !== isWhite) {
          legalMoves.push({ row: r, col: c });
        }
        // stop moving in this direction after hitting any piece
        break;
      }

      // move further in the same direction
      r += dr;
      c += dc;
    }
  }

  return legalMoves;
};

const calculateRookLegalMoves = (
  piece: PieceKey,
  cords: PieceCords,
  board: ChessBoardType
): PieceCords[] => {
  const legalMoves: PieceCords[] = [];
  const { row, col } = cords;
  const isWhite = isWhitePiece(piece);

  const directions = [
    [-1, 0], // top
    [0, 1], // right
    [1, 0], // bottom
    [0, -1], // left
  ];

  for (let [dr, dc] of directions) {
    let r = dr + row;
    let c = dc + col;

    while (r <= 7 && r >= 0 && c <= 7 && c >= 0) {
      const targetPiece = board[r][c];

      if (!targetPiece) {
        legalMoves.push({ row: r, col: c });
      } else {
        if (targetPiece && isWhitePiece(targetPiece.pieceLetter) !== isWhite) {
          legalMoves.push({ row: r, col: c });
        }
        break;
      }

      r += dr;
      c += dc;
    }
  }

  return legalMoves;
};

const calculateQueenLegalMoves = (
  piece: PieceKey,
  cords: PieceCords,
  board: ChessBoardType
): PieceCords[] => {
  const diagnolMoves = calculateBishopLegalMoves(piece, cords, board);
  const rookMoves = calculateRookLegalMoves(piece, cords, board);

  return [...diagnolMoves, ...rookMoves];
};

const calculateKingMoves = (
  piece: PieceKey,
  cords: PieceCords,
  board: ChessBoardType
): PieceCords[] => {
  const legalMoves: PieceCords[] = [];
  const { row, col } = cords;
  const isWhite = isWhitePiece(piece);

  const directions = [
    [-1, 0], // top
    [-1, 1], //top right
    [0, 1], //right
    [1, 1], //bottom right
    [1, 0], // bottom
    [1, -1], //bottom left
    [0, -1], // left
    [-1, -1],
  ];

  for (let [dr, dc] of directions) {
    const r = dr + row;
    const c = dc + col;

    if (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
      const targetGrid = board[r][c];

      if (!targetGrid) {
        legalMoves.push({ row: r, col: c });

        const isStartingKing =
          ((isWhite && row === 7) || (!isWhite && row === 0)) &&
          col === 4 &&
          !board[row][col]?.hasBeenMoved &&
          dr === 0;

        if (isStartingKing) {
          const castleData = [
            {
              dir: "long" as const,
              emptyCheck: !board[r][c - 1],
              rookCol: c - 3,
              targetCol: c - 1,
            },
            {
              dir: "short" as const,
              emptyCheck: !board[r][c + 1],
              rookCol: c + 2,
              targetCol: c + 1,
            },
          ];

          for (const { dir, emptyCheck, rookCol, targetCol } of castleData) {
            const rook = board[r][rookCol];
            if (emptyCheck && rook && !rook.hasBeenMoved) {
              legalMoves.push({
                row: r,
                col: targetCol,
                castleMove: { isCastleMove: true, direction: dir },
              });
            }
          }
        }
      } else if (isWhitePiece(targetGrid.pieceLetter) !== isWhite) {
        legalMoves.push({ row: r, col: c });
      }
    }
  }

  return legalMoves;
};

export const pieceLegalMoves = (
  piece: PieceKey,
  lastPieceMoved: LastPieceMoved,
  cords: PieceCords,
  board: ChessBoardType
): PieceCords[] => {
  switch (piece.toLocaleLowerCase()) {
    case "p":
      return calculatePawnLegalMoves(piece, lastPieceMoved, cords, board);
    case "n":
      return calculateKnightLegalMoves(piece, cords, board);
    case "b":
      return calculateBishopLegalMoves(piece, cords, board);
    case "r":
      return calculateRookLegalMoves(piece, cords, board);
    case "q":
      return calculateQueenLegalMoves(piece, cords, board);
    case "k":
      return calculateKingMoves(piece, cords, board);
    default:
      return [];
  }
};
