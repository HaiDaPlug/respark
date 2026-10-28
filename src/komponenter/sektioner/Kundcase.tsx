import Image from "next/image";
import { Quote } from "lucide-react";
import { texter } from "@/innehall/texter";
import { sajt, type Kundcase as Case } from "@/konfig/sajt";
import { Avsloja } from "@/komponenter/ui/Avsloja";
import { Behallare } from "@/komponenter/ui/Behallare";
import { Platshallare } from "@/komponenter/ui/Platshallare";

/**
 * Kundcasen: hur det har gått för kunderna, beviset precis före priset. Varje
 * case är ett kort som visar tre saker:
 * vem vi hjälpte och hur (loggan, verksamheten, problemet och det vi gjorde),
 * siffrorna och kundens egna ord. Det första kortet är stort, med siffrorna i
 * en egen panel till höger. Fler case läggs som mindre kort under, med det
 * första resultatet och citatet.
 *
 * Sidans egna färger: vita kort på den ljusa bakgrunden (priset under ligger på
 * ett sandband), stora siffror i kaffebrunt.
 * Allt hämtas från sajt.kundcase – fyll bara i material som kunden har
 * godkänt. Det som saknas i ett case räknas upp i en platshållare på kortet
 * (när visaPlatshallare är på).
 */
export function Kundcase() {
  const t = texter.kundcase;
  const [forsta, ...ovriga] = sajt.kundcase;
  if (!forsta) return null;

  return (
    <section aria-labelledby="kundcase-rubrik" className="py-20 sm:py-28">
      <Behallare>
        <h2 id="kundcase-rubrik" className="mx-auto max-w-[44rem] text-center text-h2 font-bold text-ink">
          {t.rubrik.fore} <span className="text-accent-strong">{t.rubrik.efter}</span>
        </h2>

        <Avsloja className="mt-12 lg:mt-16">
          <StortKort kc={forsta} />
        </Avsloja>

        {ovriga.length > 0 && (
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ovriga.map((kc, i) => (
              <li key={kc.kund}>
                <Avsloja fordrojning={i * 0.08} className="h-full">
                  <LitetKort kc={kc} />
                </Avsloja>
              </li>
            ))}
          </ul>
        )}
      </Behallare>
    </section>
  );
}

const SIFFRA = "font-display leading-[0.9] font-extrabold tracking-[-0.05em] text-accent-strong";

/**
 * Till vänster vem och hur, och under det citatet. Till höger en panel med
 * siffrorna. På mobil i ordningen vem och hur → siffrorna → citatet.
 */
function StortKort({ kc }: { kc: Case }) {
  const t = texter.kundcase;
  // Gäller alla resultat samma mätperiod skrivs den en gång, under siffrorna.
  const gemensamPeriod =
    kc.resultat.length > 0 && kc.resultat.every((r) => r.period === kc.resultat[0].period) ? kc.resultat[0].period : null;

  return (
    <article className="grid gap-3 rounded-[2rem] bg-surface p-3 shadow-djup lg:grid-cols-12">
      <div className="p-4 pt-5 sm:p-7 lg:col-span-7 lg:row-start-1 lg:p-9 lg:pb-0">
        <Huvud kc={kc} />
        <dl className="mt-7 grid gap-5 border-t border-line pt-6 sm:grid-cols-2 sm:gap-8">
          <div>
            <dt className="text-[0.85rem] font-semibold text-ink-soft">{t.ramar.problem}</dt>
            <dd className="mt-1.5 text-ink">{kc.problem}</dd>
          </div>
          <div>
            <dt className="text-[0.85rem] font-semibold text-ink-soft">{t.ramar.losning}</dt>
            <dd className="mt-1.5 text-ink">{kc.losning}</dd>
          </div>
        </dl>
      </div>

      {kc.resultat.length > 0 && (
        <div className="flex flex-col rounded-[1.5rem] bg-sand p-6 sm:p-8 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:p-10">
          <p className="text-[0.85rem] font-semibold text-ink-soft">{t.ramar.siffror}</p>
          <dl className="mt-5 divide-y divide-line">
            {kc.resultat.map((r) => (
              // dt måste stå före dd i koden; siffran flyttas upp visuellt med order.
              <div key={r.etikett} className="flex flex-col py-6 first:pt-0 last:pb-0">
                <dt className="order-2 mt-3 max-w-[22rem] text-ink">{r.etikett}</dt>
                <dd className={`order-1 text-[clamp(3.5rem,2.6rem+3vw,5.5rem)] ${SIFFRA}`}>{r.varde}</dd>
                {!gemensamPeriod && <dd className="order-3 mt-2 text-[0.85rem] text-ink-soft">{r.period}</dd>}
              </div>
            ))}
          </dl>
          {gemensamPeriod && <p className="mt-auto pt-8 text-[0.85rem] text-ink-soft">{gemensamPeriod}</p>}
        </div>
      )}

      {kc.citat && (
        <figure className="flex flex-col p-4 pb-5 sm:p-7 lg:col-span-7 lg:row-start-2 lg:p-9 lg:pt-10">
          <Quote aria-hidden className="size-7 text-accent" strokeWidth={2.25} />
          <blockquote className="mt-4 font-display text-[clamp(1.35rem,1.1rem+0.9vw,1.85rem)] leading-[1.3] font-semibold tracking-[-0.02em] text-ink">
            ”{kc.citat.text}”
          </blockquote>
          <Person citat={kc.citat} />
        </figure>
      )}

      <Saknas kc={kc} className="px-4 pb-4 sm:px-7 sm:pb-7 lg:col-span-12" />
    </article>
  );
}

