import Image from "next/image";
import { Quote } from "lucide-react";
import { texter } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";
import { Avsloja } from "@/komponenter/ui/Avsloja";
import { Behallare } from "@/komponenter/ui/Behallare";
import { Platshallare } from "@/komponenter/ui/Platshallare";
import { Etikett } from "@/komponenter/ui/Sektionsrubrik";

/**
 * Berättelsen om hur produkten började hos en riktig kund. Citat, logga,
 * skärmbild och resultat visas bara när de finns i konfigurationen – och då
 * bara med kundens godkännande. Saknat material räknas upp i en enda
 * platshållare (eller syns inte alls, när visaPlatshallare är av).
 *
 * Kortet upprepar inte flödet (lista → påminnelse → bokning) – det förklaras
 * redan i stegen. Här är det berättelsen som räknas.
 */
export function Kundcase() {
  const t = texter.kundcase;
  const kc = sajt.kundcase;
  const visa = sajt.visaPlatshallare;

  const saknas = [
    !kc.citat && t.platshallare.citat,
    !kc.logotyp && t.platshallare.logotyp,
    !kc.skarmbild && t.platshallare.skarmbild,
    kc.resultat.length === 0 && t.platshallare.resultat,
  ].filter(Boolean);

  return (
    <section aria-labelledby="kundcase-rubrik" className="py-16 sm:py-20">
      <Behallare>
        <Avsloja>
          <div className="yta-beige relative grid gap-8 overflow-hidden rounded-[2rem] p-6 shadow-djup ring-1 ring-line sm:p-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-12 lg:p-12">
            <div aria-hidden className="korn absolute inset-0 opacity-[0.06] mix-blend-multiply" />
            <div className="relative">
              <Etikett>{t.etikett}</Etikett>
              <h2 id="kundcase-rubrik" className="mt-3 text-h2 font-bold text-ink">
                {t.rubrik}
              </h2>
              <p className="mt-4 text-lead text-ink-soft">{t.text}</p>

              {kc.citat && (
                <figure className="mt-7 rounded-2xl bg-surface p-6 shadow-kort ring-1 ring-line">
                  <Quote aria-hidden className="size-5 text-accent" />
                  <blockquote className="mt-3 font-display text-[1.1rem] leading-relaxed font-semibold text-ink">
                    {kc.citat.text}
                  </blockquote>
                  <figcaption className="mt-4 text-[0.9rem] text-ink-soft">
                    <span className="font-semibold text-ink">{kc.citat.namn}</span>, {kc.citat.roll}
                  </figcaption>
                </figure>
              )}
            </div>

            <div className="relative flex flex-col gap-4">
              <ol className="rounded-2xl bg-surface p-6 shadow-kort ring-1 ring-line">
                {t.ursprung.map((steg, i) => (
                  <li key={steg.titel} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < t.ursprung.length - 1 && (
                      <span aria-hidden className="absolute top-7 bottom-0 left-[0.6rem] w-px bg-line-strong" />
                    )}
                    <span
                      aria-hidden
                      className={
                        i === t.ursprung.length - 1
                          ? "relative mt-1 size-5 shrink-0 rounded-full bg-accent ring-4 ring-accent-soft"
                          : "relative mt-1 size-5 shrink-0 rounded-full bg-surface ring-2 ring-ink/15"
                      }
                    />
                    <div>
                      <p className="text-[0.78rem] font-semibold tracking-[0.04em] text-ink-soft uppercase">{steg.titel}</p>
                      <p className="mt-0.5 font-display font-semibold text-ink">{steg.text}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {kc.resultat.length > 0 && (
                <dl className="grid gap-3 sm:grid-cols-2">
                  {kc.resultat.map((r) => (
                    <div key={r.etikett} className="rounded-2xl bg-surface p-5 ring-1 ring-line">
                      <dt className="text-[0.85rem] text-ink-soft">{r.etikett}</dt>
                      <dd className="mt-1 font-display text-[1.8rem] font-bold tracking-[-0.03em] text-ink">{r.varde}</dd>
                      <dd className="text-[0.78rem] text-ink-soft">{r.period}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {(kc.logotyp || kc.skarmbild) && (
                <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-surface p-5 ring-1 ring-line">
                  {kc.logotyp && <Image src={kc.logotyp.src} alt={kc.logotyp.alt} width={160} height={48} className="h-10 w-auto" />}
                  {kc.skarmbild && (
                    <Image
                      src={kc.skarmbild.src}
                      alt={kc.skarmbild.alt}
                      width={1200}
                      height={750}
                      className="w-full rounded-xl ring-1 ring-line"
                    />
                  )}
                </div>
              )}

              {visa && saknas.length > 0 && (
                <Platshallare text={`${t.platshallare.inledning} ${saknas.join(", ")}.`} />
              )}
            </div>
          </div>
        </Avsloja>
      </Behallare>
    </section>
  );
}
