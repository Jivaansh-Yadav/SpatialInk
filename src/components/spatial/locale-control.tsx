"use client";

import { useEffect, useMemo, useState } from "react";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { changeLocale, getLocalePreference, type LocalePreference } from "@/i18n";

const preferences: LocalePreference[] = ["en-US", "zh-CN"];

export function LocaleControl({ compact = false }: { compact?: boolean }) {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [preference, setPreference] = useState<LocalePreference>("en-US");

  useEffect(() => {
    setMounted(true);
    const stored = getLocalePreference();
    const next = stored === "zh-CN" ? "zh-CN" : "en-US";
    setPreference(next);
    if (stored === "system") void changeLocale("en-US");
  }, []);

  const labels = useMemo<Record<LocalePreference, string>>(
    () => ({
      system: t("language.followSystem"),
      "en-US": t("language.enUS"),
      "zh-CN": t("language.zhCN"),
    }),
    [t],
  );

  if (!mounted) {
    return <div className="h-10 w-24 rounded-full border border-[var(--color-border)] bg-[#fffaf1]/70" />;
  }

  async function selectLocale(next: LocalePreference) {
    setPreference(next);
    await changeLocale(next);
  }

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[#fffaf1]/82 p-1 text-[var(--color-text-secondary)] shadow-[var(--shadow-token-sm)] backdrop-blur-xl"
      aria-label={t("language.label")}
    >
      {!compact ? <Globe className="ml-2 h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" /> : null}
      {preferences.map((item) => {
        const isActive = preference === item;
        const shortLabel = item === "en-US" ? "EN" : "中";
        return (
          <motion.button
            key={item}
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => void selectLocale(item)}
            className="relative min-h-8 rounded-full px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] md:min-h-9"
            aria-pressed={isActive}
            aria-label={t("language.triggerLabel", { language: labels[item] })}
          >
            {isActive ? (
              <motion.span
                layoutId="locale-pill"
                className="absolute inset-0 rounded-full bg-[var(--color-primary)] shadow-[var(--shadow-token-sm)]"
              />
            ) : null}
            <span className={isActive ? "relative text-[#fffaf1]" : "relative text-[var(--color-text-secondary)]"}>
              {compact ? shortLabel : labels[item]}
            </span>
          </motion.button>
        );
      })}
      <span className="sr-only">{i18n.language}</span>
    </div>
  );
}
