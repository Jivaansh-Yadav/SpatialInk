import type { HandFrame, SpatialStroke } from "./types";

function drawStrokePath(ctx: CanvasRenderingContext2D, stroke: SpatialStroke, isActive = false) {
  if (stroke.points.length < 2) return;
  ctx.save();
  ctx.translate(stroke.offset.x, stroke.offset.y);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.shadowColor = stroke.color;
  ctx.shadowBlur = isActive ? 18 : 9;
  ctx.globalAlpha = isActive ? 0.98 : 0.9;
  ctx.beginPath();
  ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
  for (let i = 1; i < stroke.points.length - 1; i += 1) {
    const current = stroke.points[i];
    const next = stroke.points[i + 1];
    ctx.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
  }
  const last = stroke.points[stroke.points.length - 1];
  ctx.lineTo(last.x, last.y);
  ctx.stroke();
  ctx.restore();
}

function drawLandmarks(ctx: CanvasRenderingContext2D, frame: HandFrame) {
  if (frame.landmarks.length === 0) return;
  ctx.save();
  ctx.fillStyle = "rgba(245, 241, 232, 0.88)";
  ctx.strokeStyle = "rgba(201, 106, 75, 0.7)";
  ctx.lineWidth = 1.5;
  for (const point of frame.landmarks) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawCursor(ctx: CanvasRenderingContext2D, frame: HandFrame) {
  if (!frame.cursor) return;
  const color = frame.status === "moving" ? "#9CB48A" : frame.status === "pinched" ? "#C96A4B" : "#D4A373";
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = "rgba(245, 241, 232, 0.78)";
  ctx.lineWidth = 2;
  ctx.shadowColor = color;
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(frame.cursor.x, frame.cursor.y, frame.status === "hand-detected" ? 13 : 19, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function renderSpatialCanvas({
  canvas,
  strokes,
  activeStroke,
  activeFrame,
  grabbedId,
  showLandmarks,
}: {
  canvas: HTMLCanvasElement;
  strokes: SpatialStroke[];
  activeStroke: SpatialStroke | null;
  activeFrame: HandFrame | null;
  grabbedId: string | null;
  showLandmarks: boolean;
}) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const stroke of strokes) {
    drawStrokePath(ctx, stroke, stroke.id === grabbedId);
  }

  if (activeStroke) {
    drawStrokePath(ctx, activeStroke, true);
  }

  if (activeFrame && showLandmarks) {
    drawLandmarks(ctx, activeFrame);
  }

  if (activeFrame) {
    drawCursor(ctx, activeFrame);
  }
}
