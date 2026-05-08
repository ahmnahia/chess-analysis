import { ChessPosition } from "../../../../types/chess";

export function innerDimensions(
  viewW: number,
  viewH: number,
  padX: number,
  padY: number,
) {
  const innerW = viewW - 2 * padX;
  const top = padY;
  const bottom = viewH - padY;
  const innerH = bottom - top;
  const equityY = bottom - 0.5 * innerH;
  return { innerW, top, bottom, innerH, equityY };
}

export function whiteShare(p: ChessPosition): number {
  const s = p.evaluationView?.whiteShare;
  if (s == null || Number.isNaN(s)) return 0.5;
  return s;
}

export function whiteValue(p: ChessPosition): number {
  return p.evaluationView?.whiteValue ?? 0;
}
