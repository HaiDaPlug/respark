"use client";

import { m, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ankare, texter } from "@/innehall/texter";
import { useOvergangsId } from "@/komponenter/ui/Gnista";

/**
 * "Läs vidare" i heron: bara en stor pil nedåt. Pilen är mörk och fylls
 * nerifrån med märkesfärgen i takt med att besökaren scrollar. Den är helt
 * fylld när den nått drygt en tredjedel upp på skärmen.
 *
 * Fyllningen är en färgad yta bakom en mask av pilen, och ytan flyttas uppåt –
 * bara transform, aldrig höjd (se CLAUDE.md). Pilen gungar lite för att visa
 * att sidan fortsätter. Vid reducerad rörelse står den still (MotionConfig),
 * men färgen följer ändå scrollen, eftersom det är besökaren som rör sidan.
 */
export function LasVidarePil() {
  const ref = useRef<HTMLAnchorElement>(null);
  const id = useOvergangsId("las-vidare");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["end end", "start 35%"] });
  // Pilens streck går från y = 14 till 35 i viewBox: ytan börjar precis under och slutar precis över.
  const fyllning = useTransform(scrollYProgress, [0, 1], [35, 14]);

  return (
    <a
      ref={ref}
      href={`/#${ankare.varfor}`}
      aria-label={texter.hero.lasVidare}
      className="group grid size-16 place-items-center rounded-full lg:size-20"
    >
      <m.span
        aria-hidden
        className="block"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 48 48" className="size-14 transition-transform duration-200 group-hover:translate-y-1 lg:size-[4.5rem]">
          <defs>
            <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
              <path
                d="M9 17 24 32 39 17"
                fill="none"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </mask>
            <linearGradient id={`${id}-farg`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" style={{ stopColor: "var(--farg-accent-mork)" }} />
              <stop offset="1" style={{ stopColor: "var(--farg-accent)" }} />
            </linearGradient>
          </defs>
          <g mask={`url(#${id}-mask)`}>
            <rect width="48" height="48" style={{ fill: "var(--farg-text)" }} />
            <m.rect width="48" height="21" fill={`url(#${id}-farg)`} style={{ y: fyllning }} />
          </g>
        </svg>
      </m.span>
    </a>
  );
}
