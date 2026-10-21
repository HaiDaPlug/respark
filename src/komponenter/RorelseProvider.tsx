"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * Ramverket för animationer på hela sidan.
 *
 * - LazyMotion + domAnimation laddar bara de animationsdelar sidan använder,
 *   vilket håller JavaScript-paketet litet. Använd därför `m.div` och inte
 *   `motion.div` i komponenterna (strict varnar annars).
 * - reducedMotion="user" stänger av rörelse för besökare som valt reducerad
 *   rörelse i sitt operativsystem.
 */
export function RorelseProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
