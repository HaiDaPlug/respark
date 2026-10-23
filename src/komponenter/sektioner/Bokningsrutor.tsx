"use client";

import { m } from "motion/react";
import { Check } from "lucide-react";

/**
 * En ruta per bokning i kundcaset. Rutorna dyker upp en i taget när de
 * scrollas fram, så att man ser bokningarna "komma in". Bara bild – siffran
 * och texten bredvid bär informationen. ljus = vita rutor med grön bock, för
 * mörkgrön botten (kundcasets band).
 */
export function Bokningsrutor({ antal, ljus = false }: { antal: number; ljus?: boolean }) {
  return (
    <ul aria-hidden className="flex max-w-[30rem] flex-wrap gap-1.5 sm:gap-2">
      {Array.from({ length: antal }, (_, i) => (
        <m.li
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.35, delay: 0.15 + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
          data-avsloja
          className={`grid size-8 place-items-center rounded-lg sm:size-9 ${ljus ? "bg-white text-framgang" : "bg-framgang text-white"}`}
        >
          <Check className="size-4" strokeWidth={2.6} />
        </m.li>
      ))}
    </ul>
  );
}
