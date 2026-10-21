"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

/**
 * Tonar in innehållet när det scrollas fram. Körs en gång per element.
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
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay: fordrojning, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
