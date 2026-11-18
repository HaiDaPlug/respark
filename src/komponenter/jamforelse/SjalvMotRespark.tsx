"use client";

/**
 * Du kan göra allt själv. Eller låta Respark göra det (jämförelsesidan,
 * 2026-11-17). Ersätter funktionstabellen med "Varierar", som mest sa att
 * andra kanske också kan – och "Det här gör Respark åt dig", som sa samma
 * sak en gång till.
 *
 * Jämför jobbet, inte funktioner. Två kort:
 *   Utan Respark  sex saker ägaren måste göra själv, varje månad. Tomma
 *                 rutor som kommer fram en i taget och staplas på varandra,
 *                 och sist "Tar tid. Och det är lätt att glömma."
 *   Med Respark   en sak du gör (en gång), och sedan fem gröna bockar för
 *                 det Respark sköter. Kortet ligger lite närmare besökaren i
 *                 3D och lutar åt musen.
 *
 * Inget påstås om vad andra bokningssystem kan eller inte kan – det vänstra
 * kortet beskriver att göra det för hand. Slutläget går att förstå utan
 * rörelse; vid reducerad rörelse visas det direkt. Bara transform och
 * opacity animeras.
 */
import { m, useInView } from "motion/react";
import { Check, Clock } from "lucide-react";
import { useRef } from "react";
import { texter } from "@/innehall/texter";
import { klass } from "@/lib/klass";
import { useReduceradRorelse } from "@/komponenter/illustrationer/useKoppling";
import { useLutning } from "@/komponenter/illustrationer/useLutning";
import { Behallare } from "@/komponenter/ui/Behallare";
import { Gnista } from "@/komponenter/ui/Gnista";
import { Sektionsrubrik } from "@/komponenter/ui/Sektionsrubrik";

const mjuk = [0.22, 1, 0.36, 1] as const;
/** Sekunder mellan raderna i det vänstra kortet, och i det högra. */
const UTAN_S = 0.28;
const MED_S = 0.18;

export function SjalvMotRespark() {
  const t = texter.jamforelse.sjalv;
  const ref = useRef<HTMLDivElement>(null);
  const synlig = useInView(ref, { once: true, amount: 0.3 });
  const reducerad = useReduceradRorelse();
  const dold = !synlig && !reducerad;
  const { rotateX, rotateY } = useLutning(ref, { narmast: "section", max: 4, basX: 1, basY: -2 });

  /** En rad som kommer fram efter `fordrojning` sekunder. */
  const fram = (fordrojning: number) => ({
    initial: reducerad ? false : ({ opacity: 0, y: 10 } as const),
    animate: dold ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: mjuk, delay: reducerad ? 0 : fordrojning },
  });
  const utanSlut = t.utan.steg.length * UTAN_S;

  return (
    <section aria-labelledby="sjalv-rubrik" className="py-20 sm:py-28">
      <Behallare>
        <Sektionsrubrik id="sjalv-rubrik" rubrik={t.rubrik} text={t.text} delad />

        <div ref={ref} className="mt-10 grid items-center gap-5 lg:mt-14 lg:grid-cols-2 lg:gap-8" style={{ perspective: "1600px" }}>
          {/* Utan Respark: en lång lista att göra själv */}
          <article className="rounded-3xl bg-sand/70 p-6 ring-1 ring-line sm:p-8">
            <p className="text-[0.85rem] font-semibold text-ink-soft">{t.utan.etikett}</p>
            <h3 className="mt-2 font-display text-[1.4rem] leading-tight font-bold tracking-[-0.02em] text-ink-soft sm:text-[1.6rem]">
              {t.utan.titel}
            </h3>
            <ol className="mt-6 flex flex-col gap-2">
              {t.utan.steg.map((steg, i) => (
                <m.li
                  key={steg}
                  {...fram(i * UTAN_S)}
                  className="flex items-center gap-3 rounded-xl bg-bg/80 px-3.5 py-2.5 text-[0.95rem] text-ink ring-1 ring-line"
                >
                  <span aria-hidden className="size-4 shrink-0 rounded-[0.3rem] border-[1.5px] border-ink/30" />
                  {steg}
                </m.li>
              ))}
            </ol>
            <m.p {...fram(utanSlut)} className="mt-5 flex items-center gap-2 text-[0.9rem] font-medium text-ink-soft">
              <Clock aria-hidden className="size-4 shrink-0" />
              {t.utan.tid}
            </m.p>
          </article>

          {/* Med Respark: en sak att göra, resten sköts */}
          <m.article
            className="relative rounded-3xl bg-surface p-6 shadow-djup ring-1 ring-line sm:p-8"
            style={{ rotateX, rotateY, transformPerspective: 1600 }}
          >
            <Gnista className="absolute -top-3 -right-3 size-9 drop-shadow-[0_6px_10px_rgb(215_48_20/0.35)]" />
            <p className="text-[0.85rem] font-semibold text-detalj">{t.med.etikett}</p>
            <h3 className="mt-2 font-display text-[1.4rem] leading-tight font-bold tracking-[-0.02em] text-ink sm:text-[1.6rem]">
              {t.med.titel}
            </h3>

            {/* Det enda du gör */}
            <m.p
              {...fram(0.2)}
              className="mt-6 flex items-center gap-3 rounded-xl bg-ink px-3.5 py-3 text-[0.95rem] font-semibold text-bg"
            >
              <span aria-hidden className="grid size-5 shrink-0 place-items-center rounded-full bg-bg/15">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              {t.med.duGor}
            </m.p>

            <m.p {...fram(0.4)} className="mt-5 text-[0.9rem] font-medium text-ink-soft">
              {t.med.sedan}
            </m.p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {t.med.steg.map((steg, i) => (
                <m.li key={steg} {...fram(0.55 + i * MED_S)} className="flex items-start gap-3 text-[0.95rem] text-ink">
                  <span aria-hidden className={klass("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-framgang text-white")}>
                    <Check className="size-3" strokeWidth={3.2} />
                  </span>
                  {steg}
                </m.li>
              ))}
            </ul>
          </m.article>
        </div>
      </Behallare>
    </section>
  );
}
