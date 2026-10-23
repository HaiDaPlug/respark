import { ankare, texter } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";
import { kontaktTelefon } from "@/lib/lankar";
import { Behallare } from "@/komponenter/ui/Behallare";
import { Sektionsrubrik } from "@/komponenter/ui/Sektionsrubrik";
import { Dragspel } from "./Dragspel";

/**
 * Vanliga frågor. Svar markerade som utkast visas bara när platshållare är på.
 * Rubriken står överst och frågorna löper över hela bredden (editorialt, sedan
 * 2026-10-22 – tidigare rubrik i en egen vänsterspalt).
 */
export function VanligaFragor() {
  const t = texter.fragor;
  const fragor = t.lista.filter((f) => !f.utkast || sajt.visaPlatshallare);
  return (
    <section id={ankare.fragor} aria-labelledby="fragor-rubrik" className="py-16 sm:py-24">
      <Behallare>
        <Sektionsrubrik
          id="fragor-rubrik"
          rubrik={t.rubrik}
          text={t.kontakt(kontaktTelefon(), sajt.kontaktEpost) ?? undefined}
          delad
        />
        <div className="mt-10 lg:mt-14">
          <Dragspel fragor={fragor} utkastEtikett={t.utkast} />
        </div>
      </Behallare>
    </section>
  );
}
