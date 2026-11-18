"use client";

/**
 * Länk till startsidan som alltid hamnar högst upp, vid heron (2026-11-18).
 *
 * Varför egen länk: med en vanlig <Link href="/"> hamnade man längst ner på
 * startsidan när man kom från en annan sida (Next.js försöker scrolla till
 * sidans första element men träffade fel – troligen bokningspanelens
 * behållare med display: contents), och på startsidan själv hände ingenting
 * om man redan hade scrollat ner.
 *
 * - På startsidan: scrollar upp till toppen (mjukt, eller direkt vid
 *   reducerad rörelse) i stället för att ladda om.
 * - Från en annan sida: navigerar utan Next.js egen scroll (scroll={false})
 *   och sätter en flagga. När startsidans länk monteras ser den flaggan och
 *   ställer sidan högst upp.
 *
 * Vid omladdning och vanliga länkar påverkas ingenting (flaggan sätts bara
 * av ett klick här), så webbläsarens egen scrollåterställning fungerar som
 * vanligt.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type MouseEvent, type ReactNode } from "react";
import { useReduceradRorelse } from "@/komponenter/illustrationer/useKoppling";

/** Satt av ett klick från en annan sida; läses när nästa sida har monterats. */
let tillToppen = false;

export function StartsidaLank({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  /** Körs först, t.ex. för att stänga mobilmenyn. */
  onClick?: () => void;
}) {
  const sokvag = usePathname();
  const reducerad = useReduceradRorelse();

  // Kom vi hit via ett klick på en StartsidaLank: börja högst upp.
  useEffect(() => {
    if (!tillToppen) return;
    tillToppen = false;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  function klick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.();
    // Ny flik och liknande sköter webbläsaren själv.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (sokvag === "/") {
      e.preventDefault();
      // Släpp en eventuell scrollspärr från mobilmenyn innan vi scrollar.
      document.documentElement.style.overflow = "";
      window.scrollTo({ top: 0, behavior: reducerad ? "instant" : "smooth" });
      if (window.location.hash) history.replaceState(null, "", "/");
      return;
    }
    tillToppen = true;
  }

  return (
    <Link href="/" scroll={false} className={className} onClick={klick}>
      {children}
    </Link>
  );
}
