"use client";

/**
 * Produktbilderna till de tre stegen i "Så fungerar det". Varje bild spelar
 * sin lilla animation när den syns (whileInView), så samma bild fungerar både
 * i det scrollstyrda läget på desktop och i den staplade listan på mobil.
 *
 * Vardagsord och få, stora saker (2026-11-11): målgruppen är ofta 50+, så
 * texten är minst 0,82rem och varje bild visar bara det steget handlar om.
 * Inga produktord som "importera", "kolumner", "utskick" eller "uppföljning".
 * Texterna står i texter.saFungerarDet.vyer och kunderna i texter.exempel.kunder.
 *
 * Kunderna är exempel – bilderna är märkta "Exempelvy" – och bilderna visar
 * inga resultatsiffror (antal sms, bokningar eller procent). Stegen 1 och 3
 * speglar varandra: samma kunder, först "Senast här i …", sedan "Bokade …".
 */
import { m } from "motion/react";
import { CalendarDays, Check, ClipboardList, Hourglass } from "lucide-react";
import { texter } from "@/innehall/texter";
import { Avatar, Exempeletikett, Fonster } from "./Delar";

const mjuk = [0.22, 1, 0.36, 1] as const;
const enGang = { once: true, amount: 0.4 } as const;

/** Raderna med kunder kommer in en i taget. */
const rad = (i: number, start: number) => ({
  initial: { opacity: 0, y: 6 },
  whileInView: { opacity: 1, y: 0 },
  viewport: enGang,
  transition: { delay: start + i * 0.14, duration: 0.45, ease: mjuk },
});

/** Steg 1: listan från bokningssystemet läggs in, och kunderna finns på plats. */
export function KunderVy() {
  const t = texter.saFungerarDet.vyer.kunder;
  return (
    <Fonster titel={t.titel} hoger={<Exempeletikett />} className="w-full max-w-[25rem]">
      {/* Listan läggs in: ett streck fylls och "Klar" tänds */}
      <div className="flex items-center gap-3 rounded-xl bg-accent-wash p-3.5 ring-1 ring-accent/15">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface text-accent-strong shadow-kort">
          <ClipboardList aria-hidden className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.9rem] leading-snug font-semibold text-ink">{t.lista}</p>
          <div className="mt-2 flex items-center gap-2.5">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
              <m.div
                className="h-full origin-left rounded-full bg-accent"
                initial={{ scaleX: 0.04 }}
                whileInView={{ scaleX: 1 }}
                viewport={enGang}
                transition={{ duration: 1.1, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
            <m.span
              className="inline-flex items-center gap-1 text-[0.82rem] font-semibold text-framgang"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={enGang}
              transition={{ delay: 1.3, duration: 0.3 }}
            >
              <Check aria-hidden className="size-3.5" strokeWidth={3} />
              {t.klar}
            </m.span>
          </div>
        </div>
      </div>

      {/* Kunderna som kom med, och när de var hos dig senast */}
      <ul className="mt-3 space-y-2">
        {texter.exempel.kunder.map((kund, i) => (
          <m.li key={kund.namn} {...rad(i, 1.4)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 ring-line">
            <Avatar initialer={kund.initialer} framhavd={i === 0} stor />
            <div className="min-w-0">
              <p className="truncate text-[0.95rem] font-semibold text-ink">{kund.namn}</p>
              <p className="truncate text-[0.82rem] text-ink-soft">{t.senast(kund.senast)}</p>
            </div>
          </m.li>
        ))}
      </ul>
    </Fonster>
  );
}

/** Steg 2: två tillfällen att skicka på, som slås på ett i taget. Sedan sköts det av sig självt. */
export function NarVy() {
  const t = texter.saFungerarDet.vyer.nar;
  const ikoner = [CalendarDays, Hourglass];
  return (
    <Fonster titel={t.titel} hoger={<Exempeletikett />} className="w-full max-w-[25rem]">
      <ul className="space-y-2.5">
        {t.val.map((val, i) => {
          const Ikon = ikoner[i];
          return (
            <li key={val} className="flex items-center gap-3 rounded-xl bg-sand/60 p-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface text-accent-strong shadow-kort">
                <Ikon aria-hidden className="size-5" />
              </span>
              <p className="min-w-0 flex-1 text-[0.95rem] leading-snug font-semibold text-ink">{val}</p>
              <SlasPa fordrojning={0.35 + i * 0.4} />
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center gap-2.5 border-t border-line pt-3.5 text-[0.88rem] font-semibold text-ink">
        <span className="relative flex size-2.5 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-50" />
          <span className="relative size-2.5 rounded-full bg-accent" />
        </span>
        {t.sjalv}
      </div>
    </Fonster>
  );
}

/**
 * En av/på-knapp som slås på när bilden syns. Bara transform och opacity:
 * den bruna ytan tonas fram ovanpå den grå, och knoppen glider åt höger.
 */
function SlasPa({ fordrojning }: { fordrojning: number }) {
  return (
    <span aria-hidden className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-ink/15 p-0.5">
      <m.span
        className="absolute inset-0 rounded-full bg-accent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={enGang}
        transition={{ delay: fordrojning, duration: 0.25 }}
      />
      <m.span
        className="relative size-5 rounded-full bg-surface shadow-sm"
        initial={{ x: 0 }}
        whileInView={{ x: 20 }}
        viewport={enGang}
        transition={{ delay: fordrojning, type: "spring", stiffness: 500, damping: 32 }}
      />
    </span>
  );
}

/**
 * Steg 3: kunderna som bokade igen efter sms:et – samma kunder som i steg 1.
 * Medvetet utan totalsiffror (antal sms, bokningar eller procent): påhittade
 * resultat läses som ett löfte, även i en exempelvy.
 */
export function BokadeVy() {
  const t = texter.saFungerarDet.vyer.bokade;
  return (
    <Fonster titel={t.titel} hoger={<Exempeletikett />} className="w-full max-w-[25rem]">
      <p className="text-[0.88rem] text-ink-soft">{t.text}</p>
      <ul className="mt-3 space-y-2">
        {texter.exempel.kunder.map((kund, i) => (
          <m.li key={kund.namn} {...rad(i, 0.2)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 ring-line">
            <Avatar initialer={kund.initialer} framhavd={i === 0} stor />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.95rem] font-semibold text-ink">{kund.namn}</p>
              <p className="truncate text-[0.82rem] text-ink-soft">{t.bokade(kund.bokade)}</p>
            </div>
            {/* Grön bock = det blev bra */}
            <m.span
              className="grid size-8 shrink-0 place-items-center rounded-full bg-framgang text-white"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={enGang}
              transition={{ delay: 0.45 + i * 0.14, type: "spring", stiffness: 420, damping: 18 }}
            >
              <Check aria-hidden className="size-4" strokeWidth={3} />
            </m.span>
          </m.li>
        ))}
      </ul>
    </Fonster>
  );
}

/**
 * Bilderna i samma ordning som stegen i texter.saFungerarDet.steg.
 * Bara för klientkomponenter – en serverkomponent kan inte läsa en lista
 * från en "use client"-fil.
 */
export const STEGVYER = [KunderVy, NarVy, BokadeVy];
