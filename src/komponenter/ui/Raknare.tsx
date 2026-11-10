"use client";

/**
 * Ett tal som räknas upp från noll när det kommer fram på skärmen, t.ex.
 * kundcasets siffror (2026-11-10). Ger liv åt siffrorna utan att ändra dem.
 *
 * - Servern skriver ut det riktiga talet, så att det syns utan JavaScript och
 *   för sökmotorer. Webbläsaren nollställer det bara om det inte syns än.
 * - Syns talet redan när sidan laddas (t.ex. efter omladdning mitt på sidan)
 *   står det kvar som det är, utan att hoppa till noll.
 * - Skärmläsare får hela värdet en gång; talet som räknas är dolt för dem.
 * - Vid reducerad rörelse visas talet direkt.
 * - Värden som inte är ett heltal (t.ex. "3,2") visas som de är (delaTal).
 */
import { animate, m, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { delaTal, formateraTal } from "@/lib/raknare";
import { useReduceradRorelse } from "@/komponenter/illustrationer/useKoppling";

/** Hur lång tid uppräkningen tar, i sekunder. Snabbt i början, mjukt på slutet. */
const UPPRAKNING_S = 1.6;

export function Raknare({ varde }: { varde: string }) {
  const delar = delaTal(varde);
  const mal = delar?.tal ?? null;
  const ref = useRef<HTMLSpanElement>(null);
  const synlig = useInView(ref, { once: true, amount: 0.6 });
  const reducerad = useReduceradRorelse();
  const tal = useMotionValue(mal ?? 0);
  const text = useTransform(tal, (v) => formateraTal(Math.round(v)));
  /** true om talet redan syntes när sidan laddades – då räknas det inte upp. */
  const syntesDirekt = useRef(false);

  // Innan första bilden: nollställ talet om det inte syns än (osynligt för besökaren).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || mal === null) return;
    const r = el.getBoundingClientRect();
    syntesDirekt.current = r.top < window.innerHeight && r.bottom > 0;
    if (!syntesDirekt.current) tal.jump(0);
  }, [mal, tal]);

  // Räkna upp när talet kommer fram, eller visa det direkt.
  useEffect(() => {
    if (mal === null) return;
    if (reducerad || syntesDirekt.current) {
      tal.jump(mal);
      return;
    }
    if (!synlig) return;
    const kontroll = animate(tal, mal, { duration: UPPRAKNING_S, ease: [0.16, 1, 0.3, 1] });
    return () => kontroll.stop();
  }, [synlig, reducerad, mal, tal]);

  if (!delar) return <>{varde}</>;
  return (
    <>
      <span className="sr-only">{varde}</span>
      <span aria-hidden>
        {delar.fore}
        <m.span ref={ref} className="tabular-nums">
          {text}
        </m.span>
        {delar.efter}
      </span>
    </>
  );
}
