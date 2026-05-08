"use client";

import useEvaluationGraph from "./use-evaluation-graph";
import { MOVE_CLASSIFICATION_COLORS } from "./constats";
import GraphTooltip from "./components/graph-tooltip";
import { VIEW_W, VIEW_H, PAD_X, PAD_Y } from "./constats";

export default function EvaluationGraph() {
  const {
    pathD,
    fillBelowD,
    swingMarkers,
    cursorX,
    showCursor,
    equityY,
    chessPositions,
    currentChessPositionIdx,
    lines,
    lineHoverIdx,
    hasHover,
    onSvgMouseMove,
    onSvgMouseLeave,
    onSvgClick,
  } = useEvaluationGraph();
  const activePosition = chessPositions[currentChessPositionIdx];

  return (
    <div className="w-full px-2 my-3">
      <div
        className="w-full overflow-hidden rounded-md border border-zinc-300/90 shadow-inner dark:border-zinc-800 bg-zinc-900"
        style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
      >
        <svg
          className="cursor-pointer"
          width="100%"
          height="100%"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          onMouseMove={onSvgMouseMove}
          onMouseLeave={onSvgMouseLeave}
          onClick={onSvgClick}
        >
          <defs>
            <filter
              id="evalTipShadow"
              x="-20%"
              y="-50%"
              width="140%"
              height="200%"
            >
              <feDropShadow
                dx="0"
                dy="0.4"
                stdDeviation="0.5"
                floodOpacity="0.35"
              />
            </filter>
          </defs>
          <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="transparent" />
          <path
            d={fillBelowD}
            className="fill-white"
            fillRule="nonzero"
            pointerEvents="none"
          />
          <line
            x1={PAD_X}
            x2={VIEW_W - PAD_X}
            y1={equityY}
            y2={equityY}
            className="stroke-zinc-500/50 dark:stroke-zinc-500/45"
            strokeWidth={0.9}
            vectorEffect="non-scaling-stroke"
            pointerEvents="none"
          />
          <path
            d={pathD}
            fill="none"
            className="stroke-zinc-900 dark:stroke-zinc-600"
            strokeWidth={1.05}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            pointerEvents="none"
          />
          {swingMarkers.map((m, i) => (
            <circle
              key={i}
              cx={m.x}
              cy={m.y}
              r={2.4}
              className={m.className}
              strokeWidth={0.55}
              vectorEffect="non-scaling-stroke"
              pointerEvents="none"
            />
          ))}
          {showCursor && (
            <line
              x1={cursorX}
              x2={cursorX}
              y1={PAD_Y}
              y2={VIEW_H - PAD_Y}
              className={
                MOVE_CLASSIFICATION_COLORS[
                  activePosition?.moveClassification ?? "DEFAULT"
                ]
              }
              strokeWidth={1.05}
              vectorEffect="non-scaling-stroke"
              pointerEvents="none"
            />
          )}
          <GraphTooltip
            hasHover={hasHover}
            lineHoverIdx={lineHoverIdx}
            lines={lines}
            VIEW_W={VIEW_W}
            equityY={equityY}
          />
        </svg>
      </div>
    </div>
  );
}
