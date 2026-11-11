"use client";

/**
 * Det som svävar framför produktvyerna i "Så fungerar det", på olika djup i
 * 3D (z). När fönstret lutar rör sig sakerna längst fram mest – det är det som
 * ger djupet. Ett steg, en sak att visa, nästan utan text:
 *
 *   0  Lägg in dina kunder           kundlistan svävar in i fönstret från vänster
 *   1  Välj när sms:en ska gå ut     två sms-bubblor svävar ut åt höger
 *   2  Se vilka som kommer tillbaka  en kalender med grön bock, och loggans gnista
 *
 * Inget av det har text – kundernas namn står redan i bilderna (sedan
 * 2026-11-11), så här visas bara det som rör sig: listan in, sms:en ut och
 * bokningarna tillbaka. Raderna i listan och bubblorna är som ett skelett.
 *
 * Sakerna kommer in när scenen syns (synlig, från Stegscen – inte var och en
 * för sig, eftersom en sak som ligger utanför ytans kant aldrig räknas som
 * synlig) och tonar ut när steget byts (exit, i Stegscens AnimatePresence).
 * Sedan svävar de sakta upp och ned i olika takt. Vid reducerad rörelse står
 * de still.
 *
 * Placeringen är vald så att inget täcker "Exempelvy", knappar eller text som
 * betyder något i vyn – bara tomma ytor och fönstrets marginal. Under md
 * (768 px) visas de inte alls: där är ytan bredvid fönstret för smal, och
 * sakerna skulle hamna ovanpå texten eller klippas av. Där ger fönstrets
 * vridning djupet.
 *
 * Bara bild: allt är dolt för skärmläsare (stegets text beskriver vyn).
 * Föräldern måste ha transform-style: preserve-3d (klassen transform-3d) för
 * att djupet ska synas.
 */
import { m, type TargetAndTransition } from "motion/react";
import { CalendarCheck, Check, ClipboardList, MessageCircle } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Gnista } from "@/komponenter/ui/Gnista";
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
      className="pointer-events-none absolute max-md:hidden"
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

/**
 * Steg 1: kundlistan som svävar in vid fönstrets vänstra kant. Den ligger så
 * långt ut att den bara når fönstrets marginal – raderna börjar med kundernas
 * initialer, och de ska synas.
 */
const LISTA: Plats = { sida: "left", ut: 20, top: "26%", z: 110, fordrojning: 0.1, svav: 5.6, fran: { x: -60 } };

/**
 * Steg 2: sms-bubblorna som svävar ut till höger, nedanför av/på-knapparna
 * (där raden längst ner har tom plats). Raderna är textens längd.
 */
const BUBBLOR: Array<Plats & { bredd: string; rader: number[] }> = [
  {
    sida: "right", ut: 14, top: "76%", z: 120, fordrojning: 0.9, svav: 5.4, fran: { x: -40, y: 12 },
    bredd: "8.25rem", rader: [92, 74, 48],
  },
  {
    sida: "right", ut: 22, top: "40%", z: 60, fordrojning: 1.15, svav: 6.3, fran: { x: -36, y: 12 },
    bredd: "6.5rem", rader: [84, 56],
  },
];

/** Steg 3: en kalender med grön bock i fönstrets vänstra marginal, och gnistan vid nedre högra hörnet. */
const KALENDER: Plats = { sida: "left", ut: 22, top: "30%", z: 100, fordrojning: 0.35, svav: 6, fran: { x: -44 } };
const GNISTA: Plats = { sida: "right", ut: 7, top: "88%", z: 130, fordrojning: 0.9, svav: 5.2, fran: { x: 0, y: 14 } };

/** Raderna i ett "skelett": gråa streck i textens längd, utan text. */
function Skelett({ rader, punkt = false }: { rader: number[]; punkt?: boolean }) {
  return (
    <span className="flex flex-col gap-1.5">
      {rader.map((bredd) => (
        <span key={bredd} className="flex items-center gap-1.5">
          {punkt && <span className="size-2 shrink-0 rounded-full bg-accent-soft" />}
          <span className="h-1.5 rounded-full bg-sand-deep" style={{ width: `${bredd}%` }} />
        </span>
      ))}
    </span>
  );
}

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
  if (steg === 0) {
    return (
      <Sak plats={LISTA} synlig={synlig} svava={svava}>
        <span className="block w-[6.75rem] rounded-2xl bg-surface p-3 shadow-lyft ring-1 ring-line">
          <span className="mb-2.5 grid size-7 place-items-center rounded-lg bg-accent-wash text-accent-strong">
            <ClipboardList className="size-4" />
          </span>
          <Skelett rader={[86, 70, 78]} punkt />
        </span>
      </Sak>
    );
  }

  if (steg === 1) {
    return BUBBLOR.map((bubbla) => (
      <Sak key={bubbla.top} plats={bubbla} synlig={synlig} svava={svava}>
        <span
          className="block rounded-2xl rounded-bl-md bg-surface p-3 shadow-lyft ring-1 ring-line"
          style={{ width: bubbla.bredd }}
        >
          <span className="mb-2.5 flex items-center gap-2">
            <span className="grid size-5 shrink-0 place-items-center rounded-md bg-ink text-white">
              <MessageCircle className="size-3" strokeWidth={2.4} />
            </span>
            <span className="h-1.5 w-10 rounded-full bg-ink/20" />
          </span>
          <Skelett rader={bubbla.rader} />
        </span>
      </Sak>
    ));
  }

  return (
    <>
      <Sak plats={KALENDER} synlig={synlig} svava={svava}>
        <span className="relative block w-[6.5rem] rounded-2xl bg-surface p-3 shadow-lyft ring-1 ring-line">
          <span className="mb-2.5 grid size-7 place-items-center rounded-lg bg-framgang-soft text-framgang">
            <CalendarCheck className="size-4" />
          </span>
          <Skelett rader={[84, 58]} />
          {/* Bocken i vänstra hörnet – i det högra skulle den nå in över fönstrets text */}
          <span className="absolute -top-2 -left-2 grid size-6 place-items-center rounded-full bg-framgang text-white shadow-kort">
            <Check className="size-3.5" strokeWidth={3} />
          </span>
        </span>
      </Sak>
      <Sak plats={GNISTA} synlig={synlig} svava={svava}>
        <m.span
          className="block size-9"
          initial={{ scale: 0, rotate: -50 }}
          animate={synlig ? { scale: [0, 1.3, 1], rotate: 0 } : { scale: 0, rotate: -50 }}
          transition={{ duration: 0.6, delay: GNISTA.fordrojning, ease: mjuk }}
        >
          <Gnista className="size-full drop-shadow-[0_6px_10px_rgb(215_48_20/0.35)]" />
        </m.span>
      </Sak>
    </>
  );
}
