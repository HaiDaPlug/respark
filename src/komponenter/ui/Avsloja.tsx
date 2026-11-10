"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

/**
 * Tonar in innehållet när det scrollas fram. Körs en gång per element.
 *
 * Med lite djup sedan 2026-11-10: innehållet lutar bakåt från underkanten och
 * reser sig när det kommer in, som ett kort som ställs upp (rotateX med eget
 * perspektiv). Bara transform och opacity.
 *
 * Utan JavaScript skulle innehållet stå osynligt – därför har layout.tsx en
 * <noscript>-regel som visar allt med [data-avsloja].
 */
export function Avsloja({
  children,
  fordrojning = 0,
  className,
}: {
  children: ReactNode;
  /** Sekunder innan animationen börjar – för att låta kort i rad komma i tur och ordning. */
  fordrojning?: number;
  className?: string;
}) {
  return (
    <m.div
      data-avsloja
      className={className}
      initial={{ opacity: 0, y: 22, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay: fordrojning, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1200, transformOrigin: "50% 100%" }}
    >
      {children}
    </m.div>
  );
}
