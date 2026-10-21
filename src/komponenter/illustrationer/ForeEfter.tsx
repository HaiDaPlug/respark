"use client";

/**
 * Före/efter i problemsektionen som två små, levande scener.
 *
 * Före: en krokig, prickad väg från kundlistan förbi tre hinder (leta i
 * listan, skriva varje SMS, glömma bort). Punkten – påminnelsen – rör sig
 * långsamt, fastnar vid varje hinder och når aldrig fram. Kunden bleknar bort
 * och blir en streckad kontur.
 *
 * Efter: en jämn, hel väg. Punkten går snabbt via det automatiska SMS:et fram
 * till kunden, som tänds med en bock. Efter-scenen hinner två varv på samma
 * tid som före-scenen tar ett.
 *
 * Varje scen drivs av en klocka som går 0 → 1 i en loop. Allt annat – punktens
 * läge, noder som pulsar, kunden som bleknar eller tänds – räknas fram ur
 * klockan med useTransform. Klockan står still när scenen inte syns. Vid
 * reducerad rörelse står scenen i ett stillbildsläge där hela berättelsen syns.
 *
 * Koordinaterna är SVG:ns (400 × 250). Noder och etiketter är HTML ovanpå,
 * placerade med procent av samma mått – därför har scenen fast bildformat.
 */
import { m, useInView, useMotionValue, useTransform, type MotionStyle, type MotionValue } from "motion/react";
import { Check, Hourglass, MessageSquareText, PenLine, Search, UserRound, Users, type LucideIcon } from "lucide-react";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { texter } from "@/innehall/texter";
import { klass } from "@/lib/klass";
import { useReduceradRorelse } from "./useKoppling";

const BREDD = 400;
const HOJD = 250;

type Punkt = { x: number; y: number };
type Vag = { d: string; punktVid: (andel: number) => Punkt };

/* ------------------------------------------------------------------ */
/* Geometri                                                            */
/* ------------------------------------------------------------------ */

const avrunda = (v: number) => Math.round(v * 10) / 10;

function bezier(a: Punkt, b: Punkt, c: Punkt, d: Punkt, u: number): Punkt {
  const v = 1 - u;
  return {
    x: v * v * v * a.x + 3 * v * v * u * b.x + 3 * v * u * u * c.x + u * u * u * d.x,
    y: v * v * v * a.y + 3 * v * v * u * b.y + 3 * v * u * u * c.y + u * u * u * d.y,
  };
}

/**
 * En mjuk väg genom punkterna (Catmull–Rom omräknad till kubiska
 * Bézierkurvor). `punktVid(andel)` ger punkten en viss andel av vägens längd
 * in – mätt i längd, inte i kurvparameter, så att farten blir jämn.
 */
