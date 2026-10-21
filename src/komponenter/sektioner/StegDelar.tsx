import type { ReactNode } from "react";
import { klass } from "@/lib/klass";

/** Siffran framför varje steg. I accentfärgen när steget är aktivt. */
export function Stegnummer({ nr, aktiv = true }: { nr: number; aktiv?: boolean }) {
  return (
    <span
      className={klass(
        "grid size-9 shrink-0 place-items-center rounded-full font-display text-[0.9rem] font-bold transition-colors duration-300",
        aktiv ? "bg-accent-strong text-white shadow-knapp" : "bg-sand text-ink-soft",
      )}
    >
      {nr}
    </span>
  );
}

/**
 * Den beige ytan som stegvyerna visas på.
 *
 * fast – fyller förälderns höjd (den fasta ytan på desktop), så att alla
 *        steg är lika höga och sidan inte hoppar när de byts.
 */
export function Stegpanel({ children, fast = false }: { children: ReactNode; fast?: boolean }) {
  return (
    <div
      aria-hidden
      className={klass(
        "yta-beige relative flex items-center justify-center overflow-hidden rounded-3xl px-4 sm:px-8",
        fast ? "h-full" : "py-8 sm:py-10",
      )}
    >
      <div className="korn absolute inset-0 opacity-[0.06] mix-blend-multiply" />
      <div className="relative flex w-full justify-center">{children}</div>
    </div>
  );
}
