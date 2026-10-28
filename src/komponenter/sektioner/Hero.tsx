import { Fragment, type CSSProperties } from "react";
import { texter } from "@/innehall/texter";
import { HeroScen } from "@/komponenter/illustrationer/HeroScen";
import { Behallare } from "@/komponenter/ui/Behallare";
import { HeroEtikett } from "./HeroEtikett";
import { LasVidarePil } from "./LasVidarePil";

/**
 * Första skärmen, över hela fönstret. Början på en berättelse: den stora
 * rubriken till vänster (på desktop mitt i höjd, i linje med telefonen), en
 * rad som säger vad tjänsten är och en stor pil nedåt som fylls med
 * märkesfärgen när man scrollar (LasVidarePil). Inga knappar – fortsättningen
 * står i nästa sektion (Problem), och "Kom igång" finns i menyn (och i
 * knappraden på mobil). Till höger plingar en påminnelse in i en telefon, en
 * gång (HeroScen).
 *
 * Bakgrunden (yta-hero) tonar över i sidans bakgrund nedtill, så att det inte
 * blir någon skarv mot nästa sektion.
 *
 * --telefon är telefonens bredd. Den sätts här så att rubriken på desktop
 * kan hålla sig till vänster om telefonen och scenen på mobil blir hög nog.
 * Under lg räknas bredden fram ur skärmhöjden minus rubriken och raden under (23rem), så att
 * hela telefonen ryms ovanför rubriken utan tomrum runt sig.
 *
 * Intro (src/lib/intro.ts): när någon kommer till sidan syns först bara
 * telefonen mitt på skärmen. Sedan glider den hit, rubriken kommer in ord för
 * ord (.intro-ord) och sist menyn och pilen (.intro-sist). Hoppas
 * introt över syns allt direkt.
 */
export function Hero() {
  const t = texter.hero;
  return (
    <section
      aria-labelledby="hero-rubrik"
      className="yta-hero relative isolate flex min-h-svh flex-col overflow-hidden [--telefon:min(16rem,60vw,calc((100svh-23rem)/2.2))] sm:[--telefon:min(18rem,calc((100svh-23rem)/2.2))] lg:min-h-[max(40rem,100svh)] lg:justify-center lg:[--telefon:min(20rem,38svh)]"
    >
      {/*
        Scenen. På mobil ovanför rubriken, på desktop till höger om den.
        lg:right-8: absolut placering räknas från behållarens padding-kant,
        så right-8 lägger telefonen i linje med innehållets högerkant. Ingen
        overflow-hidden här (den kapade telefonens skugga) – sektionen klipper
        spåren som kommer in utanför skärmen.
      */}
      <div className="relative min-h-[calc(var(--telefon)*2.15+5.5rem)] flex-1 lg:absolute lg:inset-0 lg:min-h-0">
        <Behallare className="absolute inset-x-0 top-20 bottom-0 lg:top-0">
          <div className="absolute top-[max(0px,calc(50%-var(--telefon)*1.06))] right-[6%] sm:right-[10%] lg:top-1/2 lg:right-8 lg:-translate-y-1/2">
            <HeroScen />
          </div>
        </Behallare>
      </div>

      <Behallare className="relative pt-4 pb-4 sm:pb-6 lg:py-20">
        <div className="lg:max-w-[calc(100%-var(--telefon)-2rem)]">
          <div className="intro-sist">
            <HeroEtikett />
          </div>

          <h1 id="hero-rubrik" className="text-hero font-extrabold text-ink max-sm:text-[3.1rem]">
            <Ord text={t.rubrik.fore} forsta={0} />{" "}
            <span className="relative inline-block text-accent-strong">
              <Ord text={t.rubrik.markerad} forsta={antalOrd(t.rubrik.fore)} />
              <svg
                aria-hidden
                viewBox="0 0 200 14"
                preserveAspectRatio="none"
                className="absolute -bottom-[0.08em] left-0 h-[0.2em] w-full overflow-visible animate-rita"
              >
                <path
                  d="M3 9.5C46 4.2 112 2.6 197 6.4"
                  fill="none"
                  stroke="var(--farg-accent)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </span>{" "}
            <Ord text={t.rubrik.efter} forsta={antalOrd(t.rubrik.fore) + antalOrd(t.rubrik.markerad)} />
          </h1>

          {/* Vad tjänsten är, i en rad – så att besökaren förstår det inom de första sekunderna */}
          <p
            className="intro-ord mt-5 max-w-[34rem] text-lead font-medium text-ink lg:mt-6 lg:text-[1.25rem]"
            style={{ "--i": antalOrd(`${t.rubrik.fore} ${t.rubrik.markerad} ${t.rubrik.efter}`) + 1 } as CSSProperties}
          >
            {t.kategori}
          </p>
        </div>
      </Behallare>

      {/* "Läs vidare": på mobil under texten, på desktop längst ner i mitten */}
      <div className="intro-sist relative flex justify-center pb-4 sm:pb-6 lg:absolute lg:inset-x-0 lg:bottom-6 lg:pb-0">
        <LasVidarePil />
      </div>
    </section>
  );
}

const antalOrd = (text: string) => text.split(" ").length;

/** Delar en text i ord som kan komma in ett i taget under introt. --i är ordets nummer i rubriken. */
function Ord({ text, forsta }: { text: string; forsta: number }) {
  return text.split(" ").map((ord, i) => (
    <Fragment key={ord + i}>
      {i > 0 && " "}
      <span className="intro-ord" style={{ "--i": forsta + i } as CSSProperties}>
        {ord}
      </span>
    </Fragment>
  ));
}
