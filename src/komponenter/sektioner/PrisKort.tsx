"use client";

/**
 * Priskortet, i samma enkla form som SaaS-tjänsternas prissidor (ChatGPT,
 * Claude, Lovable): planens namn, en rad om vem den passar, priset och en
 * knapp till vänster – det som ingår till höger. Två spalter från
 * surfplattebredd, så att hela kortet syns på en skärm. Ett enda kort – det
 * finns bara ett erbjudande.
 *
 * Vad som syns styrs av sajt.pris.visning:
 *
 *   "dold"       – inga belopp, bara "Pris kommer snart" (standard)
 *   "preliminar" – beloppen med etiketten "Preliminärt pris"
 *   "bekraftad"  – beloppen som slutgiltiga; knappen går till betalningen
 *                  om en betallänk finns
 *
 * Kommer besökaren via ett aktivt förbund visas förbundets namn och – när
 * beloppen syns – medlemspriset med det ordinarie priset överstruket.
 *
 * Knappen går till betalningen (bekräftat pris + betallänk) eller till
 * registreringen. Finns ingen av dem visas en platshållare i stället för en
 * knapp som inte leder någonstans.
 *
 * Under priset står det som sänker tröskeln (provperiod, ingen bindningstid).
 * (Räknaren "Räkna själv" togs bort 2026-10-24.)
 */
import { Check, Info } from "lucide-react";
import { texter } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";
import { komIgangEtikett } from "@/lib/lankar";
import { kronor, medlemspris } from "@/lib/pris";
import { KnappLank } from "@/komponenter/ui/Knapp";
import { Platshallare } from "@/komponenter/ui/Platshallare";
import { usePartner } from "@/komponenter/usePartner";

export function PrisKort() {
  const t = texter.pris;
  const pris = sajt.pris;
  const partner = usePartner();

  const visaBelopp = pris.visning !== "dold";
  const rabatt = partner?.rabattProcent ?? null;
  const visatPris = rabatt ? medlemspris(pris.ordinarie, rabatt) : pris.ordinarie;

  const betallank = partner?.betalningslank ?? sajt.lankar.betalning;
  const ctaHref = (pris.visning === "bekraftad" && betallank) || sajt.lankar.komIgang;

  return (
    <div className="grid overflow-hidden rounded-[1.75rem] bg-surface shadow-djup ring-1 ring-line md:grid-cols-2">
      <div className="flex flex-col p-7 sm:p-9">
        {partner && (
          <p className="mb-6 flex items-center gap-2 rounded-xl bg-ink px-3 py-2 text-[0.82rem] font-medium text-bg">
            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent-light" />
            {visaBelopp && rabatt ? t.medlemspris(partner.namn) : t.medlemserbjudande(partner.namn)}
          </p>
        )}

        {/* Planen */}
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <h3 className="font-display text-[1.45rem] font-bold tracking-[-0.025em] text-ink">{sajt.produktnamn}</h3>
          {pris.visning === "preliminar" && (
            <p className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-[0.74rem] font-semibold text-accent-strong">
              <Info aria-hidden className="size-3.5" />
              {t.preliminart}
            </p>
          )}
        </div>

        {/* Priset */}
        <div className="mt-7">
          {visaBelopp ? (
            <>
              <p className="flex items-end gap-2.5">
                <span className="font-display text-[3.4rem] leading-[0.85] font-extrabold tracking-[-0.05em] text-ink">
                  {kronor(visatPris)}
                </span>
                <span className="text-[0.86rem] leading-snug text-ink-soft">
                  {t.per(pris.period)}
                  <br />
                  {pris.momstext}
                </span>
              </p>
              {rabatt && (
                <p className="mt-3 text-[0.88rem] text-ink-soft">
                  {t.ordinarie} <s>{kronor(pris.ordinarie)}</s> · {t.rabatt(rabatt)}
                </p>
              )}
              <p className="mt-4 text-[0.92rem] font-semibold text-ink">
                {t.smsIngar(pris.inkluderadeSms, pris.smsPerPeriod ? pris.period : null)}
              </p>
              {pris.sparadeSms > 0 && (
                <p className="mt-1 text-[0.9rem] text-ink-soft">{t.sparade(pris.sparadeSms, pris.period)}</p>
              )}
              {pris.pafyllningPerSms !== null && (
                <p className="mt-1 text-[0.88rem] text-ink-soft">{t.pafyllning(kronor(pris.pafyllningPerSms))}</p>
              )}
            </>
          ) : (
            <>
              <p className="font-display text-[2.1rem] leading-tight font-extrabold tracking-[-0.035em] text-ink">
                {t.dold.rubrik}
              </p>
            </>
          )}
        </div>

        {/* Det som sänker tröskeln */}
        <ul className="mt-6 space-y-2.5">
          {pris.provperiodDagar ? (
            <Trygghet>{t.trygghet.provperiod(pris.provperiodDagar)}</Trygghet>
          ) : (
            sajt.visaPlatshallare && (
              <li>
                <Platshallare text={t.trygghet.provperiodSaknas} />
              </li>
            )
          )}
          {pris.ingenBindningstid && <Trygghet>{t.trygghet.bindning}</Trygghet>}
        </ul>

        {/* Knappen – längst ner i spalten, i linje med listans slut */}
        <div className="mt-auto pt-7">
          {ctaHref ? (
            <KnappLank href={ctaHref} storlek="lg" pil className="w-full">
              {komIgangEtikett()}
            </KnappLank>
          ) : (
            sajt.visaPlatshallare && <Platshallare text={t.saknarLank} />
          )}
        </div>
      </div>

      {/* Det här ingår */}
      <div className="border-t border-line bg-bg/60 p-7 sm:p-9 md:border-t-0 md:border-l">
        <p className="text-[0.86rem] font-semibold text-ink">{t.ingarRubrik}</p>
        <ul className="mt-4 space-y-3">
          {t.ingar.map((rad) => (
            <li key={rad} className="flex items-start gap-3 text-[0.95rem] text-ink">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-framgang" strokeWidth={2.6} />
              {rad}
            </li>
          ))}
        </ul>
        {visaBelopp && <p className="mt-7 text-[0.85rem] leading-relaxed text-ink-soft">{t.smsNotis}</p>}
      </div>
    </div>
  );
}

/** En rad med bock under priset, t.ex. "Ingen bindningstid – avsluta när du vill". */
function Trygghet({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-2.5 text-[0.95rem] font-semibold text-ink">
      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-framgang" strokeWidth={2.8} />
      {children}
    </li>
  );
}
