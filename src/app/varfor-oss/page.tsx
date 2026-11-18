import type { Metadata } from "next";
import { texter } from "@/innehall/texter";
import { BokaMoteKnapp } from "@/komponenter/Bokning";
import { FragorJamforelse } from "@/komponenter/jamforelse/FragorJamforelse";
import { KunderOchKalender } from "@/komponenter/jamforelse/KunderOchKalender";
import { Navet } from "@/komponenter/jamforelse/Navet";
import { SjalvMotRespark } from "@/komponenter/jamforelse/SjalvMotRespark";
import { KomIgang } from "@/komponenter/sektioner/KomIgang";
import { MobilKnappar } from "@/komponenter/sektioner/MobilKnappar";
import { Navigering } from "@/komponenter/sektioner/Navigering";
import { Sidfot } from "@/komponenter/sektioner/Sidfot";
import { Behallare } from "@/komponenter/ui/Behallare";
import { KnappLank } from "@/komponenter/ui/Knapp";
import { Ordmarke } from "@/komponenter/ui/Ordmarke";

export const metadata: Metadata = {
  title: texter.jamforelse.meta.titel,
  description: texter.jamforelse.meta.beskrivning,
  /** Test (2026-11-16): indexeras inte förrän sidan är godkänd. */
  robots: { index: false, follow: false },
};

/**
 * Varför oss (/varfor-oss; hette Jämförelse och låg på /jamforelse till
 * 2026-11-17). Omgjord 2026-11-17. Budskapet: ditt
 * bokningssystem påminner om bokade tider – Respark hjälper kunden att boka
 * nästa. Ordning: första skärmen (rubriken som säger vad som jämförs, och
 * Respark som kärnan med bokningssystemen i en 3D-bana runt omkring) → kundlistan och kalendern (sidans viktigaste
 * bild, interaktiv) → kundlistan och kalendern → kunder som inte varit här
 * på länge (Osteopaticentrums 659 av 900) →
 * själv eller med Respark (jobbet, inte funktioner)  →
 * frågor → kom igång. Samma meny, sidfot och mobilknappar som startsidan.
 */
export default function VarforOss() {
  const t = texter.jamforelse.hero;
  return (
    <>
      <Navigering logga={<Ordmarke />} />
      <main id="innehall">
        {/* Första skärmen: vad som jämförs, och Respark som kärnan med bokningssystemen runt omkring */}
        <section aria-labelledby="hero-rubrik" className="yta-hero overflow-hidden pt-28 pb-16 sm:pt-32 lg:pb-20">
          <Behallare className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
            <div>
              <h1 id="hero-rubrik" className="text-display font-extrabold text-ink">
                <span className="text-ink-soft">{t.rubrik.fore}</span>{" "}
                <span className="text-accent-strong">{t.rubrik.markerad}</span>
              </h1>
              <p className="mt-6 max-w-[30rem] text-lead text-ink-soft">{t.text}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <KnappLank href={`#${texter.jamforelse.scen.ankare}`} storlek="lg" pil>
                  {t.seHur}
                </KnappLank>
                <BokaMoteKnapp variant="sekundar" storlek="lg" />
              </div>
            </div>
            <div>
              <Navet />
              <p className="mx-auto mt-2 max-w-[30rem] text-center text-[0.85rem] text-ink-soft">
                {texter.jamforelse.navet.forklaring}
              </p>
              <p className="mx-auto mt-1 max-w-[30rem] text-center text-[0.75rem] text-ink-faint">{texter.jamforelse.navet.fotnot}</p>
            </div>
          </Behallare>
        </section>
        <KunderOchKalender />
        <SjalvMotRespark />
        <FragorJamforelse />
        <KomIgang />
      </main>
      <Sidfot />
      <MobilKnappar />
    </>
  );
}
