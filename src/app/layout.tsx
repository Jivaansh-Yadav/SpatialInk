import type { Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/components/i18n/i18n-provider";
import { getServerLocale } from "@/lib/i18n/server-preference";
import { cn } from "@/utils/utils";

export const metadata = {
  title: "Spatial Gesture Canvas",
  description: "Spatial Gesture Canvas is a camera-first drawing app controlled by hand gestures. Users can grant camera access, pinch fingers to draw strokes over the mirrored video feed, releas...",
  openGraph: {
    title: "Spatial Gesture Canvas",
    description: "Spatial Gesture Canvas is a camera-first drawing app controlled by hand gestures. Users can grant camera access, pinch fingers to draw strokes over t...",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Spatial Gesture Canvas",
    description: "Spatial Gesture Canvas is a camera-first drawing app controlled by hand gestures. Users can grant camera access, pinch fingers to draw strokes over t...",
  },
};

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const headingFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#F5F1E8",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const serverLocale = await getServerLocale();

  return (
    <html
      lang={serverLocale}
      suppressHydrationWarning
      className={cn("h-full antialiased", bodyFont.variable, headingFont.variable)}
    >
      <body className="min-h-svh overflow-x-hidden bg-[var(--color-accent)] text-[var(--color-text-primary)]">
        <I18nProvider>
          {children}
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
