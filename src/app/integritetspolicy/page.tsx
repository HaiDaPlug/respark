import type { Metadata } from "next";
import { sajt } from "@/konfig/sajt";
import { Juridiksida } from "@/komponenter/sektioner/Juridiksida";

export const metadata: Metadata = {
  title: `Integritetspolicy (utkast) – ${sajt.produktnamn}`,
  robots: { index: false, follow: false },
};

/**
 * UTKAST. Strukturen följer det en integritetspolicy behöver täcka. Två
 * flöden ska beskrivas: verksamheter som skapar ett konto i tjänsten, och de
 * kunduppgifter som verksamheter importerar (där vi troligen är
 * personuppgiftsbiträde och behöver ett biträdesavtal). Landningssidan
 * samlar inte in några uppgifter sedan intresseanmälan togs bort.
 */
export default function Integritetspolicy() {
  return (
    <Juridiksida
      titel="Integritetspolicy"
      ingress={`Så hanterar ${sajt.produktnamn} personuppgifter.`}
      avsnitt={[
        {
          rubrik: "Personuppgiftsansvarig",
          innehall: "[FÖRETAGSNAMN], organisationsnummer [ORG.NR], [ADRESS]. Kontakt: [E-POST].",
        },
        {
          rubrik: "Uppgifter när du skapar ett konto",
          innehall:
            "[Vilka uppgifter som samlas in vid registrering och betalning (namn, e-post, verksamhet, betaluppgifter via t.ex. Stripe), varför, rättslig grund och hur länge de sparas.]",
        },
        {
          rubrik: "Kunduppgifter som importeras i tjänsten",
          innehall:
            "[Ansvarsfördelning mellan verksamheten (personuppgiftsansvarig) och oss (personuppgiftsbiträde), biträdesavtal, vilka uppgifter som behandlas, lagring, säkerhet och radering. Inga hälsouppgifter eller behandlingsuppgifter ska behövas.]",
        },
        {
          rubrik: "SMS-utskick och avregistrering",
          innehall:
            "[Hur mottagare som inte vill ha fler meddelanden kan avregistrera sig, och hur reglerna för elektronisk marknadsföring följs.]",
        },
        {
          rubrik: "Underleverantörer",
          innehall: "[T.ex. SMS-leverantör, drift och databas – vilka de är och var uppgifterna lagras.]",
        },
        {
          rubrik: "Dina rättigheter",
          innehall:
            "[Rätt till tillgång, rättelse, radering, begränsning och invändning, samt rätten att klaga hos Integritetsskyddsmyndigheten (IMY).]",
        },
      ]}
    />
  );
}
