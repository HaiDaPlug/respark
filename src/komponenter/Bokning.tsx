"use client";

/**
 * BOKA ETT UPPSTARTSMÖTE (2026-11-11)
 *
 * Samma upplägg som "Boka samtal" på khyte.se: en knapp öppnar en panel som
 * glider in från höger med Calendlys kalender i. Mötet och länken styrs från
 * sajt.uppstartsmote (url null = inga knappar).
 *
 * - BokningProvider ligger runt hela sidan (layout.tsx) och ritar panelen.
 *   Medan panelen är öppen är resten av sidan inert (går inte att tabba
 *   eller klicka i) och scrollar inte.
 * - BokaMoteKnapp är en vanlig länk till kalendern. Med JavaScript öppnar den
 *   panelen i stället; utan JavaScript, eller med Cmd/Ctrl-klick, öppnas
 *   kalendern i en ny flik. Knappen fungerar alltså alltid.
 * - Calendlys skript laddas först när panelen öppnas första gången, så sidan
 *   blir inte långsammare och ingen tredje part laddas innan besökaren vill.
 * - Går kalendern inte att visa (skriptet blockeras eller laddar inte inom
 *   tio sekunder) visas en knapp som öppnar den i en ny flik. Den länken finns
 *   också alltid längst ner i panelen.
 * - Escape, bakgrunden och krysset stänger. Fokus flyttas till krysset när
 *   panelen öppnas och tillbaka till knappen när den stängs.
 * - Bara transform och opacity animeras.
 */
