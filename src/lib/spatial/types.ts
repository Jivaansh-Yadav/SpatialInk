export type GestureStatus = "no-hand" | "hand-detected" | "pinched" | "moving";

export type Point = {
  x: number;
  y: number;
};

export type StrokePoint = Point & {
  pressure: number;
};

export type SpatialStroke = {
  id: string;
  points: StrokePoint[];
  color: string;
  width: number;
  offset: Point;
  createdAt: number;
};

export type GestureSettings = {
  pinchThreshold: number;
  fistThreshold: number;
  smoothing: number;
  grabRadius: number;
  strokeWidth: number;
  showLandmarks: boolean;
  showHints: boolean;
};

export type CalibrationProfile = {
  lighting: "low" | "balanced" | "bright";
  distance: "close" | "ideal" | "far";
  confidence: number;
  guidanceKey: string;
};

export type HandFrame = {
  status: GestureStatus;
  cursor: Point | null;
  palm: Point | null;
  landmarks: Point[];
  pinchDistance: number;
  fistScore: number;
  confidence: number;
};