function vag(punkter: Punkt[]): Vag {
  let d = `M${punkter[0].x} ${punkter[0].y}`;
  const prover: Punkt[] = [punkter[0]];
  for (let i = 0; i < punkter.length - 1; i++) {
    const p0 = punkter[i - 1] ?? punkter[i];
    const p1 = punkter[i];
    const p2 = punkter[i + 1];
    const p3 = punkter[i + 2] ?? p2;
    const c1 = { x: avrunda(p1.x + (p2.x - p0.x) / 6), y: avrunda(p1.y + (p2.y - p0.y) / 6) };
    const c2 = { x: avrunda(p2.x - (p3.x - p1.x) / 6), y: avrunda(p2.y - (p3.y - p1.y) / 6) };
    d += ` C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
    for (let k = 1; k <= 24; k++) prover.push(bezier(p1, c1, c2, p2, k / 24));
  }

  const langder = [0];
  for (let i = 1; i < prover.length; i++) {
    langder.push(langder[i - 1] + Math.hypot(prover[i].x - prover[i - 1].x, prover[i].y - prover[i - 1].y));
  }
  const total = langder[langder.length - 1];

  function punktVid(andel: number): Punkt {
    const mal = Math.min(Math.max(andel, 0), 1) * total;
    let i = 1;
    while (i < langder.length - 1 && langder[i] < mal) i++;
    const del = (mal - langder[i - 1]) / (langder[i] - langder[i - 1] || 1);
    return {
      x: prover[i - 1].x + (prover[i].x - prover[i - 1].x) * del,
      y: prover[i - 1].y + (prover[i].y - prover[i - 1].y) * del,
    };
  }

  return { d, punktVid };
}

/** Punkten längs en kedja av vägar: 1,5 betyder halvvägs på den andra vägen. */
function langsVagarna(vagar: Vag[], lage: number): Punkt {
  const i = Math.min(Math.max(Math.floor(lage), 0), vagar.length - 1);
  return vagar[i].punktVid(lage - i);
}

/* Före: kundlistan → tre hinder → kunden. Vägarna slingrar sig medvetet, och den tredje gör en ögla. */
const FORE_NODER: Punkt[] = [
  { x: 44, y: 192 },
  { x: 118, y: 70 },
  { x: 222, y: 180 },
  { x: 296, y: 68 },
  { x: 360, y: 186 },
];
const FORE_VAGAR: Vag[] = [
  vag([FORE_NODER[0], { x: 70, y: 150 }, { x: 106, y: 166 }, { x: 113, y: 134 }, { x: 82, y: 118 }, { x: 90, y: 92 }, FORE_NODER[1]]),
  vag([FORE_NODER[1], { x: 156, y: 80 }, { x: 140, y: 120 }, { x: 186, y: 112 }, { x: 176, y: 150 }, FORE_NODER[2]]),
  vag([
    FORE_NODER[2],
    { x: 246, y: 164 },
    { x: 262, y: 142 },
    { x: 278, y: 154 },
    { x: 268, y: 172 },
    { x: 250, y: 162 },
    { x: 258, y: 128 },
    { x: 280, y: 104 },
    FORE_NODER[3],
  ]),
  vag([FORE_NODER[3], { x: 328, y: 84 }, { x: 318, y: 128 }, { x: 350, y: 140 }, FORE_NODER[4]]),
];

/* Efter: kundlistan → automatiskt SMS → kunden, i en jämn båge. */
const EFTER_NODER: Punkt[] = [
  { x: 44, y: 196 },
  { x: 200, y: 140 },
  { x: 352, y: 76 },
];
const EFTER_VAGAR: Vag[] = [
  vag([EFTER_NODER[0], { x: 122, y: 192 }, EFTER_NODER[1]]),
  vag([EFTER_NODER[1], { x: 276, y: 86 }, EFTER_NODER[2]]),
];

/* ------------------------------------------------------------------ */
/* Tidslinjer (andel av klockans varv)                                 */
/* ------------------------------------------------------------------ */

const FORE_TID = {
  varaktighetMs: 9000,
  /** Stillbilden: punkten har gett upp och kunden har bleknat. */
  stilla: 0.86,
  /** Klocka → läge längs vägarna. Platta partier = punkten står still vid ett hinder. */
  tider: [0, 0.05, 0.17, 0.27, 0.39, 0.49, 0.61, 1],
  lagen: [0, 0, 1, 1, 2, 2, 3, 3],
  /** När punkten står still vid hinder 1, 2 och 3. */
  vantan: [
    [0.17, 0.27],
    [0.39, 0.49],
    [0.61, 0.74],
  ],
};

const EFTER_TID = {
  varaktighetMs: 4500,
  /** Stillbilden: kunden är tänd. */
  stilla: 0.75,
  tider: [0, 0.06, 0.3, 0.36, 0.58, 1],
  lagen: [0, 0, 1, 1, 2, 2],
};

/* ------------------------------------------------------------------ */
/* Klocka och hjälpare                                                 */
/* ------------------------------------------------------------------ */

/**
 * Scenens klocka: går 0 → 1 under varaktighetMs, om och om igen, medan scenen
 * syns. Vid reducerad rörelse står den på `stilla`.
 */
function useScenklocka(ref: RefObject<HTMLElement | null>, varaktighetMs: number, stilla: number) {
  const klocka = useMotionValue(stilla);
  const synlig = useInView(ref, { amount: 0.35 });
  const reducerad = useReduceradRorelse();
  const kor = synlig && !reducerad;

  useEffect(() => {
    if (reducerad) klocka.set(stilla);
    if (!kor) return;
    let id = 0;
    let forra = performance.now();
    const tick = (nu: number) => {
      klocka.set((klocka.get() + (nu - forra) / varaktighetMs) % 1);
      forra = nu;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [klocka, kor, reducerad, stilla, varaktighetMs]);

  return klocka;
}

/** 1 medan klockan är inom [fran, till], annars 0 – med korta övergångar. */
function useFonster(klocka: MotionValue<number>, fran: number, till: number) {
  return useTransform(klocka, [fran - 0.02, fran, till, till + 0.02], [0, 1, 1, 0]);
}

/** Punktens x och y för ett läge längs vägarna. */
function usePunkt(lage: MotionValue<number>, vagar: Vag[]) {
  const x = useTransform(lage, (v) => langsVagarna(vagar, v).x);
  const y = useTransform(lage, (v) => langsVagarna(vagar, v).y);
  return { x, y };
}

const procent = (p: Punkt) => ({ x: `${(p.x / BREDD) * 100}%`, y: `${(p.y / HOJD) * 100}%` });

/** En nod ovanpå SVG:n, centrerad på sin punkt. */
function Nod({ punkt, children, style }: { punkt: Punkt; children: ReactNode; style?: MotionStyle }) {
  const { x, y } = procent(punkt);
  return (
    <m.div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: x, top: y, ...style }}>
      {children}
    </m.div>
  );
}

/**
 * En etikett ovanför eller under en nod. `justering` styr vilken kant som
 * linjerar med noden: "start" och "slut" används vid scenens kanter så att
 * etiketten inte sticker ut.
 */
function Etikett({
  punkt,
  placering,
  justering = "mitt",
  className,
  style,
  children,
}: {
  punkt: Punkt;
  placering: "over" | "under";
  justering?: "start" | "mitt" | "slut";
  className?: string;
  style?: MotionStyle;
  children: ReactNode;
}) {
  const { x, y } = procent(punkt);
  const left = justering === "start" ? `calc(${x} - 1.1rem)` : justering === "slut" ? `calc(${x} + 1.1rem)` : x;
  const top = placering === "over" ? `calc(${y} - 1.65rem)` : `calc(${y} + 1.65rem)`;
  return (
    <m.p
      className={klass(
        "absolute rounded-full px-2.5 py-1 text-[0.7rem] font-semibold whitespace-nowrap shadow-kort ring-1 sm:text-[0.74rem]",
        placering === "over" && "-translate-y-full",
        justering === "mitt" && "-translate-x-1/2",
        justering === "slut" && "-translate-x-full",
        className,
      )}
      style={{ left, top, ...style }}
    >
      {children}
    </m.p>
  );
}

/* ------------------------------------------------------------------ */
/* Före                                                                */
/* ------------------------------------------------------------------ */

const HINDER: LucideIcon[] = [Search, PenLine, Hourglass];

export function ForeScen() {
  const t = texter.problem.fore;
  const ref = useRef<HTMLDivElement>(null);
  const klocka = useScenklocka(ref, FORE_TID.varaktighetMs, FORE_TID.stilla);
  const lage = useTransform(klocka, FORE_TID.tider, FORE_TID.lagen);
  const { x, y } = usePunkt(lage, FORE_VAGAR);
  const punktSynlig = useTransform(klocka, [0, 0.04, 0.68, 0.75], [0, 1, 1, 0]);
  // Kunden tonas över till en streckad kontur. Kort övergång, och ingen text
  // i konturen – halvgenomskinlig text skulle bli svårläst.
  const kundBorta = useTransform(klocka, [0, 0.74, 0.77, 0.95, 0.98], [0, 0, 1, 1, 0]);
  const kundKvar = useTransform(kundBorta, (v) => 1 - v);
  const slutSynlig = useFonster(klocka, 0.8, 0.93);
  // Ringen runt ett hinder snurrar medan punkten väntar där.
  const varv = useTransform(klocka, (v) => v * 360 * 6);
  const kund = texter.exempel.kunder[0];

  return (
    <div ref={ref} role="img" aria-label={t.beskrivning} className="relative aspect-[8/5] w-full">
      <svg viewBox={`0 0 ${BREDD} ${HOJD}`} aria-hidden className="absolute inset-0 size-full overflow-visible">
        {FORE_VAGAR.map((v, i) => (
          <path
            key={v.d}
            d={v.d}
            fill="none"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeDasharray="0.1 7.5"
            // Sista biten – fram till kunden – nås aldrig och är svagast.
            className={i === FORE_VAGAR.length - 1 ? "stroke-ink/15" : "stroke-ink/35"}
          />
        ))}
        <m.circle cx={x} cy={y} r={6.5} strokeWidth={2.5} className="fill-ink-soft stroke-surface" style={{ opacity: punktSynlig }} />
      </svg>

      <Nod punkt={FORE_NODER[0]}>
        <span className="grid size-9 place-items-center rounded-xl bg-surface text-ink-soft shadow-kort ring-1 ring-line">
          <Users aria-hidden className="size-4" strokeWidth={2.2} />
        </span>
      </Nod>
      <Etikett punkt={FORE_NODER[0]} placering="under" justering="start" className="bg-surface text-ink-soft ring-line">
        {t.noder[0]}
      </Etikett>

      {HINDER.map((ikon, i) => (
        <Hinder
          key={t.noder[i + 1]}
          punkt={FORE_NODER[i + 1]}
          ikon={ikon}
          etikett={t.noder[i + 1]}
          placering={i % 2 === 0 ? "over" : "under"}
          klocka={klocka}
          fonster={FORE_TID.vantan[i]}
          varv={varv}
        />
      ))}

      <Nod punkt={FORE_NODER[4]}>
        <span className="relative grid size-10 place-items-center">
          <m.span
            className="absolute inset-0 grid place-items-center rounded-full bg-surface text-[0.72rem] font-bold text-ink-soft shadow-kort ring-1 ring-line"
            style={{ opacity: kundKvar }}
          >
            {kund.initialer}
          </m.span>
          <m.span
            aria-hidden
            className="absolute inset-0 grid place-items-center rounded-full border-[1.5px] border-dashed border-ink/25 text-ink-faint"
            style={{ opacity: kundBorta }}
          >
            <UserRound className="size-4" strokeWidth={2} />
          </m.span>
        </span>
      </Nod>
      <Etikett
        punkt={FORE_NODER[4]}
        placering="over"
        justering="slut"
        className="bg-surface text-ink-soft ring-line"
        style={{ opacity: slutSynlig }}
      >
        {t.slut}
      </Etikett>
    </div>
  );
}

/** Ett hinder på vägen. Pulsar och får en snurrande ring medan punkten väntar där. */
function Hinder({
  punkt,
  ikon: Ikon,
  etikett,
  placering,
  klocka,
  fonster,
  varv,
}: {
  punkt: Punkt;
  ikon: LucideIcon;
  etikett: string;
  placering: "over" | "under";
  klocka: MotionValue<number>;
  fonster: number[];
  varv: MotionValue<number>;
}) {
  const vantar = useFonster(klocka, fonster[0], fonster[1]);
  const skala = useTransform(vantar, [0, 1], [1, 1.12]);
  return (
    <>
      <Nod punkt={punkt} style={{ scale: skala }}>
        <span className="relative grid size-9 place-items-center rounded-full bg-surface text-ink-soft shadow-kort ring-1 ring-line">
          <Ikon aria-hidden className="size-4" strokeWidth={2.2} />
          <m.span
            aria-hidden
            className="absolute -inset-1.5 rounded-full border-2 border-dashed border-ink/30"
            style={{ opacity: vantar, rotate: varv }}
          />
        </span>
      </Nod>
      <Etikett punkt={punkt} placering={placering} className="bg-surface text-ink-soft ring-line">
        {etikett}
      </Etikett>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Efter                                                               */
/* ------------------------------------------------------------------ */

export function EfterScen() {
  const t = texter.problem.efter;
  const ref = useRef<HTMLDivElement>(null);
  const klocka = useScenklocka(ref, EFTER_TID.varaktighetMs, EFTER_TID.stilla);
  const lage = useTransform(klocka, EFTER_TID.tider, EFTER_TID.lagen);
  const { x, y } = usePunkt(lage, EFTER_VAGAR);
  const punktSynlig = useTransform(klocka, [0, 0.05, 0.55, 0.6], [0, 1, 1, 0]);
  // Ljusa streck som flyter längs vägen. 48 är en multipel av strecklängden (12), så loopen syns inte.
  const flode = useTransform(klocka, (v) => -v * 48);
  const smsPuls = useFonster(klocka, 0.29, 0.37);
  const smsSkala = useTransform(smsPuls, [0, 1], [1, 1.14]);
  const tand = useFonster(klocka, 0.58, 0.92);
  const bockSkala = useTransform(tand, [0, 1], [0.5, 1]);
  const kund = texter.exempel.kunder[0];

  return (
    <div ref={ref} role="img" aria-label={t.beskrivning} className="relative aspect-[8/5] w-full">
      <svg viewBox={`0 0 ${BREDD} ${HOJD}`} aria-hidden className="absolute inset-0 size-full overflow-visible">
        {EFTER_VAGAR.map((v) => (
          <path key={v.d} d={v.d} fill="none" strokeWidth={3} strokeLinecap="round" className="stroke-accent-strong" />
        ))}
        {EFTER_VAGAR.map((v) => (
          <m.path
            key={`flode-${v.d}`}
            d={v.d}
            fill="none"
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeDasharray="2 10"
            className="stroke-surface/80"
            style={{ strokeDashoffset: flode }}
          />
        ))}
        <m.circle cx={x} cy={y} r={12} className="fill-accent/25" style={{ opacity: punktSynlig }} />
        <m.circle cx={x} cy={y} r={6.5} strokeWidth={2.5} className="fill-accent-strong stroke-surface" style={{ opacity: punktSynlig }} />
      </svg>

      <Nod punkt={EFTER_NODER[0]}>
        <span className="grid size-9 place-items-center rounded-xl bg-surface text-accent-strong shadow-kort ring-1 ring-accent/30">
          <Users aria-hidden className="size-4" strokeWidth={2.2} />
        </span>
      </Nod>
      <Etikett punkt={EFTER_NODER[0]} placering="under" justering="start" className="bg-surface text-ink-soft ring-line">
        {t.noder[0]}
      </Etikett>

      <Nod punkt={EFTER_NODER[1]} style={{ scale: smsSkala }}>
        <span className="grid size-10 place-items-center rounded-full bg-accent-strong text-white shadow-knapp">
          <MessageSquareText aria-hidden className="size-[1.1rem]" strokeWidth={2.2} />
        </span>
      </Nod>
      {/* Till vänster om noden, så att vägen vidare mot kunden ligger fri */}
      <Etikett
        punkt={EFTER_NODER[1]}
        placering="over"
        justering="slut"
        className="bg-surface text-accent-strong ring-accent/25"
      >
        {t.noder[1]}
      </Etikett>

      <Nod punkt={EFTER_NODER[2]}>
        <span className="relative grid size-10 place-items-center rounded-full bg-surface text-[0.72rem] font-bold text-ink-soft shadow-kort ring-1 ring-line">
          {kund.initialer}
          {/* Tänd: samma avatar i accentfärg, tonas in ovanpå */}
          <m.span
            aria-hidden
            className="absolute inset-0 grid place-items-center rounded-full bg-accent-strong text-white ring-4 ring-accent-soft"
            style={{ opacity: tand }}
          >
            {kund.initialer}
          </m.span>
          <m.span
            aria-hidden
            className="absolute -right-1 -bottom-1 grid size-[1.1rem] place-items-center rounded-full bg-ink text-white ring-2 ring-surface"
            style={{ opacity: tand, scale: bockSkala }}
          >
            <Check className="size-2.5" strokeWidth={3.5} />
          </m.span>
        </span>
      </Nod>
      <Etikett
        punkt={EFTER_NODER[2]}
        placering="over"
        justering="slut"
        className="bg-ink text-bg ring-ink"
        style={{ opacity: tand }}
      >
        {t.slut}
      </Etikett>
    </div>
  );
}
