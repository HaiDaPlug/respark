import Image from "next/image";
import { ankare, texter } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";
import { komIgangEtikett, komIgangHref, visaKontakt } from "@/lib/lankar";
import { Avsloja } from "@/komponenter/ui/Avsloja";
import { Behallare } from "@/komponenter/ui/Behallare";
import { KnappLank } from "@/komponenter/ui/Knapp";
import { Platshallare } from "@/komponenter/ui/Platshallare";
import { Bokningsrutor } from "./Bokningsrutor";

/**
 * Kundcaset: hur det gick hos Osteopaticentrum, direkt efter historien om
 * varför Respark finns (Berattelse). Rubrik och kundens logga, resultaten som
 * stora siffror (en ruta per bokning under den första) och kundens citat med
 * bild. Sist en rad med knappen, eftersom beviset är där besökaren är som mest
 * övertygad. Allt hämtas från sajt.kundcase och visas bara när det finns där –
 * fyll bara i material som kunden har godkänt. Saknat material räknas upp i
 * en enda platshållare (när visaPlatshallare är på).
 *
 * Ligger på ett djupt skogsgrönt band (2026-10-23) – sidans tyngdpunkt, där
 * beviset finns – med vit text, vita rutor och kundens logga på en vit
 * bricka (den är själv mörkgrön). Tunna linjer och stor typografi. Kundens sms visas redan i Berattelse,
 * så här är det resultatet och förtroendet som räknas.
 */
export function Kundcase() {
  const t = texter.kundcase;
  const kc = sajt.kundcase;
  const visa = sajt.visaPlatshallare;

  // Gäller alla resultat samma mätperiod skrivs den en gång, under siffrorna.
  const gemensamPeriod =
    kc.resultat.length > 0 && kc.resultat.every((r) => r.period === kc.resultat[0].period) ? kc.resultat[0].period : null;

  const saknas = [
    !kc.citat && t.platshallare.citat,
    !kc.logotyp && t.platshallare.logotyp,
    kc.resultat.length === 0 && t.platshallare.resultat,
  ].filter(Boolean);

  return (
    <section
      aria-labelledby="kundcase-rubrik"
      className="relative isolate overflow-hidden bg-framgang-djup py-20 text-white sm:py-28"
    >
      {/* Djup: ett ljusare grönt sken uppe till höger och ett fint korn */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-72 -right-56 -z-10 size-[56rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--farg-framgang)_75%,white_8%),transparent)] opacity-70"
      />
      <div aria-hidden className="korn absolute inset-0 -z-10 opacity-[0.05] mix-blend-overlay" />
      <Behallare>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2 id="kundcase-rubrik" className="text-h2 font-bold text-white lg:col-span-7">
            {t.rubrik.fore} <span className="text-accent-light">{t.rubrik.efter}</span>
          </h2>
          <div className="max-w-[26rem] lg:col-span-4 lg:col-start-9 lg:pb-1.5">
            {kc.logotyp && (
              <span className="inline-flex rounded-2xl bg-surface px-5 py-3.5 shadow-lyft">
                <Image
                  src={kc.logotyp.src}
                  alt={kc.logotyp.alt}
                  width={kc.logotyp.bredd}
                  height={kc.logotyp.hojd}
                  className="h-10 w-auto sm:h-12"
                />
              </span>
            )}
          </div>
        </div>

        {kc.resultat.length > 0 && (
          <dl className="mt-12 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:gap-8">
            {kc.resultat.map((r, i) => (
              // dt måste stå före dd i koden; siffran flyttas upp visuellt med order.
              <div
                key={r.etikett}
                className={`flex flex-col border-t border-white/20 pt-6 ${i === 0 ? "lg:col-span-7" : "lg:col-span-4 lg:col-start-9"}`}
              >
                <dt className="order-2 mt-3 max-w-[22rem] text-lead text-white/90">{r.etikett}</dt>
                <dd
                  className={`order-1 font-display text-[clamp(3.5rem,2.4rem+4vw,6rem)] leading-[0.9] font-extrabold tracking-[-0.05em] text-white`}
                >
                  {r.varde}
                </dd>
                {r.rutor && (
                  <dd className="order-3 mt-6">
                    <Bokningsrutor antal={parseInt(r.varde, 10)} ljus />
                    <p className="mt-3 text-[0.9rem] text-white/75">{t.rutorFotnot}</p>
                  </dd>
                )}
                {!gemensamPeriod && <dd className="order-4 mt-2 text-[0.9rem] text-white/75">{r.period}</dd>}
              </div>
            ))}
          </dl>
        )}
        {gemensamPeriod && <p className="mt-6 text-[0.9rem] text-white/75">{gemensamPeriod}</p>}

        {kc.citat && (
          <Avsloja>
            <figure className="mt-16 max-w-[56rem] border-t border-white/20 pt-10 lg:mt-24">
              <blockquote className="font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.4rem)] leading-[1.2] font-semibold tracking-[-0.025em] text-white">
                ”{kc.citat.text}”
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-4">
                {kc.citat.bild && (
                  <Image
                    src={kc.citat.bild.src}
                    alt={kc.citat.bild.alt}
                    width={112}
                    height={112}
                    className="size-14 rounded-full object-cover ring-2 ring-white/25"
                  />
                )}
                <span className="leading-snug">
                  <span className="block font-semibold text-white">{kc.citat.namn}</span>
                  <span className="block text-[0.92rem] text-white/75">{kc.citat.roll}</span>
                </span>
              </figcaption>
            </figure>
          </Avsloja>
        )}

        {/* Från bevis till handling */}
        <div className="mt-14 flex flex-col gap-5 border-t border-white/20 pt-8 sm:flex-row sm:items-center sm:justify-between lg:mt-20">
          <p className="font-display text-h3 font-bold text-white">{t.cta.text}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <KnappLank href={komIgangHref()} variant="ljus" storlek="lg" pil>
              {komIgangEtikett()}
            </KnappLank>
            {visaKontakt() && (
              <a
                href={`/#${ankare.kontakt}`}
                className="py-2 font-semibold text-white underline decoration-white/35 underline-offset-[6px] transition-colors hover:decoration-white"
              >
                {t.cta.kontakt}
              </a>
            )}
          </div>
        </div>

        {kc.skarmbild && (
          <Image
            src={kc.skarmbild.src}
            alt={kc.skarmbild.alt}
            width={1200}
            height={750}
            className="mt-12 w-full rounded-3xl shadow-djup ring-1 ring-line"
          />
        )}

        {visa && saknas.length > 0 && (
          <div className="mt-10 max-w-[40rem]">
            <Platshallare text={`${t.platshallare.inledning} ${saknas.join(", ")}.`} />
          </div>
        )}
      </Behallare>
    </section>
  );
}
