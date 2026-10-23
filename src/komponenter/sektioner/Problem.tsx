"use client";

/**
 * Efter heron: varför kunder inte kommer tillbaka, som en tidslinje över fyra
 * veckor. Kunden är nöjd och tänker boka igen (vecka 1), sedan fylls veckorna
 * med jobb, familj och vardag, "Boka ny tid" skjuts upp och är till slut
 * bortglömd (vecka 10). Bygger på kundcaset från Osteopaticentrum.
 *
 * Korten kommer in ett i taget när de scrollas fram, och strecket över
 * "Boka ny tid" ritas (scaleX, ingen höjd ändras). Rubriken fortsätter
 * heronas ("Dina kunder har inte glömt dig."). Ersatte 2026-10-22 före/efter-
 * scenerna (ForeEfter.tsx, finns i git-historiken).
 */
import { m } from "motion/react";
import { BriefcaseBusiness, Check, Repeat, Users } from "lucide-react";
import { ankare, texter } from "@/innehall/texter";
import { klass } from "@/lib/klass";
import { Behallare } from "@/komponenter/ui/Behallare";
import { Sektionsrubrik } from "@/komponenter/ui/Sektionsrubrik";

const IKONER = { nojd: Check, jobb: BriefcaseBusiness, familj: Users, vardag: Repeat };
const mjuk = [0.22, 1, 0.36, 1] as const;

type Bokning = (typeof texter.problem.tidslinje)[number]["bokning"];

export function Problem() {
  const t = texter.problem;
  return (
    // Sandfärgat band med vita kort (2026-10-23), för rytm mot den ljusa heron
    <section id={ankare.varfor} aria-labelledby="problem-rubrik" className="bg-sand py-16 sm:py-24">
      <Behallare>
        <Sektionsrubrik id="problem-rubrik" rubrik={t.rubrik} />

        <ol aria-label={t.beskrivning} className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {t.tidslinje.map((vecka, i) => (
            <m.li
              key={vecka.vecka}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{ duration: 0.6, delay: i * 0.14, ease: mjuk }}
              data-avsloja
              className="flex flex-col rounded-3xl bg-surface p-4 shadow-kort ring-1 ring-line sm:p-5"
            >
              <p className="text-[0.875rem] font-semibold text-ink-soft">{vecka.vecka}</p>

              <ul className="mt-3 flex flex-col gap-2">
                {vecka.handelser.map((h) => {
                  const Ikon = IKONER[h.ikon];
                  const nojd = h.ikon === "nojd";
                  return (
                    <li
                      key={h.text}
                      className={klass(
                        "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[0.9rem] font-semibold",
                        nojd ? "bg-framgang-soft text-ink" : "bg-sand/70 text-ink",
                      )}
                    >
                      <Ikon aria-hidden className={klass("size-4 shrink-0", nojd ? "text-framgang" : "text-ink-soft")} strokeWidth={2.2} />
                      {h.text}
                    </li>
                  );
                })}
              </ul>

              {/* "Boka ny tid" längst ner i kortet, oavsett hur många händelser som står ovanför */}
              <div className="mt-auto pt-6">
                <BokaNyTid tillstand={vecka.bokning} fordrojning={i * 0.14 + 0.45} />
              </div>
            </m.li>
          ))}
        </ol>
      </Behallare>
    </section>
  );
}

/**
 * Raden "Boka ny tid" som en uppgift i en att göra-lista:
 * tanker     – en tom ruta med tydlig kant, uppgiften är fortfarande på
 * skjutsUpp  – överstruken, med "Skjuts upp"
 * bortglomd  – streckad kant och blek text, med "Bortglömd"
 */
function BokaNyTid({ tillstand, fordrojning }: { tillstand: Bokning; fordrojning: number }) {
  const t = texter.problem;
  return (
    <div
      className={klass(
        // Kant (inte ring) i alla lägen: ringar kan inte streckas, och samma kant gör raderna lika höga.
        "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-[0.9rem]",
        tillstand === "tanker" && "border-ink/70 bg-bg font-semibold text-ink",
        tillstand === "skjutsUpp" && "border-line-strong bg-bg text-ink-soft",
        tillstand === "bortglomd" && "border-dashed border-ink/30 text-ink-soft italic",
      )}
    >
      <span
        aria-hidden
        className={klass(
          "size-4 shrink-0 rounded-[0.3rem] border-[1.5px]",
          tillstand === "tanker" ? "border-ink" : "border-ink/30",
          tillstand === "bortglomd" && "border-dashed",
        )}
      />
      <span className="relative">
        {t.bokaNyTid}
        {tillstand === "skjutsUpp" && (
          <m.span
            aria-hidden
            className="absolute inset-x-0 top-1/2 h-px origin-left bg-ink-soft"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: fordrojning, ease: mjuk }}
          />
        )}
      </span>
      {tillstand !== "tanker" && (
        <m.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: fordrojning + 0.3, ease: mjuk }}
          className={klass(
            "ml-auto rounded-full px-2 py-0.5 text-[0.72rem] font-semibold not-italic whitespace-nowrap",
            tillstand === "skjutsUpp" ? "bg-accent-soft text-accent-strong" : "bg-sand text-ink-soft",
          )}
        >
          {tillstand === "skjutsUpp" ? t.skjutsUpp : t.bortglomd}
        </m.span>
      )}
    </div>
  );
}
