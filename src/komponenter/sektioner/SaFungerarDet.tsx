import { ankare, texter } from "@/innehall/texter";
import { Behallare } from "@/komponenter/ui/Behallare";
import { Sektionsrubrik } from "@/komponenter/ui/Sektionsrubrik";
import { StegScroll } from "./StegScroll";
import { StegTidslinje } from "./StegTidslinje";

/**
 * De fyra stegen, styrda av scrollen. Desktop: innehållet fastnar och stegen
 * byts medan man scrollar (StegScroll). Mobil och surfplatta: stegen
 * staplade med en stegrad som fylls på (StegTidslinje).
 *
 * Mindre luft nedtill på desktop: det fasta innehållet är centrerat i
 * skärmhöjden och ger redan luft under sig.
 */
export function SaFungerarDet() {
  const t = texter.saFungerarDet;
  return (
    <section
      id={ankare.saFungerarDet}
      aria-labelledby="sa-fungerar-rubrik"
      className="border-y border-line bg-surface py-16 sm:py-20 lg:pb-8"
    >
      <Behallare>
        <Sektionsrubrik id="sa-fungerar-rubrik" rubrik={t.rubrik} />

        <div className="lg:hidden">
          <StegTidslinje />
        </div>
        <div className="hidden lg:block">
          <StegScroll />
        </div>
      </Behallare>
    </section>
  );
}
