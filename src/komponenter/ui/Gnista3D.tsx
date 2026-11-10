"use client";

/**
 * Gnistan ur loggan i 3D, för avslutningen (2026-11-10): ett tjockt märke som
 * sakta vaggar fram och tillbaka och svävar i det varma skenet. Samma gnista
 * som flyger in i telefonen i heron, så att sidan börjar och slutar med den.
 *
 * Tjockleken är mörkare kopior av märket bakom varandra (samma knep som
 * telefonen i Telefon.tsx). Märket vaggar bara ±30 grader – vänds det hela
 * varvet syns kanten som ett tunt streck. Orange finns bara i loggan, och det
 * här är loggan.
 *
 * Bara dekor: dold för skärmläsare. Vid reducerad rörelse står den still,
 * lite vriden.
 */
import { m, useInView } from "motion/react";
import { useRef } from "react";
import { klass } from "@/lib/klass";
import { useReduceradRorelse } from "@/komponenter/illustrationer/useKoppling";
import { Gnista } from "./Gnista";

/** Antal kopior av märket och avståndet mellan dem, i px. */
const LAGER = 9;
const AVSTAND_PX = 2;

/** Vilan: lite vriden, så att tjockleken syns även när den står still. */
const VILA = { rotateX: 10, rotateY: -22, y: "0%" };

export function Gnista3D({ className }: { className?: string }) {
  const reducerad = useReduceradRorelse();
  const ref = useRef<HTMLDivElement>(null);
  // Vaggar bara medan den syns – och inte alls när den är dold (under md).
  const iBild = useInView(ref);
  const vagga = iBild && !reducerad;
  return (
    <div ref={ref} aria-hidden className={klass("pointer-events-none perspective-[900px]", className)}>
      <m.div
        className="relative size-full transform-3d"
        initial={VILA}
        // Utanför bild går den tillbaka till vilan, så att loopen stannar.
        animate={vagga ? { rotateY: [-22, 30, -30, -22], rotateX: [10, 6, 14, 10], y: ["0%", "-4%", "0%", "0%"] } : VILA}
        transition={vagga ? { duration: 14, repeat: Infinity, ease: "easeInOut" } : { duration: 0.6 }}
      >
        {/* Bakifrån och fram: den främsta kopian har loggans färger, de bakre är mörkare */}
        {Array.from({ length: LAGER }, (_, i) => LAGER - 1 - i).map((djup) => (
          <Gnista
            key={djup}
            className="absolute inset-0 size-full"
            style={{
              transform: `translateZ(${-djup * AVSTAND_PX}px)`,
              filter: djup === 0 ? undefined : `brightness(${0.62 - djup * 0.03})`,
            }}
          />
        ))}
      </m.div>
    </div>
  );
}
