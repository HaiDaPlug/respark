"use client";

import { ArrowRight } from "lucide-react";
import { ankare, texter } from "@/innehall/texter";
import { usePartner } from "@/komponenter/usePartner";

/**
 * Överrubriken i heron. Kommer besökaren via en förbundslänk (?partner=…)
 * byts den mot förbundets erbjudande med en länk till priset.
 */
export function HeroEtikett() {
  const t = texter.hero;
  const partner = usePartner();

  if (partner) {
    return (
      <a
        href={`/#${ankare.pris}`}
        className="group inline-flex max-w-full items-start gap-3 rounded-2xl bg-ink py-2.5 pr-4 pl-2.5 text-bg shadow-kort"
      >
        <span className="mt-px shrink-0 rounded-full bg-accent-light px-2 py-0.5 text-[0.72rem] font-semibold text-ink">
          Medlem
        </span>
        {/* Två rader, så att långa förbundsnamn bryts snyggt */}
        <span className="flex flex-col text-[0.86rem] leading-snug">
          <span className="font-medium">{t.partner(partner.namn)}</span>
          <span className="mt-0.5 inline-flex items-center gap-1 text-accent-light">
            {t.partnerLank}
            <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </span>
      </a>
    );
  }

  return (
    <p className="inline-flex items-center gap-2 rounded-full bg-surface/80 py-1.5 pr-3.5 pl-2 text-[0.84rem] font-medium text-ink-soft ring-1 ring-line">
      <span aria-hidden className="grid size-5 place-items-center rounded-full bg-accent-soft">
        <span className="size-1.5 rounded-full bg-accent" />
      </span>
      {t.etikett}
    </p>
  );
}
