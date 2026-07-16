import type { Point, SpatialStroke } from "./types";

export function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function smoothPoint(previous: Point | null, next: Point, smoothing: number): Point {
  if (!previous) return next;
  const alpha = Math.min(Math.max(smoothing, 0.05), 0.95);
  return {
    x: previous.x + (next.x - previous.x) * alpha,
    y: previous.y + (next.y - previous.y) * alpha,
  };
}

export function pointNearStroke(point: Point, stroke: SpatialStroke, radius: number) {
  if (stroke.points.length === 0) return false;
  let closest = Number.POSITIVE_INFINITY;
  for (const strokePoint of stroke.points) {
    const d = distance(point, {
      x: strokePoint.x + stroke.offset.x,
      y: strokePoint.y + stroke.offset.y,
    });
    if (d < closest) closest = d;
    if (closest <= radius) return true;
  }
  return false;
}

export function strokeBounds(stroke: SpatialStroke) {
  if (stroke.points.length === 0) {
    return { x: stroke.offset.x, y: stroke.offset.y, width: 0, height: 0 };
  }
  const xs = stroke.points.map((point) => point.x + stroke.offset.x);
  const ys = stroke.points.map((point) => point.y + stroke.offset.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
