"use client";

/**
 * Ett riktigt SMS från kunden i kundcaset (sajt.kundcase.sms), öppnat i en
 * telefon: avsändaren, när det gick ut och meddelandet med bokningslänken.
 * Saknas kundens SMS visas sidans eget exempel. Telefonens nedre del är
 * tom, så den tonas ut och kapas (höjden följer --sms-telefon).
 *
 * Bubblan glider in när telefonen scrollas fram. Hela bilden beskrivs för
 * skärmläsare med texten i SMS:et.
 */
import { m } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { texter } from "@/innehall/texter";
import { sajt, type KundSms as Sms } from "@/konfig/sajt";
import { Telefon } from "./Telefon";

/** Sidans eget exempel, om kundens SMS inte finns i konfigurationen. */
const EXEMPEL: Sms = {
  avsandare: texter.exempel.avsandare,
  nar: "idag",
  stycken: [texter.exempel.sms],
  lankText: "",
  lank: `https://${texter.exempel.bokningslank}`,
};

export function KundSms() {
  const sms = sajt.kundcase.sms ?? EXEMPEL;
  const beskrivning = `${texter.berattelse.beskrivning(sms.avsandare, sms.nar)} ${sms.stycken.join(" ")} ${sms.lankText} ${sms.lank}`;

  return (
    <div
      role="img"
      aria-label={beskrivning}
      className="h-[calc(var(--sms-telefon)*1.5)] w-[var(--sms-telefon)] overflow-hidden [mask-image:linear-gradient(to_bottom,black_72%,transparent)]"
    >
      <Telefon>
        <div className="flex flex-1 flex-col">
          {/* Trådens huvud: avsändaren */}
          <div className="flex items-center gap-[2.6cqw] border-b border-line px-[4cqw] pb-[3cqw]">
            <ChevronLeft aria-hidden className="size-[5cqw] text-accent-strong" strokeWidth={2.5} />
            <span className="grid size-[9cqw] place-items-center rounded-full bg-ink text-[length:max(0.55rem,4cqw)] font-bold text-white">
              {sms.avsandare.charAt(0)}
            </span>
            <div className="leading-tight">
              <p className="text-[length:max(0.62rem,4.6cqw)] font-semibold text-ink">{sms.avsandare}</p>
              <p className="text-[length:max(0.52rem,3.6cqw)] text-ink-soft">Sms · {sms.nar}</p>
            </div>
          </div>

          <m.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "0% 0%" }}
            data-avsloja
            className="mx-[4cqw] mt-[5cqw] max-w-[88%] space-y-[2.6cqw] rounded-[5cqw] rounded-tl-[1.6cqw] bg-sand px-[4cqw] py-[3.2cqw] text-[length:max(0.66rem,4.2cqw)] leading-[1.42] text-ink"
          >
            {sms.stycken.map((stycke) => (
              <p key={stycke}>{stycke}</p>
            ))}
            <p>
              {sms.lankText && (
                <>
                  {sms.lankText}
                  <br />
                </>
              )}
              <span className="font-medium break-all text-accent-strong underline decoration-accent/50 underline-offset-2">
                {sms.lank}
              </span>
            </p>
          </m.div>
        </div>
      </Telefon>
    </div>
  );
}
