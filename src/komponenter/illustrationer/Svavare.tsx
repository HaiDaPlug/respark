"use client";

/**
 * Det som svävar framför produktvyerna i "Så fungerar det", på olika djup i
 * 3D (z). När fönstret lutar rör sig sakerna längst fram mest – det är det som
 * ger djupet. Ett steg, en sak att visa, nästan utan text:
 *
 *   0  Lägg in dina kunder           tre kunder svävar in i fönstret från vänster
 *   1  Välj när sms:en ska gå ut     två sms-bubblor svävar ut åt höger
 *   2  Se vilka som kommer tillbaka  "Bokat igen" med loggans gnista
 *
 * Sakerna kommer in när scenen syns (synlig, från Stegscen – inte var och en
 * för sig, eftersom en sak som ligger utanför ytans kant aldrig räknas som
 * synlig) och tonar ut när steget byts (exit, i Stegscens AnimatePresence).
 * Sedan svävar de sakta upp och ned i olika takt. Vid reducerad rörelse står
 * de still.
 *
 * Placeringen är vald så att inget täcker "Exempelvy", knappar eller text som
 * betyder något i vyn – bara tomma ytor och fönstrets kant. På mobil (under
 * sm) visas de inte alls: där fyller fönstret hela ytan och sakerna skulle
 * hamna ovanpå texten. Där ger fönstrets vridning djupet.
 *
 * Bara bild: allt är dolt för skärmläsare (stegets text beskriver vyn).
 * Föräldern måste ha transform-style: preserve-3d (klassen transform-3d) för
 * att djupet ska synas.
 */
import { m, type TargetAndTransition } from "motion/react";
import { Check, MessageCircle } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { texter } from "@/innehall/texter";
import { Gnista } from "@/komponenter/ui/Gnista";
import { Avatar, Statuschip } from "./Delar";
import { useReduceradRorelse } from "./useKoppling";

const mjuk = [0.22, 1, 0.36, 1] as const;

type Plats = {
  /**
   * Var saken sitter: vid fönstrets vänstra eller högra kant, så här många
   * procent av fönstrets bredd utanför den (negativt = inåt). Multipliceras
   * med --ut, som Stegscen sätter lägre på smala skärmar där det inte finns
   * plats bredvid fönstret.
   */
  sida: "left" | "right";
  ut: number;
  /** Avstånd från fönstrets överkant, t.ex. "50%" (negativt = ovanför). */
  top: string;
  /** Hur långt framför fönstret, i px. */
  z: number;
  /** Sekunder innan saken kommer in. */
  fordrojning: number;
  /** Sekunder för ett varv upp och ned. Olika takt gör att det ser levande ut. */
  svav: number;
  /** Var saken kommer ifrån (förskjutning i px innan den kommer in). */
  fran: { x: number; y?: number };
};

/** En svävande sak: kommer in på sin plats, på sitt djup, och svävar sedan (medan scenen syns). */
function Sak({ plats, synlig, svava, children }: { plats: Plats; synlig: boolean; svava: boolean; children: ReactNode }) {
  const reducerad = useReduceradRorelse();
  const loop = svava && !reducerad;
  const { sida, ut, top, z, fordrojning, svav, fran } = plats;
  const dold: TargetAndTransition = { opacity: 0, x: fran.x, y: fran.y ?? 0, scale: 0.85 };
  const syns: TargetAndTransition = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: fordrojning, ease: mjuk },
  };
  return (
    <m.div
      aria-hidden
      className="pointer-events-none absolute max-sm:hidden"
      style={{ [sida]: `calc(${-ut}% * var(--ut, 1))`, top, z } as CSSProperties}
      initial={dold}
      animate={synlig ? syns : dold}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
    >
      <m.div
        initial={false}
        animate={loop ? { y: [0, -7, 0] } : { y: 0 }}
        transition={loop ? { duration: svav, repeat: Infinity, ease: "easeInOut", delay: fordrojning } : { duration: 0.4 }}
      >
        {children}
      </m.div>
    </m.div>
  );
}

/** Steg 1: kunderna som svävar in, vid fönstrets vänstra kant. */
const KUNDPLATSER: Plats[] = [
  { sida: "left", ut: 15, top: "7%", z: 90, fordrojning: 0.15, svav: 5.2, fran: { x: -56 } },
  { sida: "left", ut: 17, top: "31%", z: 120, fordrojning: 0.3, svav: 6.1, fran: { x: -64 } },
  { sida: "left", ut: 11, top: "55%", z: 60, fordrojning: 0.45, svav: 5.6, fran: { x: -48 } },
];

