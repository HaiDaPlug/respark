import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { ankare, texter } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";
import { telefonHref, visaKontakt } from "@/lib/lankar";
import { BokaMoteKnapp } from "@/komponenter/Bokning";
import { Avsloja } from "@/komponenter/ui/Avsloja";
import { Behallare } from "@/komponenter/ui/Behallare";
import { Platshallare } from "@/komponenter/ui/Platshallare";
import { Sektionsrubrik } from "@/komponenter/ui/Sektionsrubrik";

/**
 * "Vi som står bakom": ansikten, namn och ett nummer att ringa. För
 * målgruppen (ofta 50+, med ett okänt varumärke framför sig) är det här ofta
 * det som avgör – de köper av människor. Ligger efter priset, där frågorna
 * brukar komma.
 *
 * Allt hämtas från sajt.team. Bilden är ett stort porträtt i 4:5 (halvkropp).
 * Saknas bild visas en initial i samma format, och det som
 * saknas räknas upp i en platshållare. Sektionen döljs helt om ingen har
 * kontaktuppgifter och platshållare är av (se visaKontakt).
 *
 * Korten reser sig i 3D när de kommer fram, ett i taget (Avsloja). Under
 * korten kan besökaren boka ett uppstartsmöte (2026-11-11) – visas bara när
 * sajt.uppstartsmote.url finns och platser.team är på (av sedan 2026-11-12).
 */
export function Team() {
  const t = texter.team;
  const t2 = texter.bokning;
  if (!visaKontakt()) return null;

  return (
    <section id={ankare.kontakt} aria-labelledby="team-rubrik" className="py-16 sm:py-24">
      <Behallare>
        <Sektionsrubrik id="team-rubrik" rubrik={t.rubrik} text={t.text} delad />

        {/* En kolumn upp till lg: korten har bilden bredvid texten från sm och
            behöver hela bredden för att texten inte ska bli för smal. */}
        <ul className="mt-10 grid gap-3 lg:mt-14 lg:grid-cols-2">
          {sajt.team.map((m, i) => {
            const saknas = [!m.roll && t.falt.roll, !m.bild && t.falt.bild, !m.telefon && t.falt.telefon].filter(
              (f): f is string => Boolean(f),
            );
            return (
              <li key={m.namn}>
                <Avsloja
                  fordrojning={i * 0.12}
                  className="flex h-full flex-col gap-5 rounded-3xl bg-surface p-3 shadow-kort ring-1 ring-line sm:flex-row sm:gap-6 sm:p-4"
                >
                  {/* Porträtt i 4:5 (halvkropp, så att man ser personen och inte
                      bara ett ansikte). Hela bredden på mobil, till vänster från sm.
                      Bildfilen ska vara beskuren till 4:5 med ansiktet centrerat. */}
                  {m.bild ? (
                    <Image
                      src={m.bild.src}
                      alt={m.bild.alt}
                      width={960}
                      height={1200}
                      sizes="(min-width: 1280px) 224px, (min-width: 640px) 176px, 100vw"
                      className="aspect-[4/5] w-full shrink-0 rounded-2xl object-cover sm:w-44 xl:w-56"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="grid aspect-[4/5] w-full shrink-0 place-items-center rounded-2xl bg-sand font-display text-[3rem] font-bold text-ink-soft sm:w-44 xl:w-56"
                    >
                      {m.namn.charAt(0)}
                    </span>
                  )}

                  <div className="min-w-0 flex-1 px-2 pb-3 sm:self-end sm:px-0 sm:pb-2">
                    <p className="font-display text-h3 font-bold text-ink">{m.namn}</p>
                    {m.roll && <p className="text-ink-soft">{m.roll}</p>}

                    {(m.telefon || m.epost) && (
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                        {m.telefon && (
                          <a
                            href={telefonHref(m.telefon)}
                            className="inline-flex items-center gap-2 py-1 font-semibold text-ink underline decoration-ink/25 underline-offset-[5px] transition-colors hover:decoration-ink"
                          >
                            <Phone aria-hidden className="size-4 text-accent-strong" />
                            {m.telefon}
                          </a>
                        )}
                        {m.epost && (
                          <a
                            href={`mailto:${m.epost}`}
                            className="inline-flex items-center gap-2 py-1 font-semibold text-ink underline decoration-ink/25 underline-offset-[5px] transition-colors hover:decoration-ink"
                          >
                            <Mail aria-hidden className="size-4 text-accent-strong" />
                            {t.mejla}
                          </a>
                        )}
                      </div>
                    )}

                    {sajt.visaPlatshallare && saknas.length > 0 && (
                      <Platshallare text={t.saknas(saknas)} className="mt-3" />
                    )}
                  </div>
                </Avsloja>
              </li>
            );
          })}
        </ul>

        {/* Hellre ses än ringa: boka ett uppstartsmöte */}
        {sajt.uppstartsmote.url && sajt.uppstartsmote.platser.team && (
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between lg:mt-10">
            <p className="text-lead text-ink-soft">{t2.teamRad}</p>
            <BokaMoteKnapp storlek="lg" />
          </div>
        )}
      </Behallare>
    </section>
  );
}
