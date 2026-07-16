import type { CalibrationProfile, HandFrame } from "./types";

export function getCalibrationProfile(frame: HandFrame | null): CalibrationProfile {
  if (!frame || frame.status === "no-hand") {
    return {
      lighting: "balanced",
      distance: "far",
      confidence: 0,
      guidanceKey: "spatial.calibration.guidance.noHand",
    };
  }

  const width = frame.landmarks.length
    ? Math.max(...frame.landmarks.map((point) => point.x)) - Math.min(...frame.landmarks.map((point) => point.x))
    : 0;

  const distance = width < 130 ? "far" : width > 330 ? "close" : "ideal";
  const confidence = Math.round(Math.max(0.18, Math.min(0.98, frame.confidence)) * 100);

  return {
    lighting: confidence > 74 ? "balanced" : confidence > 46 ? "low" : "bright",
    distance,
    confidence,
    guidanceKey:
      distance === "ideal"
        ? "spatial.calibration.guidance.ready"
        : distance === "close"
          ? "spatial.calibration.guidance.close"
          : "spatial.calibration.guidance.far",
  };
}