/**
 * Steg 2: sms-bubblorna som svävar ut till höger, där listan med sms har tom
 * plats. Raderna är textens längd (som ett skelett, ingen text).
 */
const BUBBLOR: Array<Plats & { bredd: string; rader: number[] }> = [
  {
    sida: "right", ut: 16, top: "55%", z: 120, fordrojning: 0.2, svav: 5.4, fran: { x: -40, y: 12 },
    bredd: "8.25rem", rader: [92, 74, 48],
  },
  {
    sida: "right", ut: 21, top: "27%", z: 60, fordrojning: 0.42, svav: 6.3, fran: { x: -36, y: 12 },
    bredd: "6.5rem", rader: [84, 56],
  },
];

/**
 * Steg 3: "Bokat igen" vid fönstrets nedre högra hörn (där raden längst ner har
 * tom plats), och en kund som har bokat vid vänstra kanten.
 */
const BOKAT: Plats = { sida: "right", ut: 10, top: "86%", z: 130, fordrojning: 0.25, svav: 5.6, fran: { x: 0, y: 18 } };
const BOKAT_KUND: Plats = { sida: "left", ut: 16, top: "60%", z: 80, fordrojning: 0.5, svav: 6.4, fran: { x: -40 } };

export function Svavare({
  steg,
  synlig,
  svava,
}: {
  steg: number;
  /** Har scenen synts? Då kommer sakerna in (och stannar). */
  synlig: boolean;
  /** Syns scenen just nu? Bara då svävar sakerna. */
  svava: boolean;
}) {
  const t = texter.exempel;

  if (steg === 0) {
    return t.kunder.map((kund, i) => (
      <Sak key={kund.namn} plats={KUNDPLATSER[i]} synlig={synlig} svava={svava}>
        <span className="inline-flex items-center gap-2 rounded-full bg-surface py-1.5 pr-3.5 pl-1.5 shadow-lyft ring-1 ring-line">
          <Avatar initialer={kund.initialer} framhavd={i === 0} />
          <span className="text-[0.74rem] font-semibold text-ink">{kund.namn}</span>
        </span>
      </Sak>
    ));
  }

  if (steg === 1) {
    return BUBBLOR.map((bubbla) => (
      <Sak key={bubbla.top} plats={bubbla} synlig={synlig} svava={svava}>
        <span
          className="block rounded-2xl rounded-bl-md bg-surface p-3 shadow-lyft ring-1 ring-line"
          style={{ width: bubbla.bredd }}
        >
          <span className="flex items-center gap-2">
            <span className="grid size-5 shrink-0 place-items-center rounded-md bg-ink text-white">
              <MessageCircle className="size-3" strokeWidth={2.4} />
            </span>
            <span className="h-1.5 w-10 rounded-full bg-ink/20" />
          </span>
          <span className="mt-2.5 flex flex-col gap-1.5">
            {bubbla.rader.map((bredd) => (
              <span key={bredd} className="h-1.5 rounded-full bg-sand-deep" style={{ width: `${bredd}%` }} />
            ))}
          </span>
        </span>
      </Sak>
    ));
  }

  return (
    <>
      <Sak plats={BOKAT} synlig={synlig} svava={svava}>
        <span className="relative block origin-bottom-right scale-125">
          <span className="inline-flex rounded-full shadow-lyft">
            <Statuschip status="bokat" />
          </span>
          <m.span
            className="absolute -top-3 -right-3 block size-6"
            initial={{ scale: 0, rotate: -50 }}
            animate={synlig ? { scale: [0, 1.3, 1], rotate: 0 } : { scale: 0, rotate: -50 }}
            transition={{ duration: 0.6, delay: BOKAT.fordrojning + 0.45, ease: mjuk }}
          >
            <Gnista className="size-full drop-shadow-[0_4px_8px_rgb(215_48_20/0.35)]" />
          </m.span>
        </span>
      </Sak>
      <Sak plats={BOKAT_KUND} synlig={synlig} svava={svava}>
        <span className="inline-flex items-center gap-2 rounded-full bg-surface py-1.5 pr-2 pl-1.5 shadow-lyft ring-1 ring-line">
          <Avatar initialer={t.kunder[1].initialer} />
          <span className="text-[0.74rem] font-semibold text-ink">{t.kunder[1].namn}</span>
          <span className="grid size-5 place-items-center rounded-full bg-framgang text-white">
            <Check className="size-3" strokeWidth={3} />
          </span>
        </span>
      </Sak>
    </>
  );
}
