import { ankare, texter } from "@/innehall/texter";
import { komIgangHref } from "@/lib/lankar";
import { Behallare } from "@/komponenter/ui/Behallare";
import { KnappLank } from "@/komponenter/ui/Knapp";
import { Sektionsrubrik } from "@/komponenter/ui/Sektionsrubrik";

/**
 * Avslutningen: en mörk yta med en enda knapp, som på vanliga SaaS-sidor.
 * Knappen leder till registreringen, eller till prisdelen tills den finns
 * (se komIgangHref). Intresseformuläret som låg här togs bort 2026-10-20.
 */
export function KomIgang() {
  const t = texter.komIgang;
  return (
    <section id={ankare.komIgang} aria-labelledby="kom-igang-rubrik" className="pb-16 sm:pb-20">
      <Behallare>
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-14 sm:px-10 sm:py-16 lg:py-20">
          {/* Varmt sken uppifrån */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-56 left-1/2 size-[44rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--farg-accent)_32%,transparent),transparent)]"
          />

          <div className="relative">
            <Sektionsrubrik id="kom-igang-rubrik" rubrik={t.rubrik} text={t.text} centrerad mork />
            <div className="mt-9 flex justify-center">
              <KnappLank href={komIgangHref()} variant="ljus" storlek="lg" pil>
                {t.cta}
              </KnappLank>
            </div>
          </div>
        </div>
      </Behallare>
    </section>
  );
}
