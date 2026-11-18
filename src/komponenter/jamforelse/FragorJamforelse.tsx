import { texter } from "@/innehall/texter";
import { Dragspel } from "@/komponenter/sektioner/Dragspel";
import { Behallare } from "@/komponenter/ui/Behallare";
import { Sektionsrubrik } from "@/komponenter/ui/Sektionsrubrik";

/** Frågor om skillnaden (jämförelsesidan), med samma Dragspel som startsidans frågor. */
export function FragorJamforelse() {
  const t = texter.jamforelse.fragor;
  return (
    <section aria-labelledby="fragor-jamforelse-rubrik" className="py-16 sm:py-24">
      <Behallare>
        <Sektionsrubrik id="fragor-jamforelse-rubrik" rubrik={t.rubrik} delad />
        <div className="mt-10 lg:mt-14">
          <Dragspel fragor={t.lista} utkastEtikett={texter.fragor.utkast} />
        </div>
      </Behallare>
    </section>
  );
}
