"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, HelpCircle, RotateCcw, Settings, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LocaleControl } from "./locale-control";
import { statusSubtitleKey, statusTitleKey } from "./status-copy";
import { useSpatialGesture } from "@/hooks/use-spatial-gesture";
import { colorPalette } from "@/lib/spatial/settings";
import { OnboardingModal } from "./onboarding-modal";

export function SpatialWorkspaceScreen() {
  const { t } = useTranslation();
  const gesture = useSpatialGesture();
  const hasCamera = gesture.cameraState === "ready";
  const statusText = t(statusTitleKey(gesture.status));
  const statusDetail = t(statusSubtitleKey(gesture.status));
  const confidence = Math.round((gesture.frame?.confidence ?? 0) * 100);

  const statusChip = (
    <div className="flex h-10 max-w-[48vw] items-center gap-2 rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-3 text-[var(--color-primary)] shadow-[var(--shadow-token-sm)] md:h-auto md:max-w-none md:px-4 md:py-2">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)] opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-primary)]" />
      </span>
      <span className="min-w-0 text-left">
        <span className="block truncate text-[10px] font-bold uppercase leading-none tracking-wider md:text-xs">{statusText}</span>
        <span className="mt-0.5 hidden truncate text-[10px] opacity-85 sm:block">{statusDetail}</span>
      </span>
      <span className="ml-1 shrink-0 rounded-full bg-[var(--color-studio-surface)]/85 px-2 py-0.5 text-[10px] font-bold leading-none text-[var(--color-text-secondary)]">
        {confidence}%
      </span>
    </div>
  );

  const colorPicker = (
    <div className="flex items-center gap-1.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-studio-raised)] p-1.5 shadow-[var(--shadow-token-sm)] md:flex-col md:gap-2 md:p-2">
      {colorPalette.map((color) => (
        <motion.button
          key={color}
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => gesture.selectColor(color)}
          className="h-7 w-7 shrink-0 rounded-full border-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] md:h-9 md:w-9"
          style={{ backgroundColor: color, borderColor: gesture.activeColor === color ? "#2E2B27" : "#fffaf1" }}
          aria-label={t("spatial.workspace.pickColor")}
        />
      ))}
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={gesture.cycleColor}
        className="hidden min-h-10 rounded-xl bg-[var(--color-studio-surface)] px-3 text-xs font-semibold text-[var(--color-text-secondary)] md:block md:px-2"
      >
        {t("spatial.workspace.cycle")}
      </motion.button>
    </div>
  );

  const actionTools = (
    <div className="flex shrink-0 items-center gap-1.5 md:flex-col md:gap-2">
      <motion.button type="button" whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }} onClick={gesture.undoStroke} className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-studio-surface)] px-3 py-2 text-xs font-medium text-[var(--color-text-primary)] hover:bg-white md:min-h-11 md:w-full md:gap-2 md:px-3 md:py-2.5 md:text-sm">
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        <span>{t("spatial.workspace.undo")}</span>
      </motion.button>
      <motion.button type="button" whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }} onClick={gesture.clearStrokes} className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-3 py-2 text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 md:min-h-11 md:w-full md:gap-2 md:px-3 md:py-2.5 md:text-sm">
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        <span>{t("spatial.workspace.clear")}</span>
      </motion.button>
    </div>
  );

  return (
    <div className="min-h-svh bg-[var(--color-accent)] text-[var(--color-text-primary)]">
      <main className="relative flex min-h-svh flex-col overflow-hidden p-3 md:p-5 lg:p-6">
        <div className="z-10 flex w-full shrink-0 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate font-heading text-lg font-semibold tracking-tight md:text-xl">{t("spatial.workspace.title")}</h1>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
            {statusChip}
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => gesture.setIsOnboardingOpen(true)}
              className="flex min-h-10 items-center gap-1.5 rounded-full bg-[var(--color-studio-raised)] px-3 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-studio-soft)] md:px-3.5 md:text-sm"
            >
              <HelpCircle className="h-4 w-4" aria-hidden="true" />
              <span>{t("spatial.workspace.guideLabel")}</span>
            </motion.button>
            <LocaleControl compact />
            <Link href="/settings" className="flex min-h-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-studio-surface)] px-3 text-[var(--color-text-primary)] hover:bg-white" aria-label={t("spatial.workspace.settings")}>
              <Settings className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-3 pt-3 md:grid-cols-[minmax(0,1fr)_104px] md:items-center md:gap-4 lg:grid-cols-[minmax(0,1fr)_128px]">
          <section className="relative mx-auto flex h-[calc(100svh-190px)] min-h-[340px] w-full max-w-6xl items-center justify-center overflow-hidden rounded-[22px] border-[3px] border-[var(--color-studio-panel)] bg-[var(--color-studio-frame)] shadow-[var(--shadow-token-md)] sm:h-[calc(100svh-210px)] md:h-[min(76svh,740px)] md:min-h-[520px] md:rounded-[32px] md:border-4 lg:h-[min(80svh,780px)]">
            <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(var(--color-primary)_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
            <video ref={gesture.videoRef} playsInline muted autoPlay className="camera-mirror absolute inset-0 h-full w-full object-cover opacity-92" />
            <canvas ref={gesture.canvasRef} className="absolute inset-0 h-full w-full" aria-label={t("spatial.workspace.canvasLabel")} />

            <AnimatePresence>
              {!hasCamera ? (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="glass-clay relative z-10 mx-4 max-w-md rounded-3xl p-5 text-center md:p-6"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    <Camera className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h2 className="font-heading text-2xl font-medium">{t(`spatial.camera.${gesture.cameraState}.title`)}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{t(`spatial.camera.${gesture.cameraState}.desc`)}</p>
                  <motion.button
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => void gesture.startCamera()}
                    className="mt-5 min-h-11 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-[#fffaf1] shadow-[var(--shadow-token-sm)]"
                  >
                    {gesture.cameraState === "loading" ? t("spatial.camera.loadingAction") : t("spatial.camera.start")}
                  </motion.button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="pointer-events-none absolute bottom-3 right-3 md:bottom-6 md:right-6">
              <div className="shrink-0 rounded-full border border-[var(--color-border)] bg-[var(--color-studio-surface)]/82 px-3 py-2 text-[11px] font-semibold text-[var(--color-text-secondary)] shadow-[var(--shadow-token-sm)] backdrop-blur-xl md:px-4 md:text-xs">
                {t("spatial.workspace.shapeCount", { count: gesture.strokes.length })}
              </div>
            </div>
          </section>

          <aside className="hidden h-[min(76svh,740px)] min-h-[520px] flex-col justify-center gap-6 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-studio-panel)] p-3 shadow-[var(--shadow-token-sm)] md:flex lg:h-[min(80svh,780px)] lg:p-4">
            <div>{colorPicker}</div>
            {actionTools}
          </aside>
        </div>

        <div className="z-10 flex shrink-0 items-center justify-between gap-2 pt-3 pb-[env(safe-area-inset-bottom)] md:hidden">
          {colorPicker}
          {actionTools}
        </div>
      </main>

      <OnboardingModal open={gesture.isOnboardingOpen} onClose={gesture.completeOnboarding} />
    </div>
  );
}
