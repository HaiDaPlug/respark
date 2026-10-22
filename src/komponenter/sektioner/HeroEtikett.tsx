"use client";

import { ArrowRight } from "lucide-react";
import { ankare, texter } from "@/innehall/texter";
import { usePartner } from "@/komponenter/usePartner";

/**
 * Förbundsbrickan i heron: visas bara när besökaren kommer via en
 * förbundslänk (?partner=…), med erbjudandet och en länk till priset.
 * Utan förbund visas ingenting (den vanliga överrubriken togs bort 2026-10-21).
 */
export function HeroEtikett() {
  const t = texter.hero;
  const partner = usePartner();

  if (partner) {
    return (
      <a
        href={`/#${ankare.pris}`}
        className="group mb-5 inline-flex max-w-full items-start gap-3 rounded-2xl bg-ink py-2.5 pr-4 pl-2.5 text-bg shadow-kort"
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

  return null;
}
