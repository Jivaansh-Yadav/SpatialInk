"use client";

import { useCallback, useEffect, useState } from "react";
import type { GestureSettings } from "@/lib/spatial/types";
import { defaultGestureSettings, loadGestureSettings, saveGestureSettings } from "@/lib/spatial/settings";

export function useGestureSettings() {
  const [settings, setSettings] = useState<GestureSettings>(defaultGestureSettings);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setSettings(loadGestureSettings());
    setSoundEnabled(window.localStorage.getItem("spatial-sound-enabled") !== "false");
  }, []);

  const updateSettings = useCallback((next: Partial<GestureSettings>) => {
    setSettings((current) => {
      const updated = { ...current, ...next };
      saveGestureSettings(updated);
      return updated;
    });
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((current) => {
      const next = !current;
      window.localStorage.setItem("spatial-sound-enabled", String(next));
      return next;
    });
  }, []);

  return { settings, soundEnabled, updateSettings, toggleSound };
}
