"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HandLandmarker, NormalizedLandmark } from "@mediapipe/tasks-vision";
import { distance, midpoint, pointNearStroke, smoothPoint } from "@/lib/spatial/geometry";
import { renderSpatialCanvas } from "@/lib/spatial/drawing";
import type { GestureSettings, GestureStatus, HandFrame, Point, SpatialStroke, StrokePoint } from "@/lib/spatial/types";
import { colorPalette, defaultGestureSettings, loadGestureSettings, saveGestureSettings } from "@/lib/spatial/settings";

const HAND_CONNECTIONS = {
  thumbTip: 4,
  indexTip: 8,
  palm: 0,
  indexMcp: 5,
  middleMcp: 9,
  ringMcp: 13,
  pinkyMcp: 17,
  fingertips: [8, 12, 16, 20],
  lowerKnuckles: [5, 9, 13, 17],
} as const;

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toCanvasPoint(landmark: NormalizedLandmark, canvas: HTMLCanvasElement): Point {
  return {
    x: (1 - landmark.x) * canvas.width,
    y: landmark.y * canvas.height,
  };
}

function averagePoint(points: Point[]): Point {
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function getFistScore(points: Point[]) {
  const palm = points[HAND_CONNECTIONS.palm];
  if (!palm) return 0;
  const fingertipDistances = HAND_CONNECTIONS.fingertips.map((index) => distance(points[index], palm));
  const knuckleDistances = HAND_CONNECTIONS.lowerKnuckles.map((index) => distance(points[index], palm));
  const curled = fingertipDistances.filter((tipDistance, index) => tipDistance < knuckleDistances[index] * 1.32).length;
  return curled / HAND_CONNECTIONS.fingertips.length;
}

function landmarksToFrame({
  landmarks,
  canvas,
  previousCursor,
  settings,
}: {
  landmarks: NormalizedLandmark[];
  canvas: HTMLCanvasElement;
  previousCursor: Point | null;
  settings: GestureSettings;
}): HandFrame {
  const points = landmarks.map((landmark) => toCanvasPoint(landmark, canvas));
  const thumb = points[HAND_CONNECTIONS.thumbTip];
  const index = points[HAND_CONNECTIONS.indexTip];
  const palm = averagePoint([
    points[HAND_CONNECTIONS.palm],
    points[HAND_CONNECTIONS.indexMcp],
    points[HAND_CONNECTIONS.middleMcp],
    points[HAND_CONNECTIONS.ringMcp],
    points[HAND_CONNECTIONS.pinkyMcp],
  ]);
  const rawCursor = midpoint(thumb, index);
  const cursor = smoothPoint(previousCursor, rawCursor, settings.smoothing);
  const pinchDistance = distance(thumb, index) / Math.max(canvas.width, canvas.height);
  const fistScore = getFistScore(points);
  const status: GestureStatus = fistScore >= settings.fistThreshold ? "moving" : pinchDistance <= settings.pinchThreshold ? "pinched" : "hand-detected";
  const confidence = Math.max(0.2, Math.min(0.98, 1 - pinchDistance + fistScore * 0.2));

  return {
    status,
    cursor,
    palm,
    landmarks: points,
    pinchDistance,
    fistScore,
    confidence,
  };
}

export function useSpatialGesture() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const animationRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const previousCursorRef = useRef<Point | null>(null);
  const strokesRef = useRef<SpatialStroke[]>([]);
  const activeStrokeRef = useRef<SpatialStroke | null>(null);
  const grabbedRef = useRef<{ id: string; anchor: Point; startOffset: Point } | null>(null);
  const settingsRef = useRef<GestureSettings>(defaultGestureSettings);
  const colorIndexRef = useRef(0);
  const lastStatusRef = useRef<GestureStatus>("no-hand");

  const [settings, setSettingsState] = useState<GestureSettings>(defaultGestureSettings);
  const [strokes, setStrokes] = useState<SpatialStroke[]>([]);
  const [frame, setFrame] = useState<HandFrame | null>(null);
  const [status, setStatus] = useState<GestureStatus>("no-hand");
  const [activeColor, setActiveColor] = useState(colorPalette[0]);
  const [cameraState, setCameraState] = useState<"idle" | "loading" | "ready" | "denied" | "unsupported" | "error">("idle");
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const updateSettings = useCallback((next: Partial<GestureSettings>) => {
    setSettingsState((current) => {
      const updated = { ...current, ...next };
      settingsRef.current = updated;
      saveGestureSettings(updated);
      return updated;
    });
  }, []);

  const reportStatus = useCallback((next: GestureStatus) => {
    if (lastStatusRef.current === next) return;
    lastStatusRef.current = next;
    setStatus(next);
  }, []);

  const setStrokeState = useCallback((next: SpatialStroke[]) => {
    strokesRef.current = next;
    setStrokes(next);
  }, []);

  const resizeCanvas = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const rect = video.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    }
  }, []);

  const commitActiveStroke = useCallback(() => {
    const active = activeStrokeRef.current;
    if (!active || active.points.length < 3) {
      activeStrokeRef.current = null;
      return;
    }
    const next = [...strokesRef.current, active];
    setStrokeState(next);
    activeStrokeRef.current = null;
  }, [setStrokeState]);

  const handlePinch = useCallback((cursor: Point, frameData: HandFrame) => {
    const point: StrokePoint = { ...cursor, pressure: Math.max(0.35, Math.min(1, 1 - frameData.pinchDistance * 4.2)) };
    if (!activeStrokeRef.current) {
      activeStrokeRef.current = {
        id: createId("stroke"),
        points: [point],
        color: colorPalette[colorIndexRef.current],
        width: settingsRef.current.strokeWidth,
        offset: { x: 0, y: 0 },
        createdAt: Date.now(),
      };
      return;
    }

    const points = activeStrokeRef.current.points;
    const last = points[points.length - 1];
    if (!last) return;

    const gap = distance(last, point);
    if (gap <= 1.8) return;

    const interpolated: StrokePoint[] = [];
    const steps = Math.min(8, Math.floor(gap / 12));
    for (let step = 1; step <= steps; step += 1) {
      const ratio = step / (steps + 1);
      interpolated.push({
        x: last.x + (point.x - last.x) * ratio,
        y: last.y + (point.y - last.y) * ratio,
        pressure: point.pressure,
      });
    }

    activeStrokeRef.current = {
      ...activeStrokeRef.current,
      points: [...points, ...interpolated, point],
    };
  }, []);

  const handleFist = useCallback((cursor: Point, palm: Point | null) => {
    const grabPoint = palm ?? cursor;
    const grabbed = grabbedRef.current;
    if (grabbed) {
      const next = strokesRef.current.map((stroke) =>
        stroke.id === grabbed.id
          ? { ...stroke, offset: { x: grabbed.startOffset.x + grabPoint.x - grabbed.anchor.x, y: grabbed.startOffset.y + grabPoint.y - grabbed.anchor.y } }
          : stroke,
      );
      setStrokeState(next);
      return;
    }

    const radius = settingsRef.current.grabRadius;
    const target = [...strokesRef.current]
      .reverse()
      .find((stroke) => pointNearStroke(grabPoint, stroke, radius) || pointNearStroke(cursor, stroke, radius * 0.85));
    if (!target) return;
    grabbedRef.current = {
      id: target.id,
      anchor: grabPoint,
      startOffset: target.offset,
    };
  }, [setStrokeState]);

  const releaseGrab = useCallback(() => {
    if (!grabbedRef.current) return;
    grabbedRef.current = null;
  }, []);

  const detectLoop = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = landmarkerRef.current;
    if (!video || !canvas || !landmarker) return;

    resizeCanvas();

    if (video.readyState >= 2) {
      const result = landmarker.detectForVideo(video, performance.now());
      const landmarks = result.landmarks?.[0];
      if (!landmarks) {
        commitActiveStroke();
        releaseGrab();
        previousCursorRef.current = null;
        const noHandFrame: HandFrame = {
          status: "no-hand",
          cursor: null,
          palm: null,
          landmarks: [],
          pinchDistance: 1,
          fistScore: 0,
          confidence: 0,
        };
        setFrame(noHandFrame);
        reportStatus("no-hand");
        renderSpatialCanvas({
          canvas,
          strokes: strokesRef.current,
          activeStroke: activeStrokeRef.current,
          activeFrame: noHandFrame,
          grabbedId: grabbedRef.current?.id ?? null,
          showLandmarks: settingsRef.current.showLandmarks,
        });
      } else {
        const nextFrame = landmarksToFrame({
          landmarks,
          canvas,
          previousCursor: previousCursorRef.current,
          settings: settingsRef.current,
        });
        previousCursorRef.current = nextFrame.cursor;
        setFrame(nextFrame);

        if (nextFrame.status === "pinched" && nextFrame.cursor) {
          releaseGrab();
          handlePinch(nextFrame.cursor, nextFrame);
          reportStatus("pinched");
        } else if (nextFrame.status === "moving" && nextFrame.cursor) {
          commitActiveStroke();
          handleFist(nextFrame.cursor, nextFrame.palm);
          reportStatus(grabbedRef.current ? "moving" : "hand-detected");
        } else {
          commitActiveStroke();
          releaseGrab();
          reportStatus("hand-detected");
        }

        renderSpatialCanvas({
          canvas,
          strokes: strokesRef.current,
          activeStroke: activeStrokeRef.current,
          activeFrame: nextFrame,
          grabbedId: grabbedRef.current?.id ?? null,
          showLandmarks: settingsRef.current.showLandmarks,
        });
      }
    }

    animationRef.current = window.requestAnimationFrame(() => {
      void detectLoop();
    });
  }, [commitActiveStroke, handleFist, handlePinch, releaseGrab, reportStatus, resizeCanvas]);

  const startCamera = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState("unsupported");
      return;
    }

    setCameraState("loading");
    try {
      const [{ FilesetResolver, HandLandmarker }, stream] = await Promise.all([
        import("@mediapipe/tasks-vision"),
        navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30, max: 60 },
          },
          audio: false,
        }),
      ]);

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const fileset = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm");
      landmarkerRef.current = await HandLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
        minHandDetectionConfidence: 0.52,
        minHandPresenceConfidence: 0.52,
        minTrackingConfidence: 0.5,
      });

      resizeCanvas();
      setCameraState("ready");
      animationRef.current = window.requestAnimationFrame(() => {
        void detectLoop();
      });
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      setCameraState(name === "NotAllowedError" || name === "PermissionDeniedError" ? "denied" : "error");
    }
  }, [detectLoop, resizeCanvas]);

  const stopCamera = useCallback(() => {
    if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    landmarkerRef.current?.close();
    landmarkerRef.current = null;
    setCameraState("idle");
    setFrame(null);
    reportStatus("no-hand");
  }, [reportStatus]);

  const undoStroke = useCallback(() => {
    const removed = strokesRef.current.at(-1);
    if (!removed) return;
    const next = strokesRef.current.slice(0, -1);
    setStrokeState(next);
  }, [setStrokeState]);

  const clearStrokes = useCallback(() => {
    if (strokesRef.current.length === 0) return;
    setStrokeState([]);
    activeStrokeRef.current = null;
  }, [setStrokeState]);

  const cycleColor = useCallback(() => {
    colorIndexRef.current = (colorIndexRef.current + 1) % colorPalette.length;
    const next = colorPalette[colorIndexRef.current];
    setActiveColor(next);
  }, []);

  const selectColor = useCallback((color: string) => {
    const index = colorPalette.indexOf(color);
    colorIndexRef.current = index >= 0 ? index : 0;
    setActiveColor(color);
  }, []);

  useEffect(() => {
    const loaded = loadGestureSettings();
    settingsRef.current = loaded;
    setSettingsState(loaded);
    const hasSeenOnboarding = window.localStorage.getItem("spatial-gesture-onboarding-seen") === "true";
    setIsOnboardingOpen(!hasSeenOnboarding);
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      stopCamera();
    };
  }, [resizeCanvas, stopCamera]);

  const completeOnboarding = useCallback(() => {
    window.localStorage.setItem("spatial-gesture-onboarding-seen", "true");
    setIsOnboardingOpen(false);
  }, []);

  return {
    videoRef,
    canvasRef,
    status,
    frame,
    strokes,
    settings,
    activeColor,
    cameraState,
    isOnboardingOpen,
    setIsOnboardingOpen,
    startCamera,
    stopCamera,
    undoStroke,
    clearStrokes,
    cycleColor,
    selectColor,
    updateSettings,
    completeOnboarding,
  };
}
