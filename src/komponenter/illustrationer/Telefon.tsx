"use client";

import { m } from "motion/react";
import { ChevronLeft } from "lucide-react";
import type { ReactNode, Ref } from "react";
import { texter } from "@/innehall/texter";
import { klass } from "@/lib/klass";

/**
 * En mobiltelefon som bild. Skärmen är en container query, så texten i
 * telefonen skalar med telefonens bredd (cqw) i stället för med fönstret –
 * samma komponent fungerar liten i heron och stor i "Så fungerar det".
 */
export function Telefon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={klass("rounded-[2.4rem] bg-ink p-[0.42rem] shadow-telefon", className)}>
      <div className="@container relative flex aspect-[9/19] flex-col overflow-hidden rounded-[2rem] bg-surface">
        <Statusrad />
        {children}
      </div>
    </div>
  );
}

function Statusrad() {
  return (
    <div className="relative flex h-[13cqw] shrink-0 items-center justify-between px-[8cqw] pt-[1.5cqw] text-[length:clamp(0.55rem,4.4cqw,0.72rem)] font-semibold text-ink">
      <span>9:41</span>
      {/* Kameraön */}
      <span className="absolute top-[3cqw] left-1/2 h-[7cqw] w-[30cqw] -translate-x-1/2 rounded-full bg-ink" />
      <span className="flex items-end gap-[1cqw]">
        <span className="h-[1.6cqw] w-[1.1cqw] rounded-[0.3cqw] bg-ink" />
        <span className="h-[2.4cqw] w-[1.1cqw] rounded-[0.3cqw] bg-ink" />
        <span className="h-[3.2cqw] w-[1.1cqw] rounded-[0.3cqw] bg-ink" />
        <span className="ml-[1.2cqw] h-[3.4cqw] w-[6.4cqw] rounded-[0.9cqw] bg-ink" />
      </span>
    </div>
  );
}

/**
 * SMS-tråden som kunden ser: avsändaren och meddelandet med bokningslänk.
 * `visa` styr om meddelandet har kommit fram. Bubblans plats är reserverad
 * även när den är dold, så att kopplingslinjerna i heron inte hoppar.
 */
export function SmsTrad({
  visa,
  bubblaRef,
  text = texter.exempel.sms,
}: {
  visa: boolean;
  bubblaRef?: Ref<HTMLDivElement>;
  text?: string;
}) {
  const t = texter.exempel;
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-[2.6cqw] border-b border-line px-[4cqw] pb-[3cqw]">
        <ChevronLeft aria-hidden className="size-[5cqw] text-accent-strong" strokeWidth={2.5} />
        <span className="grid size-[9cqw] place-items-center rounded-full bg-sand text-[length:clamp(0.5rem,3.4cqw,0.62rem)] font-bold text-ink-soft">
          DV
        </span>
        <div className="leading-tight">
          <p className="text-[length:clamp(0.6rem,4.6cqw,0.78rem)] font-semibold text-ink">{t.avsandare}</p>
          <p className="text-[length:clamp(0.52rem,3.8cqw,0.66rem)] text-ink-soft">SMS</p>
        </div>
      </div>

      <div className="flex-1 px-[4cqw] pt-[4cqw]">
        <p className="text-center text-[length:clamp(0.52rem,3.6cqw,0.64rem)] font-medium text-ink-soft">Idag 10:02</p>
        <div ref={bubblaRef} className="mt-[3cqw] max-w-[88%]">
          <m.div
            initial={false}
            animate={visa ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "0% 100%" }}
            className="rounded-[5.5cqw] rounded-bl-[1.6cqw] bg-sand px-[4cqw] py-[2.8cqw] text-[length:clamp(0.66rem,5.3cqw,0.86rem)] leading-[1.42] text-ink"
          >
            {text}{" "}
            <span className="font-semibold text-accent-strong underline decoration-accent/40 underline-offset-2">
              {t.bokningslank}
            </span>
          </m.div>
        </div>
      </div>

      {/* Skrivfältet längst ner, bara som bild */}
      <div className="px-[4cqw] pb-[5cqw]">
        <div className="flex h-[10cqw] items-center rounded-full px-[4cqw] text-[length:clamp(0.52rem,3.8cqw,0.66rem)] text-ink-faint ring-1 ring-line-strong">
          SMS
        </div>
      </div>
    </div>
  );
}
