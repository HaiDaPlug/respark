import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import type { CSSProperties } from "react";
import { texter } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";
import { RorelseProvider } from "@/komponenter/RorelseProvider";
import { INTRO_SKRIPT } from "@/lib/intro";
import "./globals.css";

// Brödtext: Inter, mycket lättläst. Rubriker: Manrope, rundare och varmare.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(sajt.doman),
  title: texter.meta.titel,
  description: texter.meta.beskrivning,
  applicationName: sajt.produktnamn,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "/",
    siteName: sajt.produktnamn,
    title: texter.meta.titel,
    description: texter.meta.beskrivning,
  },
  twitter: {
    card: "summary_large_image",
    title: texter.meta.titel,
    description: texter.meta.beskrivning,
  },
  // Indexeras inte förrän sajt.indexera är true (sätts vid lansering).
  robots: sajt.indexera ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: sajt.farger.bakgrund,
  colorScheme: "light",
};

/** Färgerna från konfigurationen blir CSS-variabler som designsystemet i globals.css läser. */
const farger = {
  "--farg-bakgrund": sajt.farger.bakgrund,
  "--farg-yta": sajt.farger.yta,
  "--farg-sand": sajt.farger.sand,
  "--farg-text": sajt.farger.text,
  "--farg-text-sekundar": sajt.farger.textSekundar,
  "--farg-accent": sajt.farger.accent,
  "--farg-accent-mork": sajt.farger.accentMork,
  "--farg-framgang": sajt.farger.framgang,
} as CSSProperties;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: introskriptet sätter data-intro på <html> innan React tar över.
    <html lang="sv" className={`${inter.variable} ${manrope.variable}`} style={farger} suppressHydrationWarning>
      <head>
        {/* Bestämmer om startsidans intro ska spelas, innan något ritas (se src/lib/intro.ts) */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SKRIPT }} />
      </head>
      <body>
        {/* Utan JavaScript körs inga animationer – visa då allt direkt. */}
        <noscript>
          <style>{"[data-avsloja]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        <a
          href="#innehall"
          className="sr-only rounded-full bg-ink px-5 py-3 font-semibold text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]"
        >
          Hoppa till innehållet
        </a>
        <RorelseProvider>{children}</RorelseProvider>
      </body>
    </html>
  );
}