import { CalendarDays, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { texter } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";
import { bokningsUrl } from "@/lib/bokning";
import { klass } from "@/lib/klass";
import { knappKlasser, type Knappvariant } from "@/komponenter/ui/Knapp";

/** Calendlys skript, som lägger window.Calendly. */
const CALENDLY_SKRIPT = "https://assets.calendly.com/assets/external/widget.js";
/** Hur länge vi väntar på kalendern innan reservknappen visas. */
const RESERV_MS = 10_000;

type Calendly = { initInlineWidget(val: { url: string; parentElement: HTMLElement }): void };
declare global {
  interface Window {
    Calendly?: Calendly;
  }
}

type Bokning = { oppna: (knapp: HTMLElement) => void };
const BokningContext = createContext<Bokning | null>(null);

export function BokningProvider({ children }: { children: ReactNode }) {
  const url = sajt.uppstartsmote.url;
  const [oppen, setOppen] = useState(false);
  /** Har panelen öppnats någon gång? Först då laddas kalendern. */
  const [startad, setStartad] = useState(false);
  const knapp = useRef<HTMLElement | null>(null);

  const oppna = useCallback((el: HTMLElement) => {
    knapp.current = el;
    setStartad(true);
    setOppen(true);
  }, []);
  const stang = useCallback(() => setOppen(false), []);
  const varde = useMemo(() => ({ oppna }), [oppna]);

  // När panelen har stängts: fokus tillbaka till knappen som öppnade den. Det
  // måste ske efter att sidan har slutat vara inert – ett inert element kan
  // inte få fokus – alltså i en effekt efter att ändringen har ritats.
  const varOppen = useRef(false);
  useEffect(() => {
    // Knappen i mobilmenyn finns inte kvar när menyn har stängts – då hoppas det över.
    if (varOppen.current && !oppen && knapp.current?.isConnected) knapp.current.focus();
    varOppen.current = oppen;
  }, [oppen]);

  return (
    <BokningContext.Provider value={varde}>
      {/* display: contents – påverkar inte layouten, men gör sidan inert medan panelen är öppen */}
      <div className="contents" inert={oppen}>
        {children}
      </div>
      {url && <Panel url={url} oppen={oppen} startad={startad} stang={stang} />}
    </BokningContext.Provider>
  );
}

function Panel({ url, oppen, startad, stang }: { url: string; oppen: boolean; startad: boolean; stang: () => void }) {
  const t = texter.bokning;
  const rubrikId = useId();
  const behallare = useRef<HTMLDivElement>(null);
  const stangKnapp = useRef<HTMLButtonElement>(null);
  const initierad = useRef(false);
  /** true om kalendern inte gick att visa i panelen. */
  const [fel, setFel] = useState(false);

  // Kalendern laddas först när panelen öppnas första gången.
  useEffect(() => {
    if (!startad || initierad.current) return;
    const el = behallare.current;
    if (!el) return;

    const visa = () => {
      if (initierad.current || !window.Calendly) return;
      initierad.current = true;
      window.Calendly.initInlineWidget({ url: bokningsUrl(url, sajt.farger), parentElement: el });
    };
    if (window.Calendly) {
      visa();
      return;
    }

    let skript = document.querySelector<HTMLScriptElement>(`script[src="${CALENDLY_SKRIPT}"]`);
    if (!skript) {
      skript = document.createElement("script");
      skript.src = CALENDLY_SKRIPT;
      skript.async = true;
      document.head.appendChild(skript);
    }
    const misslyckades = () => setFel(true);
    skript.addEventListener("load", visa);
    skript.addEventListener("error", misslyckades);
    const reserv = window.setTimeout(() => {
      if (!initierad.current) setFel(true);
    }, RESERV_MS);
    return () => {
      skript.removeEventListener("load", visa);
      skript.removeEventListener("error", misslyckades);
      window.clearTimeout(reserv);
    };
  }, [startad, url]);

  // Medan panelen är öppen: sidan bakom scrollar inte, Escape stänger och fokus står på krysset.
  useEffect(() => {
    if (!oppen) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    stangKnapp.current?.focus();
    const tangent = (e: KeyboardEvent) => {
      if (e.key === "Escape") stang();
    };
    document.addEventListener("keydown", tangent);
    return () => {
      html.style.overflow = "";
      document.removeEventListener("keydown", tangent);
    };
  }, [oppen, stang]);

  const nyFlikLank = "font-semibold text-ink underline decoration-ink/25 underline-offset-[5px] transition-colors hover:decoration-ink";

  return (
    <>
      {/* Bakgrunden – ett klick stänger */}
      <div
        aria-hidden
        onClick={stang}
        className={klass(
          "fixed inset-0 z-[90] bg-ink/45 transition-opacity duration-300",
          oppen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={rubrikId}
        inert={!oppen}
        className={klass(
          "fixed inset-y-0 right-0 z-[91] flex w-[min(30rem,100vw)] flex-col bg-bg",
          "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          // Skuggan bara när panelen är öppen – annars syns den som en rand i högerkanten
          oppen ? "translate-x-0 shadow-[-24px_0_80px_-20px_rgb(0_0_0/0.35)]" : "translate-x-full",
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-5 sm:px-6">
          <div>
            <p id={rubrikId} className="font-display text-[1.3rem] leading-tight font-bold tracking-[-0.02em] text-ink">
              {t.rubrik}
            </p>
            <p className="mt-1 text-[0.92rem] text-ink-soft">{t.undertext(sajt.uppstartsmote.minuter)}</p>
          </div>
          <button
            ref={stangKnapp}
            type="button"
            onClick={stang}
            aria-label={t.stang}
            className="grid size-10 shrink-0 place-items-center rounded-full text-ink ring-1 ring-line-strong transition-colors hover:bg-surface"
          >
            <X aria-hidden className="size-4" strokeWidth={2.25} />
          </button>
        </div>

        {/* Kalendern. Texten bakom syns tills Calendly har ritat sin ruta ovanpå. */}
        <div className="relative min-h-0 flex-1">
          {fel ? (
            <div className="absolute inset-0 grid place-items-center p-6">
              <a href={url} target="_blank" rel="noopener noreferrer" className={knappKlasser("primar", "lg")}>
                {t.nyFlik}
              </a>
            </div>
          ) : (
            <p className="absolute inset-0 grid place-items-center text-ink-soft">{t.laddar}</p>
          )}
          <div ref={behallare} className="relative h-full" />
        </div>

        {/* Alltid en väg ut, om någon hellre vill boka i en egen flik */}
        <div className="border-t border-line px-5 py-3 text-center text-[0.9rem] sm:px-6">
          <a href={url} target="_blank" rel="noopener noreferrer" className={nyFlikLank}>
            {t.nyFlik}
          </a>
        </div>
      </div>
    </>
  );
}

/**
 * "Boka uppstartsmöte". En vanlig länk till kalendern som öppnar panelen när
 * JavaScript finns. Cmd/Ctrl/Skift-klick och mittenklick öppnar länken som
 * vanligt. Visas inte alls om sajt.uppstartsmote.url saknas.
 *
 * vidOppning – körs när panelen öppnas, t.ex. för att stänga mobilmenyn.
 * aterfokus  – dit fokus går när panelen stängs, om inte till knappen själv
 *              (knappen i mobilmenyn finns inte kvar – då menyknappen).
 */
export function BokaMoteKnapp({
  variant = "primar",
  storlek = "md",
  className,
  children,
  vidOppning,
  aterfokus,
}: {
  variant?: Knappvariant;
  storlek?: "md" | "lg";
  className?: string;
  children?: ReactNode;
  vidOppning?: () => void;
  aterfokus?: RefObject<HTMLElement | null>;
}) {
  const bokning = useContext(BokningContext);
  const url = sajt.uppstartsmote.url;
  if (!url) return null;

  function klick(e: MouseEvent<HTMLAnchorElement>) {
    if (!bokning || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    vidOppning?.();
    bokning.oppna(aterfokus?.current ?? e.currentTarget);
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={klick}
      aria-haspopup="dialog"
      className={knappKlasser(variant, storlek, className)}
    >
      <CalendarDays aria-hidden className="size-4 shrink-0" strokeWidth={2.25} />
      {children ?? texter.bokning.knapp}
    </a>
  );
}
