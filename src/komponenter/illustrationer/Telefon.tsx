import type { ReactNode } from "react";
import { klass } from "@/lib/klass";

/**
 * En mobiltelefon som bild. Skärmen är en container query, så innehållet i
 * telefonen skalar med telefonens bredd (cqw) i stället för med fönstret.
 * Texten har bara en minsta storlek, inget tak, så att proportionerna
 * stämmer även när telefonen är stor (heron på desktop).
 *
 * Telefonen är byggd för att stå i en 3D-scen (heron): bakom ramen ligger
 * några mörka kopior av den, en bit längre bak, som syns som telefonens
 * tjocklek när den lutar. Sidoknapparna sticker ut i kanten. Står telefonen
 * platt syns ingen av delarna. Tjockleken räknas i telefonbredder (--telefon)
 * när variabeln finns, så att den följer med storleken.
 *
 * mork – låsskärm: mörk bakgrundsbild och ljus statusrad utan klocka (klockan
 *        står stor på själva låsskärmen).
 */

/** Hur långt bak varje kopia av ramen ligger, i andelar av telefonens bredd. */
const TJOCKLEK = [0.012, 0.024, 0.036];

export function Telefon({
  children,
  className,
  mork = false,
}: {
  children: ReactNode;
  className?: string;
  mork?: boolean;
}) {
  return (
    <div
      className={klass(
        "relative rounded-[2.4rem] bg-ink p-[0.42rem] shadow-telefon transform-3d",
        // Tunn ljusare kant runt ramen, som metallen i en riktig telefon
        "ring-1 ring-white/10 ring-inset",
        className,
      )}
    >
      {/* Tjockleken: mörka kopior av ramen bakom, som syns i kanten när telefonen lutar */}
      {TJOCKLEK.map((djup) => (
        <span
          key={djup}
          aria-hidden
          className="absolute inset-0 rounded-[2.4rem] bg-[color-mix(in_oklab,var(--farg-text)_75%,black)]"
          style={{ transform: `translateZ(calc(var(--telefon, 18rem) * -${djup}))` }}
        />
      ))}
      {/* Sidoknapparna: ljud upp och ned till vänster, låsknappen till höger */}
      <span aria-hidden className="absolute top-[19%] -left-[3px] h-[6%] w-[3px] rounded-l-sm bg-ink" />
      <span aria-hidden className="absolute top-[27%] -left-[3px] h-[6%] w-[3px] rounded-l-sm bg-ink" />
      <span aria-hidden className="absolute top-[23%] -right-[3px] h-[10%] w-[3px] rounded-r-sm bg-ink" />

      <div
        className={klass(
          "@container relative flex aspect-[9/19] flex-col overflow-hidden rounded-[2rem]",
          mork ? "lasskarm text-white" : "bg-surface text-ink",
        )}
      >
        <Statusrad utanKlocka={mork} />
        {children}
      </div>
    </div>
  );
}

function Statusrad({ utanKlocka }: { utanKlocka: boolean }) {
  return (
    <div className="relative flex h-[13cqw] shrink-0 items-center justify-between px-[8cqw] pt-[1.5cqw] text-[length:max(0.55rem,4.4cqw)] font-semibold">
      <span className={klass(utanKlocka && "invisible")}>9:41</span>
      {/* Kameraön */}
      <span className="absolute top-[3cqw] left-1/2 h-[7cqw] w-[30cqw] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-end gap-[1cqw]">
        <span className="h-[1.6cqw] w-[1.1cqw] rounded-[0.3cqw] bg-current" />
        <span className="h-[2.4cqw] w-[1.1cqw] rounded-[0.3cqw] bg-current" />
        <span className="h-[3.2cqw] w-[1.1cqw] rounded-[0.3cqw] bg-current" />
        <span className="ml-[1.2cqw] h-[3.4cqw] w-[6.4cqw] rounded-[0.9cqw] bg-current" />
      </span>
    </div>
  );
}
