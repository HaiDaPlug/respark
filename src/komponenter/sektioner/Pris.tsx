import { ankare, texter } from "@/innehall/texter";
import { Avsloja } from "@/komponenter/ui/Avsloja";
import { Behallare } from "@/komponenter/ui/Behallare";
import { Sektionsrubrik } from "@/komponenter/ui/Sektionsrubrik";
import { PrisKort } from "./PrisKort";

/**
 * Ett enda erbjudande i ett rent priskort, som på vanliga SaaS-sidor. Samma
 * bakgrund som sektionerna runt omkring, så att sidan flyter ihop. Beloppen
 * styrs från sajt.pris.
 */
export function Pris() {
  const t = texter.pris;
  return (
    // Sandfärgat band (2026-10-23): det vita priskortet lyfter mot det
    <section id={ankare.pris} aria-labelledby="pris-rubrik" className="bg-sand py-16 sm:py-24">
      <Behallare>
        <Sektionsrubrik id="pris-rubrik" rubrik={t.rubrik} centrerad />
        <Avsloja className="mx-auto mt-10 w-full max-w-[54rem] lg:mt-12">
          <PrisKort />
        </Avsloja>
      </Behallare>
    </section>
  );
}
