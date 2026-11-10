"use client";

/**
 * 3D-LUTNING SOM FÖLJER MUSPEKAREN
 *
 * Används av scenerna med djup (telefonen i heron). Scenen har en vilovinkel
 * (basX/basY, i grader) och lutar några grader åt pekaren när musen rör sig
 * över området – som om den tittar på besökaren. Vinklarna går via en fjäder,
 * så att allt rör sig mjukt, och sätts direkt som transform utan att
 * komponenten ritas om.
 *
 * Ingen lutning efter pekaren på pekskärmar (ingen mus att följa) eller vid
 * reducerad rörelse – då står scenen still i vilovinkeln.
 *
 * Tecknen: positiv rotateX lutar ovankanten bakåt (man ser telefonen lite
 * uppifrån), negativ rotateY vrider skärmen åt vänster.
 */
import { useMotionValue, useSpring, type MotionValue } from "motion/react";
import { useEffect, useSyncExternalStore, type RefObject } from "react";
import { useReduceradRorelse } from "./useKoppling";

/** Fjädern som vinklarna går igenom: snabb men utan att studsa. */
const FJADER = { stiffness: 110, damping: 18, mass: 0.6 };

function lyssnaPaPekare(andrad: () => void) {
  const fraga = window.matchMedia("(pointer: fine)");
  fraga.addEventListener("change", andrad);
  return () => fraga.removeEventListener("change", andrad);
}

/** true när besökaren har en mus eller styrplatta. Servern antar false. */
export function useFinPekare() {
  return useSyncExternalStore(
    lyssnaPaPekare,
    () => window.matchMedia("(pointer: fine)").matches,
    () => false,
  );
}

export function useLutning(
  /** Ett element i scenen. Pekaren följs över det, eller över närmaste förälder som matchar `narmast`. */
  scen: RefObject<HTMLElement | null>,
  {
    max = 5,
    basX = 0,
    basY = 0,
    narmast,
  }: {
    /** Hur många grader scenen som mest lutar åt pekaren, åt varje håll. */
    max?: number;
    basX?: number;
    basY?: number;
    /** CSS-väljare, t.ex. "section": följ pekaren över hela sektionen i stället för bara scenen. */
    narmast?: string;
  } = {},
): { rotateX: MotionValue<number>; rotateY: MotionValue<number> } {
  const reducerad = useReduceradRorelse();
  const fin = useFinPekare();
  const x = useMotionValue(basX);
  const y = useMotionValue(basY);
  const rotateX = useSpring(x, FJADER);
  const rotateY = useSpring(y, FJADER);

  // Vilovinkeln kan ändras (t.ex. när introt är klart) – fjädern vrider dit mjukt.
  useEffect(() => {
    x.set(basX);
    y.set(basY);
  }, [basX, basY, x, y]);

  useEffect(() => {
    const el = scen.current;
    const omrade = el && narmast ? el.closest<HTMLElement>(narmast) : el;
    if (!omrade || reducerad || !fin) return;

    const flytta = (e: PointerEvent) => {
      const r = omrade.getBoundingClientRect();
      // -0,5 till 0,5 från områdets mitt
      const px = Math.min(0.5, Math.max(-0.5, (e.clientX - r.left) / r.width - 0.5));
      const py = Math.min(0.5, Math.max(-0.5, (e.clientY - r.top) / r.height - 0.5));
      y.set(basY + px * max * 2);
      x.set(basX - py * max * 2);
    };
    const lamna = () => {
      x.set(basX);
      y.set(basY);
    };
    omrade.addEventListener("pointermove", flytta);
    omrade.addEventListener("pointerleave", lamna);
    return () => {
      omrade.removeEventListener("pointermove", flytta);
      omrade.removeEventListener("pointerleave", lamna);
    };
  }, [scen, narmast, reducerad, fin, max, basX, basY, x, y]);

  return { rotateX, rotateY };
}
