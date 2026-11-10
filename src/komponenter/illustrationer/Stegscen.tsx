"use client";

/**
 * En stegvy i 3D, för "Så fungerar det" (2026-11-10). Appfönstret står snett
 * på den beige ytan och vrider sig sakta medan besökaren scrollar, och det
 * som hör till steget svävar framför det (Svavare).
 *
 * Desktop (StegScroll): vinklarna kommer från den fasta sektionens scroll, så
 * att fönstret vrider sig genom alla tre stegen. När steget byts vänds
 * fönstret runt i 3D (byte), och de svävande sakerna byts ut.
 *
 * Mobil (StegTidslinje): varje steg har sin egen scen, och fönstret vrider
 * sig medan just den scenen passerar skärmen.
 *
 * Vid reducerad rörelse står fönstret rakt, utan vändning.
 *
 * Föräldern ger perspektivet (Stegpanel). Animera aldrig opacity på ett
 * element som ska behålla 3D för sina barn – opacity plattar till djupet –
 * därför tonar fönstret själv, inte behållaren runt det.
 */
import {
  AnimatePresence,
  m,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";
import { STEGVYER } from "./StegVyer";
import { Svavare } from "./Svavare";
import { useReduceradRorelse } from "./useKoppling";

const mjuk = [0.22, 1, 0.36, 1] as const;
const FJADER = { stiffness: 80, damping: 20 };

export type Lutning = { rotateX: MotionValue<number>; rotateY: MotionValue<number> };

/** Vinklar som följer scrollen genom ett område: vriden åt vänster in, åt höger ut. */
export function useScrollLutning(framsteg: MotionValue<number>): Lutning {
  const rotateY = useSpring(useTransform(framsteg, [0, 1], [-13, 9]), FJADER);
  const rotateX = useSpring(useTransform(framsteg, [0, 0.5, 1], [9, 5, 8]), FJADER);
  return { rotateX, rotateY };
}

export function Stegscen({
  steg,
  lutning,
  byte = false,
}: {
  /** Vilket steg (0–2), samma ordning som STEGVYER och texterna. */
  steg: number;
  /** Vinklar utifrån (desktop). Utan dem följer scenen sin egen väg över skärmen. */
  lutning?: Lutning;
  /** Vänd fönstret i 3D när steget byts (desktop, där samma scen visar alla steg). */
  byte?: boolean;
}) {
  const reducerad = useReduceradRorelse();
  const scen = useRef<HTMLDivElement>(null);
  // Egen scroll: från att scenen kommer in nedtill tills den lämnar upptill.
  const { scrollYProgress } = useScroll({ target: scen, offset: ["start end", "end start"] });
  const egen = useScrollLutning(scrollYProgress);
  const { rotateX, rotateY } = lutning ?? egen;
  // De svävande sakerna kommer in när scenen syns (en gång), och svävar bara medan den syns.
  const synlig = useInView(scen, { once: true, amount: 0.3 });
  const iBild = useInView(scen);
  const Vy = STEGVYER[steg];

  return (
    <m.div
      ref={scen}
      // --ut: hur långt utanför fönstret de svävande sakerna får sitta (Svavare).
      // Lite mindre på surfplatta, där ytan bredvid fönstret är smalare.
      className="relative w-full max-w-[25rem] transform-3d [--ut:0.6] lg:[--ut:1]"
      style={reducerad ? undefined : { rotateX, rotateY }}
    >
      {byte ? (
        <AnimatePresence mode="wait">
          <div key={steg} className="relative transform-3d">
            <m.div
              initial={reducerad ? { opacity: 0 } : { opacity: 0, rotateY: -28, scale: 0.94 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={reducerad ? { opacity: 0 } : { opacity: 0, rotateY: 28, scale: 0.94 }}
              transition={{ duration: 0.38, ease: mjuk }}
            >
              <Vy />
            </m.div>
            <Svavare steg={steg} synlig={synlig} svava={iBild} />
          </div>
        </AnimatePresence>
      ) : (
        <>
          <Vy />
          <Svavare steg={steg} synlig={synlig} svava={iBild} />
        </>
      )}
    </m.div>
  );
}
