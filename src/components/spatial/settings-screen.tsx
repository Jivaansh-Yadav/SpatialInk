"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LocaleControl } from "./locale-control";
import { useGestureSettings } from "@/hooks/use-gesture-settings";

function StudioSlider({
  value,
  min,
  max,
  step,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  label: string;
}) {
  return (
    <input
      aria-label={label}
      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[var(--color-studio-line)] accent-[var(--color-primary)]"
      max={max}
      min={min}
      step={step}
      type="range"
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}

export function SettingsScreen() {
  const { t } = useTranslation();
  const { settings, soundEnabled, updateSettings, toggleSound } = useGestureSettings();
  const smoothingDisplay = Math.round(settings.smoothing * 100);
  const pinchPixels = Math.round(settings.pinchThreshold * 560);

  return (
    <main className="min-h-svh bg-[var(--color-accent)] px-4 py-6 text-[var(--color-text-primary)] md:px-8">
      <div className="mx-auto w-full max-w-xl space-y-8 pt-4">
        <header className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
          <Link href="/" className="flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>{t("spatial.settings.back")}</span>
          </Link>
          <h1 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">{t("spatial.settings.title")}</h1>
          <LocaleControl compact />
        </header>

        <div className="space-y-6">
          <section className="space-y-1.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{t("spatial.settings.smoothingGroup")}</h2>
            <p className="mb-3 text-xs text-[var(--color-text-muted)]">{t("spatial.settings.smoothingDesc")}</p>
            <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-studio-panel)] p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium">{t("spatial.settings.smoothingLabel")}</span>
                <span className="text-xs font-semibold text-[var(--color-primary)]">{t("spatial.settings.smoothingValue", { value: smoothingDisplay })}</span>
              </div>
              <StudioSlider value={smoothingDisplay} min={10} max={95} step={1} label={t("spatial.settings.smoothingLabel")} onChange={(value) => updateSettings({ smoothing: value / 100 })} />
            </div>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{t("spatial.settings.soundGroup")}</h2>
            <div className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-studio-panel)] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{t("spatial.settings.soundLabel")}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{t("spatial.settings.soundDesc")}</p>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleSound}
                  aria-pressed={soundEnabled}
                  className={soundEnabled ? "relative inline-flex h-7 w-12 items-center rounded-full bg-[var(--color-secondary)]" : "relative inline-flex h-7 w-12 items-center rounded-full bg-[var(--color-studio-line)]"}
                >
                  <motion.span
                    layout
                    className="inline-block h-5 w-5 rounded-full bg-white shadow-[var(--shadow-token-sm)]"
                    animate={{ x: soundEnabled ? 24 : 4 }}
                  />
                </motion.button>
              </div>
            </div>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{t("spatial.settings.deadzoneGroup")}</h2>
            <p className="mb-3 text-xs text-[var(--color-text-muted)]">{t("spatial.settings.deadzoneDesc")}</p>
            <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-studio-panel)] p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium">{t("spatial.settings.pinchLabel")}</span>
                <span className="text-xs font-semibold text-[var(--color-primary)]">{t("spatial.settings.pinchValue", { value: pinchPixels })}</span>
              </div>
              <StudioSlider value={pinchPixels} min={24} max={80} step={1} label={t("spatial.settings.pinchLabel")} onChange={(value) => updateSettings({ pinchThreshold: value / 560 })} />
            </div>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{t("spatial.settings.grabGroup")}</h2>
            <p className="mb-3 text-xs text-[var(--color-text-muted)]">{t("spatial.settings.grabDesc")}</p>
            <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-studio-panel)] p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium">{t("spatial.settings.grabLabel")}</span>
                <span className="text-xs font-semibold text-[var(--color-primary)]">{t("spatial.settings.grabValue", { value: settings.grabRadius })}</span>
              </div>
              <StudioSlider value={settings.grabRadius} min={40} max={120} step={2} label={t("spatial.settings.grabLabel")} onChange={(value) => updateSettings({ grabRadius: value })} />
            </div>
          </section>
        </div>
      </div>
      <footer className="mx-auto mt-8 w-full max-w-xl border-t border-[var(--color-border)] pt-8 text-center text-xs text-[var(--color-text-muted)]">
        <p>{t("spatial.settings.footer")}</p>
      </footer>
    </main>
  );
}
