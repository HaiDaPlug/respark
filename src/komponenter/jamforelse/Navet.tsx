"use client";

/**
 * Respark som kärnan, med bokningssystemen i en bana runt omkring
 * (jämförelsesidans första skärm, 2026-11-17).
 *
 * Banan ser ut som en ring som lutar bakåt: systemen glider runt på en
 * ellips, och de som är längst fram blir större, skarpare och hamnar framför
 * kärnan, medan de längst bak blir mindre, blekare och hamnar bakom den.
 * Platsen räknas ut för varje bildruta (useAnimationFrame) och sätts direkt
 * som transform och opacity – inga riktiga 3D-lager, eftersom brickorna då
 * klipptes av där de korsade varandra (och Safari är känsligt för djupa
 * 3D-lager). Namnen är alltid vända mot besökaren.
 *
 * Små prickar går från varje system in till kärnan, en i taget: systemen
 * "pratar" med Respark. Kärnan är bara loggans gnista i 3D (Gnista3D).
 * Systemen visas med namn i text (sajt.jamforelse.system; loggor bara med tillstånd). Hela bilden lutar några grader åt musen
 * (useLutning), så att den får djup.
 *
 * Banan snurrar bara medan bilden syns. Vid reducerad rörelse står allt still
 * och prickarna syns inte. Bilden beskrivs med aria-label; namnen i den är
 * dolda för skärmläsare.
 */
import { m, useAnimationFrame, useInView } from "motion/react";
import Image from "next/image";
import { ClipboardList } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { texter } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";
import { klass } from "@/lib/klass";
import { useReduceradRorelse } from "@/komponenter/illustrationer/useKoppling";
import { useLutning } from "@/komponenter/illustrationer/useLutning";
import { Gnista3D } from "@/komponenter/ui/Gnista3D";

/** Ett varv runt, i sekunder. Långsamt, så att namnen går att läsa. */
const VARV_S = 60;
/** Hur platt ellipsen är (höjd / bredd). Lägre = mer lutad bakåt. */
const PLATTHET = 0.42;
/** Banans radie som andel av bildens bredd – lite mindre på smala skärmar, så att brickorna ryms. */
const radieFor = (bredd: number) => (bredd < 480 ? 0.35 : 0.4);
/** Hur länge en prick är på väg in, och hur ofta varje system skickar en. */
const PRICK_S = 2.2;
const PRICK_VAR_S = 9;
/** Storlek och synlighet längst bak → längst fram. */
const SKALA = [0.78, 1.08] as const;
const SYNLIG = [0.5, 1] as const;

