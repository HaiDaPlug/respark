import type { Metadata } from "next";
import { sajt } from "@/konfig/sajt";
import { Juridiksida } from "@/komponenter/sektioner/Juridiksida";

export const metadata: Metadata = {
  title: `Användarvillkor (utkast) – ${sajt.produktnamn}`,
  robots: { index: false, follow: false },
};

/** UTKAST. Villkoren kan skrivas först när pris, period och SMS-upplägg är beslutade. */
export default function Villkor() {
  return (
    <Juridiksida
      titel="Användarvillkor"
      ingress={`Villkoren för att använda ${sajt.produktnamn}.`}
      avsnitt={[
        { rubrik: "Avtalsparter", innehall: "[FÖRETAGSNAMN], organisationsnummer [ORG.NR], och kunden." },
        {
          rubrik: "Tjänsten",
          innehall: "[Vad som ingår: import av kunduppgifter, automatiska uppföljningar, egna utskick och uppföljning av bokningar.]",
        },
        {
          rubrik: "Pris, betalning och SMS",
          innehall:
            "[Pris och betalningsperiod, moms, antal SMS som ingår, påfyllning, hur SMS-delar räknas och vad som händer med oanvända SMS.]",
        },
        { rubrik: "Avtalstid och uppsägning", innehall: "[Bindningstid, uppsägningstid och hur man säger upp.]" },
        {
          rubrik: "Kundens ansvar",
          innehall:
            "[Att verksamheten har rätt att kontakta mottagarna, följer reglerna för marknadsföring och inte skickar känsliga uppgifter i SMS.]",
        },
        { rubrik: "Ansvarsbegränsning", innehall: "[Ansvar vid driftstörningar, fel i levererade SMS och liknande.]" },
      ]}
    />
  );
}