/** Loggan, det första resultatet och citatet – för case nummer två och framåt. */
function LitetKort({ kc }: { kc: Case }) {
  const forsta = kc.resultat[0];
  return (
    <article className="flex h-full flex-col rounded-[1.75rem] bg-surface p-6 shadow-kort sm:p-7">
      <Huvud kc={kc} liten />
      {forsta && (
        <dl className="mt-5 flex flex-col border-t border-line pt-5">
          <dt className="order-2 mt-2 text-ink">{forsta.etikett}</dt>
          <dd className={`order-1 text-[clamp(2.75rem,2.2rem+1.6vw,3.5rem)] ${SIFFRA}`}>{forsta.varde}</dd>
          <dd className="order-3 mt-2 text-[0.85rem] text-ink-soft">{forsta.period}</dd>
        </dl>
      )}
      {kc.citat && (
        <figure className="mt-6 flex flex-1 flex-col">
          <blockquote className="leading-relaxed text-ink">”{kc.citat.text}”</blockquote>
          <Person citat={kc.citat} />
        </figure>
      )}
      <Saknas kc={kc} className="mt-6" />
    </article>
  );
}

/** Kortets rubrik: loggan (annars namnet) och vad kunden gör och var. */
function Huvud({ kc, liten = false }: { kc: Case; liten?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
      <h3>
        {kc.logotyp ? (
          <Image
            src={kc.logotyp.src}
            alt={kc.logotyp.alt}
            width={kc.logotyp.bredd}
            height={kc.logotyp.hojd}
            className={`w-auto ${liten ? "h-8" : "h-10 sm:h-12"}`}
          />
        ) : (
          <span className="font-display text-h3 font-bold text-ink">{kc.kund}</span>
        )}
      </h3>
      <p className="text-[0.95rem] text-ink-soft">{kc.verksamhet}</p>
    </div>
  );
}

/** Vem som sa citatet: bild och namn och roll i små piller. Hamnar längst ner när det finns plats över. */
function Person({ citat }: { citat: NonNullable<Case["citat"]> }) {
  return (
    <figcaption className="mt-auto flex items-center gap-3 pt-6">
      {citat.bild && (
        <Image
          src={citat.bild.src}
          alt={citat.bild.alt}
          width={112}
          height={112}
          className="size-11 shrink-0 rounded-full object-cover shadow-kort"
        />
      )}
      <span className="flex flex-wrap gap-2">
        <span className="rounded-full bg-sand px-3 py-1 text-[0.85rem] font-semibold text-ink">{citat.namn}</span>
        <span className="rounded-full bg-sand px-3 py-1 text-[0.85rem] text-ink-soft">{citat.roll}</span>
      </span>
    </figcaption>
  );
}

/** En platshållare per kort som räknar upp det som saknas (bara när visaPlatshallare är på). */
function Saknas({ kc, className }: { kc: Case; className?: string }) {
  const t = texter.kundcase.platshallare;
  const saknas = [!kc.citat && t.citat, !kc.logotyp && t.logotyp, kc.resultat.length === 0 && t.resultat].filter(Boolean);
  if (!sajt.visaPlatshallare || saknas.length === 0) return null;
  return (
    <div className={className}>
      <Platshallare text={`${t.inledning} ${saknas.join(", ")}.`} />
    </div>
  );
}
