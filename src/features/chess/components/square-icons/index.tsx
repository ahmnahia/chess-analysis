import React from "react";
import { MoveClassification } from "../../types/chess-board";

export type SquareIconsProps = {
  moveClassification?: MoveClassification;
  className?: string;
};

const SquareIcons: React.FC<SquareIconsProps> = ({
  moveClassification,
  className,
}) => {
  return <div className={className}>Square Icons</div>;
};

export default SquareIcons;
