"use client";

/**
 * Illustrationerna till de tre stegen i "Så fungerar det". Varje vy spelar
 * sin lilla animation när den syns (whileInView), så samma vy fungerar både i
 * det scrollstyrda läget på desktop och i den staplade listan på mobil.
 *
 * Siffror och namn är exempel – vyerna är märkta "Exempelvy".
 */
import { m } from "motion/react";
import { Check, ChevronDown, CloudUpload, FileSpreadsheet } from "lucide-react";
import { Avatar, Bildknapp, Exempeletikett, Fonster, Vaxel } from "./Delar";

const mjuk = [0.22, 1, 0.36, 1] as const;
const enGang = { once: true, amount: 0.4 } as const;

/** Steg 1: kundlistan laddas upp och kolumnerna känns igen. */
export function ImportVy() {
  return (
    <Fonster titel="Importera kunder" hoger={<Exempeletikett />} className="w-full max-w-[25rem]">
      <div className="rounded-xl border-[1.5px] border-dashed border-ink/15 bg-accent-wash px-4 py-5 text-center">
        <span className="mx-auto grid size-10 place-items-center rounded-full bg-surface text-accent-strong shadow-kort">
          <CloudUpload aria-hidden className="size-5" />
        </span>
        <p className="mt-3 text-[0.8rem] font-semibold text-ink">Släpp din kundlista här</p>
        <p className="mt-0.5 text-[0.68rem] text-ink-soft">Exporterad från ditt bokningssystem</p>
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-xl p-3 ring-1 ring-line">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sand text-ink-soft">
          <FileSpreadsheet aria-hidden className="size-[1.1rem]" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-[0.74rem] font-semibold text-ink">kundlista.csv</p>
            <m.span
              className="inline-flex items-center gap-1 text-[0.64rem] font-semibold text-accent-strong"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={enGang}
              transition={{ delay: 1.5, duration: 0.3 }}
            >
              <Check aria-hidden className="size-3" strokeWidth={3} />
              Klar
            </m.span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sand">
            <m.div
              className="h-full origin-left rounded-full bg-accent"
              initial={{ scaleX: 0.04 }}
              whileInView={{ scaleX: 1 }}
              viewport={enGang}
              transition={{ duration: 1.3, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
            />
          </div>
        </div>
      </div>

      <p className="mt-4 text-[0.66rem] font-medium text-ink-soft">Hittade kolumner</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {["Namn", "Mobilnummer", "Senaste besök"].map((kolumn, i) => (
          <m.span
            key={kolumn}
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={enGang}
            transition={{ delay: 1.55 + i * 0.12, duration: 0.35, ease: mjuk }}
            className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-[0.68rem] font-medium text-ink ring-1 ring-line"
          >
            <Check aria-hidden className="size-3 text-accent-strong" strokeWidth={3} />
            {kolumn}
          </m.span>
        ))}
      </div>

      <div className="mt-5 flex justify-end">
        <Bildknapp>Importera kunder</Bildknapp>
      </div>
    </Fonster>
  );
}

/** Steg 2: en automatisk uppföljning ställs in och slås på. */
export function UppfoljningVy() {
  const utskick = [
    { titel: "SMS 1", text: "3 månader efter senaste besöket" },
    { titel: "SMS 2", text: "En påminnelse 3 veckor senare" },
  ];
  return (
    <Fonster titel="Automatisk uppföljning" hoger={<Exempeletikett />} className="w-full max-w-[25rem]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-[0.92rem] font-bold tracking-[-0.01em] text-ink">Välkommen tillbaka</p>
          <p className="mt-0.5 text-[0.7rem] text-ink-soft">Till kunder som inte bokat på ett tag</p>
        </div>
        <Vaxel pa />
      </div>

      <div className="mt-4 rounded-xl bg-sand/70 p-3">
        <p className="text-[0.64rem] font-medium text-ink-soft">Skicka när kunden inte har bokat på</p>
        <div className="mt-1.5 flex items-center justify-between rounded-lg bg-surface px-3 py-2 text-[0.76rem] font-semibold text-ink ring-1 ring-line">
          3 månader
          <ChevronDown aria-hidden className="size-3.5 text-ink-soft" />
        </div>
      </div>

      <ol className="mt-4">
        {utskick.map((u, i) => (
          <m.li
            key={u.titel}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={enGang}
            transition={{ delay: 0.25 + i * 0.18, duration: 0.45, ease: mjuk }}
            className="relative flex gap-3 pb-3 last:pb-0"
          >
            {i < utskick.length - 1 && (
              <span aria-hidden className="absolute top-5 bottom-0 left-[0.45rem] w-px bg-line-strong" />
            )}
            <span className="relative mt-1 grid size-[0.95rem] shrink-0 place-items-center rounded-full bg-accent-soft">
              <span className="size-1.5 rounded-full bg-accent" />
            </span>
            <div>
              <p className="text-[0.74rem] font-semibold text-ink">{u.titel}</p>
              <p className="text-[0.68rem] text-ink-soft">{u.text}</p>
            </div>
          </m.li>
        ))}
      </ol>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
        <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold text-ink">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-50" />
            <span className="relative size-2 rounded-full bg-accent" />
          </span>
          Aktiv
        </span>
        <span className="text-[0.66rem] text-ink-soft">Utskicken sköts automatiskt</span>
      </div>
    </Fonster>
  );
}

/**
 * Steg 3: vilka som bokade efter ett utskick.
 *
 * Medvetet utan totalsiffror (antal SMS, bokningar, procent eller kurvor).
 * Påhittade resultatsiffror läses som en utlovad träffsäkerhet, även i en
 * exempelvy. Vyn visar i stället funktionen: utskicket och kunderna som
 * bokade efteråt.
 */
export function ResultatVy() {
  const bokningar = [
    { initialer: "AL", namn: "Anna Lindqvist", bokade: "Bokade 14 mars", efter: "2 dagar efter SMS" },
    { initialer: "JB", namn: "Johan Berg", bokade: "Bokade 17 mars", efter: "5 dagar efter SMS" },
    { initialer: "SK", namn: "Sara Karlsson", bokade: "Bokade 21 mars", efter: "9 dagar efter SMS" },
  ];

  return (
    <Fonster titel="Resultat" hoger={<Exempeletikett />} className="w-full max-w-[25rem]">
      <div className="flex items-center justify-between gap-3 rounded-xl bg-bg p-3">
        <div className="min-w-0">
          <p className="text-[0.62rem] text-ink-soft">Utskick</p>
          <p className="truncate font-display text-[0.86rem] font-bold text-ink">Välkommen tillbaka</p>
        </div>
        <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-[0.64rem] font-semibold text-ink-soft ring-1 ring-line">
          Skickat 12 mars
        </span>
      </div>

      <p className="mt-4 text-[0.66rem] font-medium text-ink-soft">Bokade efter utskicket</p>
      <ul className="mt-2 space-y-1.5">
        {bokningar.map((b, i) => (
          <m.li
            key={b.namn}
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={enGang}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.4, ease: mjuk }}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 ring-1 ring-line"
          >
            <Avatar initialer={b.initialer} framhavd={i === 0} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.74rem] font-semibold text-ink">{b.namn}</p>
              <p className="truncate text-[0.64rem] text-ink-soft">{b.bokade}</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[0.62rem] font-semibold whitespace-nowrap text-bg">
              <Check aria-hidden className="size-3 text-accent-light" strokeWidth={3} />
              {b.efter}
            </span>
          </m.li>
        ))}
      </ul>

      <p className="mt-4 border-t border-line pt-3 text-[0.64rem] text-ink-soft">
        Bokningarna matchas mot kunderna som fick SMS.
      </p>
    </Fonster>
  );
}

/**
 * Vyerna i samma ordning som stegen i texter.saFungerarDet.steg.
 * Bara för klientkomponenter – en serverkomponent kan inte läsa en lista
 * från en "use client"-fil, så SaFungerarDet bygger sin egen.
 */
export const STEGVYER = [ImportVy, UppfoljningVy, ResultatVy];
