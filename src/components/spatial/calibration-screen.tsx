"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LocaleControl } from "./locale-control";
import { useSpatialGesture } from "@/hooks/use-spatial-gesture";
import { getCalibrationProfile } from "@/lib/spatial/calibration";

export function CalibrationScreen() {
  const { t } = useTranslation();
  const gesture = useSpatialGesture();
  const profile = getCalibrationProfile(gesture.frame);

  return (
    <main className="min-h-svh bg-[var(--color-accent)] px-4 py-6 text-[var(--color-text-primary)] md:px-8">
      <div className="mx-auto w-full max-w-xl space-y-8 pt-4">
        <header className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
          <Link href="/" className="flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>{t("spatial.calibrationScreen.back")}</span>
          </Link>
          <h1 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">{t("spatial.calibrationScreen.title")}</h1>
          <LocaleControl compact />
        </header>

        <section className="space-y-4">
          <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-studio-frame)]">
            <video ref={gesture.videoRef} playsInline muted autoPlay className="camera-mirror absolute inset-0 h-full w-full object-cover opacity-70" />
            <canvas ref={gesture.canvasRef} className="absolute inset-0 h-full w-full" aria-label={t("spatial.calibrationScreen.canvasLabel")} />
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute inset-x-0 top-1/2 h-0.5 border-dashed bg-[var(--color-primary)]/30" />
            <div className="absolute inset-y-0 left-1/2 w-0.5 border-dashed bg-[var(--color-primary)]/30" />
            <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 1.8, repeat: Infinity }} className="absolute h-24 w-24 rounded-full border-2 border-[var(--color-secondary)] opacity-60" />
            <div className="absolute h-40 w-40 rounded-full border border-[var(--color-primary)] opacity-40" />

            {gesture.cameraState !== "ready" ? (
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => void gesture.startCamera()}
                className="relative z-10 flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white/85 px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] backdrop-blur-md"
              >
                <Camera className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
                <span>{gesture.cameraState === "loading" ? t("spatial.camera.loadingAction") : t("spatial.camera.start")}</span>
              </motion.button>
            ) : (
              <div className="relative z-10 max-w-xs rounded-xl border border-[var(--color-border)] bg-white/85 px-4 py-2.5 text-center backdrop-blur-md">
                <p className="text-xs font-semibold text-[var(--color-text-primary)]">{t("spatial.calibrationScreen.guide")}</p>
                <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">{t(profile.guidanceKey)}</p>
              </div>
            )}
          </div>

          <div className="space-y-3.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{t("spatial.calibrationScreen.properties")}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-studio-panel)] p-3.5">
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">{t("spatial.calibrationScreen.gain")}</p>
                <p className="mt-1 text-lg font-semibold">{profile.distance === "ideal" ? "1.2x" : "1.4x"}</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-studio-panel)] p-3.5">
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">{t("spatial.calibrationScreen.light")}</p>
                <p className="mt-1 text-lg font-semibold text-[var(--color-secondary)]">{t(`spatial.calibrationScreen.lightValue.${profile.lighting}`)}</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-studio-panel)] p-3.5">
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">{t("spatial.calibrationScreen.distance")}</p>
                <p className="mt-1 text-lg font-semibold">{t(`spatial.calibrationScreen.distanceValue.${profile.distance}`)}</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-studio-panel)] p-3.5">
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">{t("spatial.calibrationScreen.confidence")}</p>
                <p className="mt-1 text-lg font-semibold text-[var(--color-primary)]">{profile.confidence}%</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-xl items-center justify-center border-t border-[var(--color-border)] pt-8">
        <Link href="/" className="min-h-12 rounded-2xl bg-[var(--color-text-primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--color-text-secondary)]">
          {t("spatial.calibrationScreen.confirm")}
        </Link>
      </div>
    </main>
  );
}
