import useGraphTooltip from "./use-graph-tooltip";
import { TIP_FONT_SIZE, TIP_H } from "./constants";

interface GraphTooltipProps {
  hasHover: boolean;
  lineHoverIdx: number;
  lines: any;
  VIEW_W: number;
  equityY: number;
}

export default function GraphTooltip({
  hasHover,
  lineHoverIdx,
  lines,
  VIEW_W,
  equityY,
}: GraphTooltipProps) {
  const { hoveredLine, tipX, tipY, tipW, tipText } = useGraphTooltip(
    hasHover,
    lineHoverIdx,
    lines,
    VIEW_W,
    equityY,
  );

  return (
    hoveredLine && (
      <g pointerEvents="none">
        <line
          x1={hoveredLine.x}
          x2={hoveredLine.x}
          y1={hoveredLine.y1}
          y2={hoveredLine.y2}
          className={hoveredLine.className}
          vectorEffect="non-scaling-stroke"
          strokeWidth={1.25}
          opacity={0.85}
        />
        <rect
          x={tipX}
          y={tipY}
          width={tipW}
          height={TIP_H}
          rx={2}
          ry={2}
          className="fill-primary"
          filter="url(#evalTipShadow)"
        />
        <text
          x={tipX + tipW / 2}
          y={equityY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={TIP_FONT_SIZE}
          fontWeight={500}
          className="fill-primary-foreground"
        >
          {tipText}
        </text>
      </g>
    )
  );
}
