import { Check } from "lucide-react";
import { ankare, texter } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";
import { komIgangEtikett, komIgangHref, kontaktTelefon, telefonHref } from "@/lib/lankar";
import { BokaMoteKnapp } from "@/komponenter/Bokning";
import { Behallare } from "@/komponenter/ui/Behallare";
import { Gnista3D } from "@/komponenter/ui/Gnista3D";
import { KnappLank } from "@/komponenter/ui/Knapp";

/**
 * Avslutningen: ett mörkt band över hela bredden med en stor rubrik och en
 * enda knapp. Den speglar heron (också över hela bredden, rubriken lika stor),
 * så att sidan börjar och slutar likadant. Knappen leder till registreringen,
 * eller till prisdelen tills den finns (se komIgangHref). Intresseformuläret
 * som låg här togs bort 2026-10-20.
 *
 * Under texten står det som sänker tröskeln (provperiod, ingen bindningstid),
 * och finns ett nummer kan besökaren ringa i stället. Bredvid "Kom igång"
 * kan "Boka uppstartsmöte" stå (sajt.uppstartsmote.platser.avslutning, av
 * sedan 2026-11-12).
 *
 * Till höger om rubrikens nedre rader svävar loggans gnista i 3D (Gnista3D,
 * 2026-11-10), i det varma skenet – samma gnista som flyger in i telefonen i
 * heron. Från md, där den får plats bredvid rubriken. Den sitter nedtill
 * eftersom rubrikens första rad är längst och når nästan hela vägen ut.
 */
export function KomIgang() {
  const t = texter.komIgang;
  const telefon = kontaktTelefon();
  return (
    <section
      id={ankare.komIgang}
      aria-labelledby="kom-igang-rubrik"
      className="relative isolate overflow-hidden bg-ink py-20 sm:py-28 lg:py-32"
    >
      {/* Varmt sken uppe till höger */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-64 -right-48 -z-10 size-[52rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--farg-accent)_30%,transparent),transparent)]"
      />

      <Behallare>
        <div className="relative">
          <h2 id="kom-igang-rubrik" className="max-w-[15ch] text-hero font-extrabold text-bg">
            {t.rubrik}
          </h2>
          <Gnista3D className="absolute right-0 -bottom-3 hidden size-36 md:block lg:size-48 xl:size-52" />
        </div>
        <div className="mt-10 flex flex-col gap-6 border-t border-bg/15 pt-8 sm:flex-row sm:items-end sm:justify-between lg:mt-14">
          <div>
            <p className="text-lead text-bg/75">{t.text}</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-[0.95rem] font-medium text-bg">
              {sajt.pris.provperiodDagar && <Trygghet>{texter.pris.trygghet.provperiod(sajt.pris.provperiodDagar)}</Trygghet>}
              {sajt.pris.ingenBindningstid && <Trygghet>{texter.pris.trygghet.bindning}</Trygghet>}
            </ul>
          </div>
          {/* På mobil staplade i full bredd ("Kom igång" först, "Ring oss" sist), annars på en rad */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
            {telefon && (
              <a
                href={telefonHref(telefon)}
                className="py-2 font-semibold text-bg underline decoration-bg/30 underline-offset-[6px] transition-colors hover:decoration-bg max-sm:order-last max-sm:self-center"
              >
                {texter.mobilKnappar.ring}
              </a>
            )}
            {sajt.uppstartsmote.platser.avslutning && (
              <BokaMoteKnapp variant="kontur" storlek="lg" className="max-sm:w-full" />
            )}
            <KnappLank href={komIgangHref()} variant="ljus" storlek="lg" pil className="max-sm:order-first max-sm:w-full">
              {komIgangEtikett()}
            </KnappLank>
          </div>
        </div>
      </Behallare>
    </section>
  );
}

function Trygghet({ children }: { children: string }) {
  return (
    <li className="flex items-center gap-2">
      <Check aria-hidden className="size-4 text-framgang-ljus" strokeWidth={2.8} />
      {children}
    </li>
  );
}
