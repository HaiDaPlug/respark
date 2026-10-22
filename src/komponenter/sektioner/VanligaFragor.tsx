import { ankare, texter } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";
import { Behallare } from "@/komponenter/ui/Behallare";
import { Sektionsrubrik } from "@/komponenter/ui/Sektionsrubrik";
import { Dragspel } from "./Dragspel";

/** Vanliga frågor. Svar markerade som utkast visas bara när platshållare är på. */
export function VanligaFragor() {
  const t = texter.fragor;
  const fragor = t.lista.filter((f) => !("utkast" in f && f.utkast) || sajt.visaPlatshallare);
  return (
    <section id={ankare.fragor} aria-labelledby="fragor-rubrik" className="py-16 sm:py-20">
      <Behallare className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Sektionsrubrik
            id="fragor-rubrik"
            rubrik={t.rubrik}
            text={sajt.kontaktEpost ? t.kontakt(sajt.kontaktEpost) : undefined}
          />
        </div>
        <Dragspel
          fragor={fragor.map((f) => ({ fraga: f.fraga, svar: f.svar, utkast: "utkast" in f && f.utkast }))}
          utkastEtikett={t.utkast}
        />
      </Behallare>
    </section>
  );
}