export function Navet() {
  const t = texter.jamforelse.navet;
  const system = sajt.jamforelse.system;
  const reducerad = useReduceradRorelse();
  const ref = useRef<HTMLDivElement>(null);
  const iBild = useInView(ref);
  const { rotateX, rotateY } = useLutning(ref, { narmast: "section", max: 5, basX: 0, basY: 0 });

  /** Allt som sitter i banan: systemen (med logga), och kundlistan sist. */
  const delar = [
    ...system.map((s) => ({ namn: s.namn, lista: false, logga: s.logga, medNamn: s.medNamn ?? !s.logga })),
    { namn: t.kundlista, lista: true, logga: null, medNamn: true },
  ];
  const brickor = useRef<(HTMLSpanElement | null)[]>([]);
  const prickar = useRef<(HTMLSpanElement | null)[]>([]);

  // Bildens bredd, så att banan alltid ryms (mäts om när fönstret ändras).
  const [bredd, setBredd] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new ResizeObserver(([e]) => setBredd(e.contentRect.width));
    o.observe(el);
    return () => o.disconnect();
  }, []);

  /** Ställer brickorna och prickarna på plats för tiden `ms`. */
  const placera = (ms: number) => {
    if (!bredd) return;
    const r = bredd * radieFor(bredd);
    const varv = (ms / 1000 / VARV_S) * Math.PI * 2;
    delar.forEach((_, i) => {
      const vinkel = varv + (i / delar.length) * Math.PI * 2;
      const x = Math.cos(vinkel) * r;
      const y = Math.sin(vinkel) * r * PLATTHET;
      // 0 längst bak (överst i ellipsen), 1 längst fram (nederst)
      const djup = (Math.sin(vinkel) + 1) / 2;
      const bricka = brickor.current[i];
      if (bricka) {
        const skala = SKALA[0] + (SKALA[1] - SKALA[0]) * djup;
        bricka.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${skala.toFixed(3)})`;
        bricka.style.opacity = (SYNLIG[0] + (SYNLIG[1] - SYNLIG[0]) * djup).toFixed(3);
        // Framför kärnan (z 20) när den är på främre halvan
        bricka.style.zIndex = String(Math.round(djup * 40));
      }
      const prick = prickar.current[i];
      if (prick) {
        // Varje system skickar en prick var PRICK_VAR_S sekund, förskjutet så att de kommer en i taget
        const fas = ((ms / 1000 + (i * PRICK_VAR_S) / delar.length) % PRICK_VAR_S) / PRICK_S;
        if (reducerad || fas > 1) {
          prick.style.opacity = "0";
        } else {
          const mjukt = fas * fas * (3 - 2 * fas);
          prick.style.transform = `translate(-50%, -50%) translate(${(x * (1 - mjukt)).toFixed(1)}px, ${(y * (1 - mjukt)).toFixed(1)}px)`;
          prick.style.opacity = String(fas < 0.15 ? fas / 0.15 : fas > 0.85 ? (1 - fas) / 0.15 : 1);
          prick.style.zIndex = String(Math.round(djup * 40));
        }
      }
    });
  };

  useAnimationFrame((ms) => {
    if (iBild && !reducerad) placera(ms);
  });
  // Vid reducerad rörelse (och första gången) ställs allt på sin plats en gång.
  useEffect(() => {
    placera(0);
    // placera läser bara refs och bredd
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bredd, reducerad]);

  return (
    <m.div
      ref={ref}
      role="img"
      aria-label={t.beskrivning(system.map((s) => s.namn).join(", "))}
      className="relative mx-auto aspect-[1.25] w-full max-w-[36rem]"
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
    >
      {/* Varmt sken bakom kärnan */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--farg-accent)_26%,transparent),transparent)]"
      />

      {/* Banorna: två ellipser. viewBox är 200 enheter bred och bilden har förhållandet 1,25, så höjden räknas om med 1,25. */}
      <svg aria-hidden viewBox="-100 -100 200 200" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
        {[1, 0.6].map((del) => {
          const rx = radieFor(bredd || 600) * 200 * del;
          return (
            <ellipse
              key={del}
              cx="0"
              cy="0"
              rx={rx}
              ry={rx * PLATTHET * 1.25}
              fill="none"
              stroke="var(--farg-text)"
              strokeOpacity={del === 1 ? 0.18 : 0.09}
              strokeDasharray={del === 1 ? "1.5 3" : undefined}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {/* Mittpunkten som brickorna och prickarna utgår från */}
      <div className="absolute top-1/2 left-1/2">
        {delar.map((del, i) => (
          <span
            key={`prick-${del.namn}`}
            ref={(el) => {
              prickar.current[i] = el;
            }}
            aria-hidden
            className="absolute top-0 left-0 size-2 rounded-full bg-accent opacity-0 shadow-[0_0_10px_var(--farg-accent)]"
          />
        ))}
        {delar.map((del, i) => (
          <span
            key={del.namn}
            ref={(el) => {
              brickor.current[i] = el;
            }}
            aria-hidden
            className={klass(
              "absolute top-0 left-0 flex h-7 w-max items-center gap-1.5 rounded-full px-2.5 text-[0.68rem] font-semibold whitespace-nowrap shadow-kort ring-1 will-change-transform sm:h-10 sm:px-4 sm:text-[0.85rem]",
              del.lista ? "bg-accent-wash text-accent-strong ring-accent/30" : "bg-surface text-ink ring-line",
            )}
          >
            {del.lista && <ClipboardList className="size-3.5" strokeWidth={2.2} />}
            {del.logga && (
              // w-max på brickan och shrink-0 här: mittpunkten brickorna utgår från är 0 px bred, och annars trycks breda loggor ihop till ingenting.
              // Loggan i brickans höjd: en symbol blir rund och liten, ett namn i loggan får sin bredd
              <Image
                src={del.logga.src}
                alt=""
                width={del.logga.bredd}
                height={del.logga.hojd}
                unoptimized
                className={klass("w-auto shrink-0", del.medNamn ? "h-3.5 sm:h-5" : "h-3 sm:h-[1.15rem]")}
              />
            )}
            {del.medNamn && del.namn}
          </span>
        ))}

        {/* Kärnan, mellan brickorna bak och fram: bara loggans gnista (namnet under togs bort 2026-11-18) */}
        <div className="absolute top-0 left-0 z-20 -translate-x-1/2 -translate-y-[62%]">
          <Gnista3D className="size-24 sm:size-32" />
        </div>
      </div>
    </m.div>
  );
}
