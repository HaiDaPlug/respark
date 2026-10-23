import type { ReactNode } from "react";
import { klass } from "@/lib/klass";

/** Siffran framför varje steg, editorialt som "01". I accentfärgen när steget är aktivt. */
export function Stegnummer({ nr, aktiv = true }: { nr: number; aktiv?: boolean }) {
  return (
    <span
      className={klass(
        "shrink-0 font-display text-[0.95rem] font-bold tabular-nums transition-colors duration-300",
        aktiv ? "text-accent-strong" : "text-ink-soft",
      )}
    >
      {String(nr).padStart(2, "0")}
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
