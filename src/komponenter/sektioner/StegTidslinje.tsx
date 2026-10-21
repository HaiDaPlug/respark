"use client";

/**
 * "Så fungerar det" på mobil och surfplatta: stegen staplade, vart och ett
 * med sin vy – ingenting gömt bakom tryck. En stegrad fastnar under menyn
 * medan besökaren scrollar genom stegen: den fylls på i takt med scrollen och
 * visar vilket steg man är på. Stegnumren tänds när man når dem.
 */
import { m, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { texter } from "@/innehall/texter";
import { STEGVYER } from "@/komponenter/illustrationer/StegVyer";
import { Avsloja } from "@/komponenter/ui/Avsloja";
import { Stegnummer, Stegpanel } from "./StegDelar";

/** Var på skärmen ett steg räknas som nått, i andel av höjden uppifrån. */
const LASLINJE = 0.6;

export function StegTidslinje() {
  const t = texter.saFungerarDet;
  const antal = t.steg.length;
  const rader = useRef<Array<HTMLLIElement | null>>([]);
  /** 0–antal: heltalsdelen är steget, decimalerna hur långt man scrollat i det. */
  const framsteg = useMotionValue(0);
  const [aktiv, setAktiv] = useState(0);
  const { scrollY } = useScroll();
  useMotionValueEvent(framsteg, "change", (v) => setAktiv(Math.min(antal - 1, Math.floor(v))));

  useEffect(() => {
    function berakna() {
      const linje = window.innerHeight * LASLINJE;
      let varde = 0;
      rader.current.forEach((rad, i) => {
        if (!rad) return;
        const { top, height } = rad.getBoundingClientRect();
        if (top <= linje) varde = i + Math.min(1, (linje - top) / height);
      });
      framsteg.set(varde);
    }
    berakna();
    const avregistrera = scrollY.on("change", berakna);
    window.addEventListener("resize", berakna);
    return () => {
      avregistrera();
      window.removeEventListener("resize", berakna);
    };
  }, [antal, framsteg, scrollY]);

  return (
    <div className="mt-10">
      {/* Stegraden – fastnar under menyn (h-16) */}
      <div aria-hidden className="sticky top-16 z-20 -mx-5 border-b border-line bg-surface/90 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex items-center justify-between gap-3 text-[0.78rem] font-semibold">
          <span className="text-accent-strong">{t.stegAv(aktiv + 1, antal)}</span>
          <span className="truncate text-ink-soft">{t.steg[aktiv].titel}</span>
        </div>
        <div className="mt-2 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${antal}, minmax(0, 1fr))` }}>
          {t.steg.map((s, i) => (
            <Segment key={s.titel} framsteg={framsteg} index={i} />
          ))}
        </div>
      </div>

      <ol className="mt-8 space-y-14">
        {t.steg.map((steg, i) => {
          const Vy = STEGVYER[i];
          return (
            <li
              key={steg.titel}
              ref={(el) => {
                rader.current[i] = el;
              }}
            >
              <Avsloja>
                <div className="flex items-start gap-4">
                  <Stegnummer nr={i + 1} aktiv={i <= aktiv} />
                  <div>
                    <h3 className="text-h3 font-bold text-ink">{steg.titel}</h3>
                    <p className="mt-1.5 text-ink-soft">{steg.text}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Stegpanel>
                    <Vy />
                  </Stegpanel>
                </div>
              </Avsloja>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** En del av stegraden. Fylls från vänster medan man scrollar genom sitt steg. */
function Segment({ framsteg, index }: { framsteg: MotionValue<number>; index: number }) {
  const fyllnad = useTransform(framsteg, [index, index + 1], [0, 1]);
  return (
    <span className="relative h-1 overflow-hidden rounded-full bg-line-strong">
      <m.span className="absolute inset-0 origin-left rounded-full bg-accent-strong" style={{ scaleX: fyllnad }} />
    </span>
  );
}
