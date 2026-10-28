import { Demovideo } from "@/komponenter/sektioner/Demovideo";
import { Hero } from "@/komponenter/sektioner/Hero";
import { KomIgang } from "@/komponenter/sektioner/KomIgang";
import { Kundcase } from "@/komponenter/sektioner/Kundcase";
import { MobilKnappar } from "@/komponenter/sektioner/MobilKnappar";
import { Navigering } from "@/komponenter/sektioner/Navigering";
import { Pris } from "@/komponenter/sektioner/Pris";
import { Problem } from "@/komponenter/sektioner/Problem";
import { SaFungerarDet } from "@/komponenter/sektioner/SaFungerarDet";
import { Sidfot } from "@/komponenter/sektioner/Sidfot";
import { Team } from "@/komponenter/sektioner/Team";
import { VanligaFragor } from "@/komponenter/sektioner/VanligaFragor";
import { Ordmarke } from "@/komponenter/ui/Ordmarke";

/**
 * Landningssidan som en problempitch, med kort väg till erbjudandet: dina
 * kunder har inte glömt dig (Hero) → men de glömmer att boka, och du hinner
 * inte påminna alla (Problem) → så fungerar det: lätt att komma igång, och
 * uppföljningen blir gjord (SaFungerarDet) → så gick det, beviset precis före
 * priset (Kundcase) → vad kostar det → vilka är ni (Team) → frågor → kom igång.
 *
 * 2026-10-26: "Och du hinner inte påminna dem" (Vardag) togs bort och "Så
 * fungerar det" flyttades före kundcaset – tre inledande delar sa nästan samma
 * sak, och vägen till erbjudandet var för lång. 2026-10-28: "Vi har sett det
 * här förut" (Berattelse) togs bort, eftersom kundcaset berättar samma sak.
 * På mobil finns dessutom en knapprad längst ner (MobilKnappar).
 *
 * Varje sektion har ett eget jobb och förklarar inte flödet igen. Funktioner
 * och Komplement togs bort 2026-10-20 eftersom de upprepade stegen.
 */
export default function Startsida() {
  return (
    <>
      <Navigering logga={<Ordmarke />} />
      <main id="innehall">
        <Hero />
        <Problem />
        <SaFungerarDet />
        <Demovideo />
        <Kundcase />
        <Pris />
        <Team />
        <VanligaFragor />
        <KomIgang />
      </main>
      <Sidfot />
      <MobilKnappar />
    </>
  );
}
