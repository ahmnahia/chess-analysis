import { ChessPosition } from "../../../../types/chess";

export interface MoveButtonProps {
  pos: ChessPosition;
  isActive: boolean;
  onClick: () => void;
  className?: string;
  isLatest?: boolean;
}
