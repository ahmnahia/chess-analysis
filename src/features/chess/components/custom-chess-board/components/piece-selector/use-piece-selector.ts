import { RefObject, useLayoutEffect, useMemo, useState } from "react";
import { PromotionPiece } from "./enum";
import { SquareLayout } from "./types";
import { Color } from "chess.js";

export default function usePieceSelector(
  chessBoardRef: RefObject<HTMLDivElement | null>,
  promotionPendingToSquare: string,
  color: Color,
  isBoardFlipped: boolean,
) {
  const [layout, setLayout] = useState<SquareLayout | null>(null);
  const pieces = useMemo(() => Object.values(PromotionPiece), []);

  useLayoutEffect(() => {
    const board = chessBoardRef.current;

    if (!board || !promotionPendingToSquare) {
      return;
    }

    let cancelled = false;
    let rafId = 0;
    let attempts = 0;

    const measure = () => {
      if (cancelled) return;

      let newPromotionPendingToSquare = promotionPendingToSquare;
      if (color === "b" && !isBoardFlipped) {
        newPromotionPendingToSquare = promotionPendingToSquare.replace(
          "1",
          "5",
        );
      } else if (color === "w" && isBoardFlipped) {
        newPromotionPendingToSquare = promotionPendingToSquare.replace(
          "8",
          "4",
        );
      }

      const el = board.querySelector<HTMLElement>(
        `[data-square="${newPromotionPendingToSquare}"]`,
      );
      if (!el) {
        return;
      }

      const cRect = board.getBoundingClientRect();
      const sRect = el.getBoundingClientRect();
      setLayout({
        left: sRect.left - cRect.left + board.scrollLeft,
        top: sRect.top - cRect.top + board.scrollTop,
        size: sRect.width,
      });
    };

    const measureOrRetry = () => {
      if (cancelled) return;

      measure();

      if (board.querySelector(`[data-square="${promotionPendingToSquare}"]`)) {
        return;
      }
      if (attempts++ < 24) {
        rafId = requestAnimationFrame(measureOrRetry);
      }
    };

    measureOrRetry();

    const ro = new ResizeObserver(measure);
    ro.observe(board);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      setLayout(null);
      ro.disconnect();
    };
  }, [promotionPendingToSquare, chessBoardRef, isBoardFlipped]);

  return {
    layout,
    pieces,
  };
}
