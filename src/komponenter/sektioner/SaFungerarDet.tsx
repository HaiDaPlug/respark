import { ankare, texter } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";
import { Behallare } from "@/komponenter/ui/Behallare";
import { Platshallare } from "@/komponenter/ui/Platshallare";
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
      className="py-16 sm:py-24 lg:pb-8"
    >
      <Behallare>
        {/* Rubriken med skillnaden mot bokningssystemet. Löftet om hjälp att komma igång står under när det är bestämt (sajt.uppstartshjalp). */}
        <Sektionsrubrik id="sa-fungerar-rubrik" rubrik={t.rubrik} text={t.text} delad />
        {sajt.uppstartshjalp ? (
          <p className="mt-5 text-lead font-semibold text-ink">{sajt.uppstartshjalp}</p>
        ) : (
          sajt.visaPlatshallare && <Platshallare text={t.uppstartSaknas} className="mt-5 max-w-[40rem]" />
        )}

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
