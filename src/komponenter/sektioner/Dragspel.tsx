"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { klass } from "@/lib/klass";

type Fraga = { fraga: string; svar: string; utkast?: boolean };

/**
 * Expanderbara frågor. Knapparna har aria-expanded och styr varsin region;
 * stängda svar är `inert` så att de inte läses upp eller nås med tabb.
 * Öppnar och stänger med en mjuk höjdövergång (grid-rows 0fr → 1fr).
 */
export function Dragspel({ fragor, utkastEtikett }: { fragor: Fraga[]; utkastEtikett: string }) {
  const [oppen, setOppen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line-strong border-y border-line-strong">
      {fragor.map((f, i) => {
        const arOppen = oppen === i;
        const id = `fraga-${i}`;
        return (
          <div key={f.fraga}>
            <h3>
              <button
                id={`${id}-knapp`}
                type="button"
                aria-expanded={arOppen}
                aria-controls={`${id}-svar`}
                onClick={() => setOppen(arOppen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left sm:py-7"
              >
                <span className="font-display text-[1.15rem] leading-snug font-semibold tracking-[-0.02em] text-ink sm:text-[1.45rem]">
                  {f.fraga}
                  {f.utkast && (
                    <span className="ml-2 inline-block rounded-full bg-accent-soft px-2 py-0.5 align-middle text-[0.68rem] font-semibold text-accent-strong">
                      {utkastEtikett}
                    </span>
                  )}
                </span>
                <span
                  aria-hidden
                  className={klass(
                    "grid size-9 shrink-0 place-items-center rounded-full ring-1 transition-[background-color,transform,color] duration-300",
                    arOppen
                      ? "rotate-45 bg-ink text-bg ring-ink"
                      : "text-ink ring-line-strong group-hover:bg-surface",
                  )}
                >
                  <Plus className="size-4" strokeWidth={2.25} />
                </span>
              </button>
            </h3>
            <div
              id={`${id}-svar`}
              role="region"
              aria-labelledby={`${id}-knapp`}
              inert={!arOppen}
              className={klass(
                "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                arOppen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-[40rem] pr-12 pb-7 text-lead text-ink-soft">{f.svar}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
