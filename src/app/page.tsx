import { Demovideo } from "@/komponenter/sektioner/Demovideo";
import { Hero } from "@/komponenter/sektioner/Hero";
import { KomIgang } from "@/komponenter/sektioner/KomIgang";
import { Kundcase } from "@/komponenter/sektioner/Kundcase";
import { Berattelse } from "@/komponenter/sektioner/Berattelse";
import { MobilKnappar } from "@/komponenter/sektioner/MobilKnappar";
import { Navigering } from "@/komponenter/sektioner/Navigering";
import { Pris } from "@/komponenter/sektioner/Pris";
import { Problem } from "@/komponenter/sektioner/Problem";
import { SaFungerarDet } from "@/komponenter/sektioner/SaFungerarDet";
import { Sidfot } from "@/komponenter/sektioner/Sidfot";
import { Team } from "@/komponenter/sektioner/Team";
import { Vardag } from "@/komponenter/sektioner/Vardag";
import { VanligaFragor } from "@/komponenter/sektioner/VanligaFragor";
import { Ordmarke } from "@/komponenter/ui/Ordmarke";

/**
 * Landningssidan som en problempitch, inte en produktpitch: dina kunder har
 * inte glömt dig (Hero) → men de glömmer att boka (Problem, kundens tidslinje)
 * → och du hinner inte påminna dem (Vardag, din dag) → vi har sett det här
 * förut, hos Mattias, och därför byggde vi Respark (Berattelse) → så gick det
 * (Kundcase) → så fungerar det, i tre steg (SaFungerarDet) → vad kostar det →
 * vilka är ni (Team) → frågor → kom igång. ("Det här gör Respark åt dig" togs
 * bort 2026-10-23: den upprepade tidslinjen, berättelsen och stegen.)
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
        <Vardag />
        <Berattelse />
        <Kundcase />
        <SaFungerarDet />
        <Demovideo />
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
