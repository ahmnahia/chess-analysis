import { useCallback, useEffect, useMemo, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectChessState,
  setCurrentChessPositionIdx,
} from "@/features/chess/chess-slice";
import {
  EVAL_SWING_THRESHOLD,
  MOVE_CLASSIFICATION_COLORS,
  PAD_X,
  PAD_Y,
  VIEW_H,
  VIEW_W,
} from "./constants";
import { innerDimensions, whiteShare, whiteValue } from "./utils";
import { Line } from "./types";
import { MoveClassification } from "@/features/chess/enums";
import { ChessPosition } from "@/features/chess/types/chess";

export default function useEvaluationGraph() {
  const dispatch = useDispatch();
  const { chessPositions, currentChessPositionIdx } =
    useSelector(selectChessState);
  const n = chessPositions.length;

  const { pathD, fillBelowD, swingMarkers, lines, equityY } = useMemo(() => {
    const { innerW, bottom, innerH, equityY } = innerDimensions(
      VIEW_W,
      VIEW_H,
      PAD_X,
      PAD_Y,
    );
    const denom = Math.max(1, n - 1);
    const xAt = (i: number) => PAD_X + (i / denom) * innerW;
    const yAtShare = (share: number) => {
      const s = Math.min(1, Math.max(0, share));
      return bottom - s * innerH;
    };

    if (n === 0) {
      return {
        pathD: "",
        fillBelowD: "",
        swingMarkers: [] as {
          x: number;
          y: number;
          delta: number;
          className: string;
        }[],
        lines: [] as Line[],
        equityY,
      };
    }

    const pts = chessPositions.map((p: ChessPosition, i: number) => ({
      x: xAt(i),
      y: yAtShare(whiteShare(p)),
    }));

    const lineD = pts
      .map((pt: { x: number; y: number }, i: number) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`)
      .join(" ");

    const x0 = pts[0]!.x;
    const xn = pts[n - 1]!.x;
    const fillParts = [`M ${x0} ${bottom}`, `L ${pts[0]!.x} ${pts[0]!.y}`];
    for (let i = 1; i < n; i++) {
      fillParts.push(`L ${pts[i]!.x} ${pts[i]!.y}`);
    }
    fillParts.push(`L ${xn} ${bottom} Z`);

    const swingMarkers: {
      x: number;
      y: number;
      delta: number;
      className: string;
    }[] = [];
    const lines: Line[] = [];

    for (let i = 0; i < n; i++) {
      const cls =
        MOVE_CLASSIFICATION_COLORS[
          (chessPositions[i]?.moveClassification as MoveClassification) ?? "DEFAULT"
        ];
      lines.push({
        x: xAt(i),
        y1: PAD_Y,
        y2: VIEW_H - PAD_Y,
        className: cls,
        eval: whiteValue(chessPositions[i]),
        mateIn: chessPositions[i]?.evaluationView?.mateIn ?? undefined,
      });
      if (i === 0) continue;
      const dv =
        whiteValue(chessPositions[i]) - whiteValue(chessPositions[i - 1]);
      if (Math.abs(dv) < EVAL_SWING_THRESHOLD) continue;
      swingMarkers.push({
        x: pts[i]!.x,
        y: pts[i]!.y,
        delta: dv,
        className: cls,
      });
    }

    return {
      pathD: lineD,
      fillBelowD: fillParts.join(" "),
      swingMarkers,
      lines,
      equityY,
    };
  }, [chessPositions, n]);

  const { cursorX, showCursor } = useMemo(() => {
    if (n === 0) return { cursorX: 0, showCursor: false };
    const innerW = VIEW_W - 2 * PAD_X;
    const denom = Math.max(1, n - 1);
    const clampedIdx = Math.min(Math.max(currentChessPositionIdx, -1), n - 1);
    return {
      showCursor: clampedIdx >= 0,
      cursorX: clampedIdx >= 0 ? PAD_X + (clampedIdx / denom) * innerW : 0,
    };
  }, [n, currentChessPositionIdx]);

  const [lineHoverIdx, setLineHoverIdx] = useState<number>(-1);
  const [hasHover, setHasHover] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover)");
    setHasHover(mq.matches);
    const update = (e: MediaQueryListEvent) => setHasHover(e.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const indexFromClientX = useCallback(
    (svg: SVGSVGElement, clientX: number): number => {
      if (n <= 0) return -1;
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0) return -1;
      const innerW = VIEW_W - 2 * PAD_X;
      const ratio = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      const xInView = ratio * VIEW_W;
      const xClamped = Math.max(PAD_X, Math.min(VIEW_W - PAD_X, xInView));
      const denom = Math.max(1, n - 1);
      return Math.round(((xClamped - PAD_X) / innerW) * denom);
    },
    [n],
  );

  const onSvgMouseMove = useCallback(
    (e: ReactMouseEvent<SVGSVGElement>) => {
      if (!hasHover) return;
      const idx = indexFromClientX(e.currentTarget, e.clientX);
      setLineHoverIdx((prev) => (prev === idx ? prev : idx));
    },
    [hasHover, indexFromClientX],
  );

  const onSvgMouseLeave = useCallback(() => {
    if (!hasHover) return;
    setLineHoverIdx((prev) => (prev === -1 ? prev : -1));
  }, [hasHover]);

  const onSvgClick = useCallback(
    (e: ReactMouseEvent<SVGSVGElement>) => {
      const idx = indexFromClientX(e.currentTarget, e.clientX);
      if (idx >= 0) dispatch(setCurrentChessPositionIdx(idx));
    },
    [indexFromClientX, dispatch],
  );

  return {
    pathD,
    fillBelowD,
    swingMarkers,
    lines,
    cursorX,
    showCursor,
    equityY,
    chessPositions,
    currentChessPositionIdx,
    lineHoverIdx,
    hasHover,
    onSvgMouseMove,
    onSvgMouseLeave,
    onSvgClick,
  };
}
