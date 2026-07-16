import type { GestureSettings } from "./types";

export const colorPalette = ["#C96A4B", "#D4A373", "#9CB48A", "#E78F72", "#B88768"];

export const defaultGestureSettings: GestureSettings = {
  pinchThreshold: 0.105,
  fistThreshold: 0.54,
  smoothing: 0.68,
  grabRadius: 118,
  strokeWidth: 8,
  showLandmarks: true,
  showHints: true,
};

export const storageKeys = {
  settings: "spatial-gesture-settings",
  onboarding: "spatial-gesture-onboarding-seen",
} as const;

export function loadGestureSettings(): GestureSettings {
  if (typeof window === "undefined") return defaultGestureSettings;
  try {
    const raw = window.localStorage.getItem(storageKeys.settings);
    if (!raw) return defaultGestureSettings;
    return { ...defaultGestureSettings, ...JSON.parse(raw) };
  } catch {
    return defaultGestureSettings;
  }
}

export function saveGestureSettings(settings: GestureSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKeys.settings, JSON.stringify(settings));
}
