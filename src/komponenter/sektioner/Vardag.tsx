"use client";

/**
 * Problemet från ägarens håll: dagarna är fulla av kunder, så sms:en till
 * dem som inte har bokat blir sällan av. Visas som en arbetsdag som fylls rad
 * för rad när den scrollas fram; den sista raden ("Skriva till kunder som
 * inte varit här på länge") stryks över och får "Blev inte av".
 *
 * Kommer direkt efter tidslinjen (kundens håll), så att besökaren känner igen
 * båda sidorna av problemet innan produkten nämns (problempitch, se
 * texter.ts). Bara transform och opacity animeras.
 */
import { m } from "motion/react";
import { CalendarDays } from "lucide-react";
import { texter } from "@/innehall/texter";
import { klass } from "@/lib/klass";
import { Behallare } from "@/komponenter/ui/Behallare";

const mjuk = [0.22, 1, 0.36, 1] as const;
const SYNS = { once: true, margin: "0px 0px -12% 0px" } as const;

export function Vardag() {
  const t = texter.vardag;
  const sista = t.rader.length - 1;
  const strykMed = 0.25 + sista * 0.14 + 0.5;

  return (
    <section aria-labelledby="vardag-rubrik" className="py-16 sm:py-24">
      <Behallare className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="lg:col-span-5">
          <h2 id="vardag-rubrik" className="text-h2 font-bold text-ink">
            {t.rubrik}
          </h2>
          <p className="mt-4 max-w-[26rem] text-lead text-ink-soft">{t.text}</p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="rounded-3xl bg-surface p-5 shadow-djup ring-1 ring-line sm:p-7">
            <p className="flex items-center gap-2.5 font-display text-h3 font-bold text-ink">
              <CalendarDays aria-hidden className="size-5 text-accent-strong" strokeWidth={2} />
              {t.dag}
            </p>

            <ol aria-label={t.beskrivning} className="mt-5 space-y-2">
              {t.rader.map((rad, i) => {
                const missad = "blevInteAv" in rad && rad.blevInteAv;
                return (
                  <m.li
                    key={rad.tid}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={SYNS}
                    transition={{ duration: 0.45, delay: 0.25 + i * 0.14, ease: mjuk }}
                    data-avsloja
                    className="flex items-center gap-4"
                  >
                    <span className="w-12 shrink-0 text-[0.9rem] font-semibold text-ink-soft tabular-nums">{rad.tid}</span>
                    <span
                      className={klass(
                        "flex min-w-0 flex-1 items-center gap-3 rounded-xl border px-3.5 py-2.5 text-[0.95rem]",
                        missad
                          ? "border-dashed border-ink/30 text-ink-soft"
                          : "border-transparent bg-sand/70 font-semibold text-ink",
                      )}
                    >
                      <span className="relative min-w-0">
                        {rad.text}
                        {missad && (
                          <m.span
                            aria-hidden
                            className="absolute inset-x-0 top-1/2 h-px origin-left bg-ink-soft"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={SYNS}
                            transition={{ duration: 0.5, delay: strykMed, ease: mjuk }}
                          />
                        )}
                      </span>
                      {missad && (
                        <m.span
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={SYNS}
                          transition={{ duration: 0.4, delay: strykMed + 0.35, ease: mjuk }}
                          className="ml-auto shrink-0 rounded-full bg-sand px-2.5 py-0.5 text-[0.78rem] font-semibold whitespace-nowrap text-ink-soft"
                        >
                          {t.blevInteAv}
                        </m.span>
                      )}
                    </span>
                  </m.li>
                );
              })}
            </ol>

            <p className="mt-5 text-ink-soft">{t.igen}</p>
          </div>
        </div>
      </Behallare>
    </section>
  );
}
