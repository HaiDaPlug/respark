"use client";

/**
 * Byggstenar för produktillustrationerna: appfönster, statuschip, avatar och
 * en av/på-knapp. Allt här är bilder av gränssnittet – inget är klickbart,
 * och hela illustrationen döljs för skärmläsare (den beskrivs med aria-label
 * på det yttre elementet i stället).
 */
import { AnimatePresence, m } from "motion/react";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { texter } from "@/innehall/texter";
import { klass } from "@/lib/klass";
import { Gnista } from "@/komponenter/ui/Gnista";

/** Ett appfönster med märke, titel och valfritt innehåll till höger i listen. */
export function Fonster({
  titel,
  hoger,
  children,
  className,
  innerKlass,
}: {
  titel: string;
  hoger?: ReactNode;
  children: ReactNode;
  className?: string;
  innerKlass?: string;
}) {
  return (
    <div className={klass("overflow-hidden rounded-2xl bg-surface shadow-lyft ring-1 ring-line", className)}>
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
        <Gnista className="size-5" />
        <span className="text-[0.78rem] font-semibold text-ink">{titel}</span>
        {hoger && <div className="ml-auto">{hoger}</div>}
      </div>
      <div className={klass("p-4", innerKlass)}>{children}</div>
    </div>
  );
}

/** Märker att en vy är en illustration och inte en riktig kunds data. */
export function Exempeletikett({ className }: { className?: string }) {
  return (
    <span
      className={klass(
        "rounded-full bg-sand px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.06em] text-ink-soft",
        className,
      )}
    >
      {texter.exempel.etikett}
    </span>
  );
}

/** Rund avatar med initialer. `framhavd` ger accentfärg (kunden berättelsen handlar om). */
export function Avatar({ initialer, framhavd = false }: { initialer: string; framhavd?: boolean }) {
  return (
    <span
      className={klass(
        "grid size-7 shrink-0 place-items-center rounded-full text-[0.64rem] font-bold",
        framhavd ? "bg-accent-soft text-accent-strong" : "bg-sand text-ink-soft",
      )}
    >
      {initialer}
    </span>
  );
}

export type Kundstatus = "inaktiv" | "skickat" | "bokat";

/** Kundens status i listan. Byter text och färg mjukt när status ändras. */
export function Statuschip({ status, className }: { status: Kundstatus; className?: string }) {
  const text = texter.exempel.status[status];
  return (
    <span className={klass("relative inline-flex", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={status}
          initial={{ opacity: 0, y: 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={klass(
            "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.68rem] font-semibold",
            status === "inaktiv" && "bg-sand text-ink-soft",
            status === "skickat" && "bg-accent-wash text-accent-strong ring-1 ring-accent/25",
            status === "bokat" && "bg-framgang text-white",
          )}
        >
          {status === "bokat" ? (
            <Check aria-hidden className="size-3 text-white/85" strokeWidth={3} />
          ) : (
            <span
              aria-hidden
              className={klass("size-1.5 rounded-full", status === "inaktiv" ? "bg-ink-faint" : "bg-accent")}
            />
          )}
          {text}
        </m.span>
      </AnimatePresence>
    </span>
  );
}

/** En av/på-knapp som bild. */
export function Vaxel({ pa = true }: { pa?: boolean }) {
  return (
    <span
      className={klass(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors",
        pa ? "bg-accent" : "bg-ink/15",
      )}
    >
      <span
        className={klass(
          "size-4 rounded-full bg-surface shadow-sm transition-transform",
          pa ? "translate-x-4" : "translate-x-0",
        )}
      />
    </span>
  );
}

/** En knapp som bild (inte klickbar). */
export function Bildknapp({ children, ljus = false }: { children: ReactNode; ljus?: boolean }) {
  return (
    <span
      className={klass(
        "inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[0.72rem] font-semibold",
        ljus ? "bg-surface text-ink ring-1 ring-line-strong" : "bg-ink text-bg",
      )}
    >
      {children}
    </span>
  );
}
