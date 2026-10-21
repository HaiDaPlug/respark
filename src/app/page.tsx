import { Demovideo } from "@/komponenter/sektioner/Demovideo";
import { Hero } from "@/komponenter/sektioner/Hero";
import { KomIgang } from "@/komponenter/sektioner/KomIgang";
import { Kundcase } from "@/komponenter/sektioner/Kundcase";
import { Navigering } from "@/komponenter/sektioner/Navigering";
import { Pris } from "@/komponenter/sektioner/Pris";
import { Problem } from "@/komponenter/sektioner/Problem";
import { SaFungerarDet } from "@/komponenter/sektioner/SaFungerarDet";
import { Sidfot } from "@/komponenter/sektioner/Sidfot";
import { VanligaFragor } from "@/komponenter/sektioner/VanligaFragor";
import { Ordmarke } from "@/komponenter/ui/Ordmarke";

/**
 * Landningssidan. Ordningen följer besökarens frågor: vad får jag (fler
 * återbesök) → känner jag igen problemet → hur fungerar det → finns det på
 * riktigt → vad kostar det → frågor → kom igång.
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
        <VanligaFragor />
        <KomIgang />
      </main>
      <Sidfot />
    </>
  );
}
