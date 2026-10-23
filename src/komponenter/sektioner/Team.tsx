import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { ankare, texter } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";
import { telefonHref, visaKontakt } from "@/lib/lankar";
import { Behallare } from "@/komponenter/ui/Behallare";
import { Platshallare } from "@/komponenter/ui/Platshallare";
import { Sektionsrubrik } from "@/komponenter/ui/Sektionsrubrik";

/**
 * "Vi som står bakom": ansikten, namn och ett nummer att ringa. För
 * målgruppen (ofta 50+, med ett okänt varumärke framför sig) är det här ofta
 * det som avgör – de köper av människor. Ligger efter priset, där frågorna
 * brukar komma.
 *
 * Allt hämtas från sajt.team. Saknas bild visas en initial, och det som
 * saknas räknas upp i en platshållare. Sektionen döljs helt om ingen har
 * kontaktuppgifter och platshållare är av (se visaKontakt).
 */
export function Team() {
  const t = texter.team;
  if (!visaKontakt()) return null;

  return (
    <section id={ankare.kontakt} aria-labelledby="team-rubrik" className="py-16 sm:py-24">
      <Behallare>
        <Sektionsrubrik id="team-rubrik" rubrik={t.rubrik} text={t.text} delad />

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-14">
          {sajt.team.map((m) => {
            const saknas = [!m.roll && t.falt.roll, !m.bild && t.falt.bild, !m.telefon && t.falt.telefon].filter(
              (f): f is string => Boolean(f),
            );
            return (
              <li key={m.namn} className="flex gap-5 rounded-3xl bg-surface p-5 shadow-kort ring-1 ring-line sm:p-6">
                {m.bild ? (
                  <Image
                    src={m.bild.src}
                    alt={m.bild.alt}
                    width={160}
                    height={160}
                    className="size-20 shrink-0 rounded-full object-cover ring-1 ring-line"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="grid size-20 shrink-0 place-items-center rounded-full bg-sand font-display text-[1.8rem] font-bold text-ink-soft"
                  >
                    {m.namn.charAt(0)}
                  </span>
                )}

                <div className="min-w-0 flex-1 self-center">
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
              </li>
            );
          })}
        </ul>
      </Behallare>
    </section>
  );
}
