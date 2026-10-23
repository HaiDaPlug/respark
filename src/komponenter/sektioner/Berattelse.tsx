import { texter } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";
import { KundSms } from "@/komponenter/illustrationer/KundSms";
import { Behallare } from "@/komponenter/ui/Behallare";

/**
 * Varför Respark finns: vi har sett samma problem hos Mattias på
 * Osteopaticentrum, och det är därför vi byggde det. Till vänster historien
 * i tre korta stycken, till höger hans riktiga sms (godkänt, fiktivt
 * patientnamn). Det är vändpunkten i berättelsen: från besökarens problem
 * till det vi gör (problempitch, se texter.ts). Resultaten kommer i nästa
 * sektion (Kundcase).
 */
export function Berattelse() {
  const t = texter.berattelse;
  const sista = t.stycken.length - 1;
  return (
    <section aria-labelledby="berattelse-rubrik" className="py-16 sm:py-24">
      <Behallare className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="lg:col-span-6">
          <h2 id="berattelse-rubrik" className="text-h2 font-bold text-ink">
            {t.rubrik}
          </h2>
          <div className="mt-6 max-w-[32rem] space-y-4 text-lead">
            {t.stycken.map((stycke, i) => (
              <p key={stycke} className={i === sista ? "font-semibold text-ink" : "text-ink-soft"}>
                {stycke}
              </p>
            ))}
          </div>
        </div>

        <figure className="flex flex-col items-center [--sms-telefon:min(19rem,84vw)] lg:col-span-5 lg:col-start-8">
          <KundSms />
          {sajt.kundcase.sms && (
            <figcaption className="mt-3 text-[0.9rem] text-ink-soft">{t.fotnot(sajt.kundcase.kund)}</figcaption>
          )}
        </figure>
      </Behallare>
    </section>
  );
}
