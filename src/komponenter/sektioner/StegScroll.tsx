"use client";

/**
 * "Så fungerar det" på desktop: stegen styrs av scrollen. Innehållet fastnar
 * under menyn (sticky) medan besökaren scrollar, och efter en bit scroll
 * byts steget. Linjen ovanför det aktiva steget fylls på i takt med scrollen,
 * och produktvyn till höger byts. Ett klick på ett steg scrollar dit.
 *
 * Ingen höjd ändras när stegen byts – all text syns hela tiden och det
 * aktiva steget markeras bara med färg – så sidan hoppar inte medan man
 * scrollar. Editorial stil sedan 2026-10-22: siffror och tunna linjer i
 * stället för rutor.
 */
import { AnimatePresence, m, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { texter } from "@/innehall/texter";
import { klass } from "@/lib/klass";
import { STEGVYER } from "@/komponenter/illustrationer/StegVyer";
import { useReduceradRorelse } from "@/komponenter/illustrationer/useKoppling";
import { Stegnummer, Stegpanel } from "./StegDelar";

/** Hur långt man scrollar per steg, i procent av skärmhöjden. Lägre = stegen byts snabbare. */
const SCROLL_PER_STEG_VH = 38;
/** Samma som klassen top-24 på det fasta innehållet (6rem). */
const STICKY_TOPP_PX = 96;

export function StegScroll() {
  const steg = texter.saFungerarDet.steg;
  const antal = steg.length;
  const spar = useRef<HTMLDivElement>(null);
  const fast = useRef<HTMLDivElement>(null);
  const reducerad = useReduceradRorelse();
  const [aktiv, setAktiv] = useState(0);

  // 0 när det fasta innehållet fastnar, 1 när det släpper.
  const { scrollYProgress } = useScroll({ target: spar, offset: [`start ${STICKY_TOPP_PX}px`, "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setAktiv(Math.min(antal - 1, Math.floor(v * antal)));
  });
  /** Scrollar så att steg i blir aktivt (en bit in i dess del av scrollen). */
  function ga(i: number) {
    const sparEl = spar.current;
    const fastEl = fast.current;
    if (!sparEl || !fastEl) return;
    const start = sparEl.getBoundingClientRect().top + window.scrollY - STICKY_TOPP_PX;
    const perSteg = (sparEl.offsetHeight - fastEl.offsetHeight) / antal;
    window.scrollTo({ top: start + (i + 0.3) * perSteg, behavior: reducerad ? "auto" : "smooth" });
  }

  const Vy = STEGVYER[aktiv];

  return (
    <div ref={spar} className="relative" style={{ height: `calc(100vh - ${STICKY_TOPP_PX}px + ${antal * SCROLL_PER_STEG_VH}vh)` }}>
      <div ref={fast} className="sticky top-24 flex h-[calc(100vh-6rem)] items-center">
        <div className="grid w-full grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-center gap-12">
          <ol className="flex flex-col border-b border-line-strong">
            {steg.map((s, i) => {
              const arAktiv = i === aktiv;
              return (
                <li key={s.titel} className="relative border-t border-line-strong">
                  <Framstegslinje framsteg={scrollYProgress} index={i} antal={antal} />
                  <button
                    type="button"
                    onClick={() => ga(i)}
                    aria-current={arAktiv ? "step" : undefined}
                    className="group flex w-full items-baseline gap-6 py-7 text-left"
                  >
                    <Stegnummer nr={i + 1} aktiv={i <= aktiv} />
                    <span className="block">
                      <span
                        className={klass(
                          "block font-display text-[1.6rem] leading-tight font-bold tracking-[-0.03em] transition-colors duration-300",
                          arAktiv ? "text-ink" : "text-ink-soft group-hover:text-ink",
                        )}
                      >
                        {s.titel}
                      </span>
                      <span className="mt-2 block max-w-[26rem] text-lead text-ink-soft">{s.text}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Produktvyn för det aktiva steget. Vyerna ligger ovanpå varandra och tonar över. */}
          <div className="relative h-[min(31rem,calc(100vh-10rem))]">
            <p className="sr-only">{`Exempelbild: ${steg[aktiv].titel}`}</p>
            <AnimatePresence initial={false}>
              <m.div
                key={aktiv}
                className="absolute inset-0"
                initial={{ opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.985 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Stegpanel fast>
                  <Vy />
                </Stegpanel>
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Den tunna linjen ovanför ett steg. Fylls från vänster med accentfärg under
 * stegets del av scrollen och är full precis när nästa steg blir aktivt –
 * som en förloppsindikator per steg.
 */
function Framstegslinje({ framsteg, index, antal }: { framsteg: MotionValue<number>; index: number; antal: number }) {
  const fyllnad = useTransform(framsteg, [index / antal, (index + 1) / antal], [0, 1]);
  return (
    <m.span
      aria-hidden
      className="absolute inset-x-0 -top-px h-0.5 origin-left bg-accent-strong"
      style={{ scaleX: fyllnad }}
    />
  );
}
