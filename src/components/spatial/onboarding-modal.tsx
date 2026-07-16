"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

function GestureGlyph({ type }: { type: "pinch" | "fist" | "open" }) {
  if (type === "pinch") {
    return (
      <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M9 19c2.6-1.8 5-2.2 7.2-1.2 1.5.7 2.8 2 4 3.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M19.6 8.2c2.9 2 3.8 5.9 2 8.8-1.7 2.7-5.2 3.8-8 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M9.8 20.2c-2.2 2.2-2.2 5.7 0 7.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "fist") {
    return (
      <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M9 15.5V9.8a2.2 2.2 0 0 1 4.4 0v5.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M13.4 14.8V8.4a2.2 2.2 0 1 1 4.4 0v6.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M17.8 14.8v-5a2.2 2.2 0 0 1 4.4 0v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M22.2 16.8v-3.2a2 2 0 0 1 4 0V19c0 5-3.3 8.2-8.4 8.2h-2.3c-4.4 0-7.7-3-7.7-7.4v-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M8.8 17.2V9.8a2.1 2.1 0 0 1 4.2 0v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M13 16.6V7.2a2.1 2.1 0 0 1 4.2 0v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M17.2 16.5V9.1a2.1 2.1 0 0 1 4.2 0v8.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M21.4 17.8v-5a2.1 2.1 0 0 1 4.2 0v6.4c0 4.7-3.2 7.8-8 7.8h-2.2c-4.1 0-7.3-3.1-7.3-7.2v-2.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function OnboardingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--color-text-primary)]/28 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-lg space-y-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-studio-surface)] p-6 text-left shadow-[var(--shadow-token-lg)] sm:p-8"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-[var(--color-secondary)]/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#6B7D5F]">
                {t("spatial.onboarding.badge")}
              </span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                className="text-xs text-[var(--color-text-muted)] underline hover:text-[var(--color-text-primary)]"
              >
                {t("spatial.onboarding.close")}
              </motion.button>
            </div>

            <div className="space-y-2">
              <h2 id="onboarding-title" className="font-heading text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                {t("spatial.onboarding.title")}
              </h2>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{t("spatial.onboarding.description")}</p>
            </div>

            <div className="space-y-3.5 pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">{t("spatial.onboarding.how")}</h3>
              <div className="space-y-2">
                {[
                  ["pinch", "spatial.onboarding.draw.title", "spatial.onboarding.draw.desc"],
                  ["fist", "spatial.onboarding.grab.title", "spatial.onboarding.grab.desc"],
                  ["open", "spatial.onboarding.release.title", "spatial.onboarding.release.desc"],
                ].map(([type, titleKey, descKey]) => (
                  <div key={type} className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent)] text-[var(--color-primary)]">
                      <GestureGlyph type={type as "pinch" | "fist" | "open"} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-[var(--color-text-primary)]">{t(titleKey)}</span>
                      <span className="block text-xs text-[var(--color-text-muted)]">{t(descKey)}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4">
              <p className="text-xs text-[var(--color-text-muted)]">{t("spatial.onboarding.noAccount")}</p>
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                className="flex min-h-12 items-center gap-1.5 rounded-2xl bg-[var(--color-text-primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--color-text-secondary)]"
              >
                <span>{t("spatial.onboarding.enter")}</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
