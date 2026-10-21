"use client";

/**
 * Heroillustrationen: hela återaktiveringen som en kort, loopande berättelse.
 *
 *   0  Anna har inte bokat på ett tag (markerad i kundlistan)
 *   1  linjen ritas fram mot telefonen – SMS:et är på väg
 *   2  SMS:et syns i Annas telefon, statusen blir "SMS skickat"
 *   3  linjen ritas vidare och "Ny bokning" dyker upp
 *   4  statusen blir "Bokat igen"
 *
 * Bred behållare (≥ 30rem): kundlista, telefon och bokningskort bredvid
 * varandra. Smal (mobil): kundkortet överst, telefonen under och bokningen
 * ovanpå telefonen. Samma element används i båda – bara placeringen byts via
 * container queries (@min-[30rem]).
 *
 * Berättelsen pausar när illustrationen inte syns, och står still i sitt
 * slutläge för besökare som valt reducerad rörelse.
 */
import { m, useInView } from "motion/react";
import { CalendarCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { texter } from "@/innehall/texter";
import { klass } from "@/lib/klass";
import { Avatar, Exempeletikett, Fonster, Statuschip, Vaxel, type Kundstatus } from "./Delar";
import { SmsTrad, Telefon } from "./Telefon";
import { Kopplingslinje, useKoppling, useReduceradRorelse, type Sida } from "./useKoppling";

const VARAKTIGHET_MS = [1700, 850, 1500, 850, 4300];
const SLUTFAS = 4;

/** Samma brytpunkt som klasserna @min-[30rem] nedan. */
function arBred(bredd: number) {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return bredd >= 30 * rem;
}

// Stabila funktioner (se useKoppling): vilka sidor linjerna går mellan.
const sidorKundTillSms = (b: number): [Sida, Sida] | null => (arBred(b) ? ["hoger", "vanster"] : null);
const sidorKortTillTelefon = (b: number): [Sida, Sida] | null => (arBred(b) ? null : ["botten", "topp"]);
const sidorTelefonTillBokning = (b: number): [Sida, Sida] | null => (arBred(b) ? ["vanster", "hoger"] : null);

const OVRIGA_STATUS: Kundstatus[] = ["inaktiv", "skickat", "bokat"];

export function HeroIllustration() {
  const t = texter.exempel;
  const behallare = useRef<HTMLDivElement>(null);
  const kundkort = useRef<HTMLDivElement>(null);
  const annaRad = useRef<HTMLLIElement>(null);
  const telefon = useRef<HTMLDivElement>(null);
  const telefonAnkare = useRef<HTMLSpanElement>(null);
  const bubbla = useRef<HTMLDivElement>(null);
  const bokning = useRef<HTMLDivElement>(null);

  const synlig = useInView(behallare, { amount: 0.3 });
  const reducerad = useReduceradRorelse();
  const [fas, setFas] = useState(0);

  // Driver berättelsen framåt, en fas i taget, så länge illustrationen syns.
  useEffect(() => {
    if (!synlig || reducerad) return;
    const timer = window.setTimeout(() => setFas((f) => (f + 1) % (SLUTFAS + 1)), VARAKTIGHET_MS[fas]);
    return () => window.clearTimeout(timer);
  }, [fas, synlig, reducerad]);

  const visad = reducerad ? SLUTFAS : fas;
  const annaStatus: Kundstatus = visad >= 4 ? "bokat" : visad >= 2 ? "skickat" : "inaktiv";

  const linjeTillSms = useKoppling(behallare, annaRad, bubbla, sidorKundTillSms);
  const linjeTillTelefon = useKoppling(behallare, kundkort, telefon, sidorKortTillTelefon);
  const linjeTillBokning = useKoppling(behallare, telefonAnkare, bokning, sidorTelefonTillBokning);

  return (
    <div ref={behallare} role="img" aria-label={t.heroBeskrivning} className="@container relative">
      <div className="relative flex flex-col items-center pb-2 @min-[30rem]:block @min-[30rem]:h-[31.5rem] @min-[30rem]:pb-0">
        {/* Kundlistan – på mobil bara Annas rad, som ett kundkort */}
        <div
          ref={kundkort}
          className="relative z-10 w-full @min-[30rem]:absolute @min-[30rem]:top-6 @min-[30rem]:left-0 @min-[30rem]:w-[62%]"
        >
          <Fonster titel="Kunder" hoger={<Exempeletikett />}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-display text-[0.86rem] font-bold tracking-[-0.01em] text-ink">Inte bokat på 3 månader</p>
              <p className="hidden text-[0.64rem] text-ink-soft @min-[30rem]:block">{t.kunder.length} kunder</p>
            </div>

            <ul className="mt-3 overflow-hidden rounded-xl ring-1 ring-line">
              {t.kunder.map((kund, i) => (
                <li
                  key={kund.namn}
                  ref={i === 0 ? annaRad : undefined}
                  className={klass(
                    "flex items-center gap-2 px-3 py-2.5",
                    i === 0 ? "bg-accent-wash" : "hidden border-t border-line @min-[30rem]:flex",
                  )}
                >
                  {/* Avataren får bara plats när kortet är brett nog – annars kapas namnet */}
                  <span className="hidden @min-[24rem]:block">
                    <Avatar initialer={kund.initialer} framhavd={i === 0} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.73rem] font-semibold text-ink">{kund.namn}</p>
                    <p className="truncate text-[0.63rem] text-ink-soft">Senast {kund.senast}</p>
                  </div>
                  <Statuschip status={i === 0 ? annaStatus : OVRIGA_STATUS[i - 1]} />
                </li>
              ))}
            </ul>

            {/* Uppföljningen som sköter utskicken – bara i den breda versionen.
                Medvetet utan resultatsiffror: resultatet visas som Annas bokning. */}
            <div className="mt-3 hidden items-center justify-between gap-3 rounded-lg bg-bg px-3 py-2.5 @min-[30rem]:flex">
              <div className="min-w-0">
                <p className="text-[0.6rem] text-ink-soft">Automatisk uppföljning</p>
                <p className="truncate text-[0.74rem] font-semibold text-ink">Välkommen tillbaka · Aktiv</p>
              </div>
              <Vaxel pa />
            </div>
          </Fonster>
        </div>

        {/* Telefonen – på mobil beskuren nedtill */}
        <div
          ref={telefon}
          className="relative mt-10 w-[min(15.5rem,78%)] @min-[30rem]:absolute @min-[30rem]:top-14 @min-[30rem]:right-0 @min-[30rem]:mt-0 @min-[30rem]:w-[min(35%,14rem)]"
        >
          <div className="-mx-8 max-h-[19.5rem] overflow-hidden px-8 [mask-image:linear-gradient(to_bottom,black_72%,transparent)] @min-[30rem]:max-h-none @min-[30rem]:overflow-visible @min-[30rem]:[mask-image:none]">
            <Telefon>
              <SmsTrad visa={visad >= 2} bubblaRef={bubbla} />
            </Telefon>
          </div>
          <span ref={telefonAnkare} aria-hidden className="absolute bottom-[17%] left-0 size-px" />
        </div>

        {/* Ny bokning */}
        <div
          ref={bokning}
          className="absolute bottom-4 left-1/2 z-20 w-[88%] max-w-[18rem] -translate-x-1/2 @min-[30rem]:bottom-5 @min-[30rem]:left-[3%] @min-[30rem]:w-[50%] @min-[30rem]:max-w-none @min-[30rem]:translate-x-0"
        >
          <m.div
            initial={false}
            animate={visad >= 3 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 rounded-2xl bg-surface p-3 pr-4 shadow-lyft ring-1 ring-line"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong">
              <CalendarCheck aria-hidden className="size-[1.1rem]" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-[0.8rem] font-bold text-ink">{t.nyBokning.titel}</p>
                <p className="shrink-0 text-[0.6rem] font-medium whitespace-nowrap text-ink-soft">{t.nyBokning.efter}</p>
              </div>
              <p className="truncate text-[0.7rem] text-ink-soft">{t.nyBokning.text}</p>
            </div>
          </m.div>
        </div>
      </div>

      {/* Linjerna mellan stegen ritas ovanpå allt annat */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 z-30 size-full overflow-visible">
        <Kopplingslinje koppling={linjeTillSms} aktiv={visad >= 1} />
        <Kopplingslinje koppling={linjeTillTelefon} aktiv={visad >= 1} />
        <Kopplingslinje koppling={linjeTillBokning} aktiv={visad >= 3} />
      </svg>
    </div>
  );
}
