"use client";

import { m } from "motion/react";
import { useLayoutEffect, useState, useSyncExternalStore, type RefObject } from "react";

export type Sida = "hoger" | "vanster" | "topp" | "botten";
type Punkt = { x: number; y: number };
export type Koppling = { bana: string; start: Punkt; slut: Punkt };

/**
 * Räknar ut en mjuk kurva mellan två element i en illustration, i pixlar
 * relativt `behallare`. Mäts om när något av elementen ändrar storlek och
 * när typsnitten har laddats.
 *
 * `sidor` får behållarens bredd och svarar med vilka sidor kurvan ska gå
 * mellan – eller null om ingen kurva ska ritas vid den bredden. Funktionen
 * måste vara definierad utanför komponenten (stabil), annars mäts allt om
 * vid varje rendering.
 */
export function useKoppling(
  behallare: RefObject<HTMLElement | null>,
  fran: RefObject<HTMLElement | null>,
  till: RefObject<HTMLElement | null>,
  sidor: (bredd: number) => [Sida, Sida] | null,
): Koppling | null {
  const [koppling, setKoppling] = useState<Koppling | null>(null);

  useLayoutEffect(() => {
    const b = behallare.current;
    const f = fran.current;
    const t = till.current;
    if (!b || !f || !t) return;

    let avslutad = false;
    const rakna = () => {
      if (avslutad) return;
      const br = b.getBoundingClientRect();
      const val = sidor(br.width);
      const fr = f.getBoundingClientRect();
      const tr = t.getBoundingClientRect();
      if (!val || fr.width === 0 || tr.width === 0) {
        setKoppling(null);
        return;
      }
      const start = punkt(fr, val[0], br);
      const slut = punkt(tr, val[1], br);
      const ny = { bana: kurva(start, slut, val[0], val[1]), start, slut };
      setKoppling((forra) => (forra?.bana === ny.bana ? forra : ny));
    };

    // ResizeObserver anropar rakna() direkt när observationen startar.
    const observator = new ResizeObserver(rakna);
    for (const element of [b, f, t]) observator.observe(element);
    document.fonts?.ready.then(rakna);

    return () => {
      avslutad = true;
      observator.disconnect();
    };
  }, [behallare, fran, till, sidor]);

  return koppling;
}

function punkt(r: DOMRect, sida: Sida, b: DOMRect): Punkt {
  const x = r.left - b.left;
  const y = r.top - b.top;
  switch (sida) {
    case "hoger":
      return { x: x + r.width, y: y + r.height / 2 };
    case "vanster":
      return { x, y: y + r.height / 2 };
    case "topp":
      return { x: x + r.width / 2, y };
    case "botten":
      return { x: x + r.width / 2, y: y + r.height };
  }
}

const vagrat = (s: Sida) => s === "hoger" || s === "vanster";

function forskjut(p: Punkt, sida: Sida, k: number): Punkt {
  if (sida === "hoger") return { x: p.x + k, y: p.y };
  if (sida === "vanster") return { x: p.x - k, y: p.y };
  if (sida === "topp") return { x: p.x, y: p.y - k };
  return { x: p.x, y: p.y + k };
}

const avrunda = (n: number) => Math.round(n * 10) / 10;

function kurva(a: Punkt, c: Punkt, sa: Sida, sc: Sida) {
  const avstand = vagrat(sa) ? Math.abs(c.x - a.x) : Math.abs(c.y - a.y);
  const k = Math.max(28, avstand * 0.55);
  const c1 = forskjut(a, sa, k);
  const c2 = forskjut(c, sc, k);
  return `M ${avrunda(a.x)} ${avrunda(a.y)} C ${avrunda(c1.x)} ${avrunda(c1.y)}, ${avrunda(c2.x)} ${avrunda(c2.y)}, ${avrunda(c.x)} ${avrunda(c.y)}`;
}

/**
 * Linjen som ritas mellan stegen. Ett svagt streckat spår syns hela tiden;
 * accentlinjen ritas fram när steget är aktivt.
 */
export function Kopplingslinje({ koppling, aktiv }: { koppling: Koppling | null; aktiv: boolean }) {
  if (!koppling) return null;
  const { bana, start, slut } = koppling;
  return (
    <g>
      <path
        d={bana}
        fill="none"
        stroke="var(--farg-text)"
        strokeOpacity={0.16}
        strokeWidth={1.5}
        strokeDasharray="2 5"
        strokeLinecap="round"
      />
      <m.path
        d={bana}
        fill="none"
        stroke="var(--farg-accent)"
        strokeWidth={2}
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: aktiv ? 1 : 0, opacity: aktiv ? 1 : 0 }}
        transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
      />
      <circle cx={start.x} cy={start.y} r={3.5} fill="var(--farg-yta)" stroke="var(--farg-accent)" strokeWidth={2} />
      <m.circle
        cx={slut.x}
        cy={slut.y}
        r={3.5}
        fill="var(--farg-accent)"
        initial={false}
        animate={{ opacity: aktiv ? 1 : 0.25 }}
        transition={{ duration: 0.3, delay: aktiv ? 0.6 : 0 }}
      />
    </g>
  );
}

// Inget att lyssna på förrän sidan körs i webbläsaren.
function lyssnaPaRorelse(andrad: () => void) {
  const fraga = window.matchMedia("(prefers-reduced-motion: reduce)");
  fraga.addEventListener("change", andrad);
  return () => fraga.removeEventListener("change", andrad);
}

/**
 * true om besökaren valt reducerad rörelse. Servern antar false, och
 * webbläsaren byter direkt efter hydrering – utan hydreringsfel.
 */
export function useReduceradRorelse() {
  return useSyncExternalStore(
    lyssnaPaRorelse,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}
