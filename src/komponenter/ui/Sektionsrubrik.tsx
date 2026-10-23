import { klass } from "@/lib/klass";

type Props = {
  rubrik: string;
  text?: string;
  /** id på rubriken, så att sektionen kan peka på den med aria-labelledby. */
  id: string;
  centrerad?: boolean;
  /**
   * Editorial uppdelning från lg: stor rubrik till vänster och den korta
   * ingressen nere till höger, i linje med rubrikens sista rad.
   */
  delad?: boolean;
  mork?: boolean;
  className?: string;
};

/**
 * Sektionens rubrik (h2) och ingress. Inga överrubriker ("Så fungerar det",
 * "Kundcase" …) – de togs bort 2026-10-21, rubriken räcker.
 */
export function Sektionsrubrik({ rubrik, text, id, centrerad, delad, mork, className }: Props) {
  if (delad) {
    return (
      <div className={klass("grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-8", className)}>
        <h2 id={id} className="text-h2 font-bold text-ink lg:col-span-8">
          {rubrik}
        </h2>
        {text && <p className="max-w-[26rem] text-lead text-ink-soft lg:col-span-4 lg:pb-1.5">{text}</p>}
      </div>
    );
  }

  return (
    <div className={klass("max-w-[44rem]", centrerad && "mx-auto text-center", className)}>
      <h2 id={id} className={klass("text-h2 font-bold", mork ? "text-bg" : "text-ink")}>
        {rubrik}
      </h2>
      {text && <p className={klass("mt-4 text-lead", mork ? "text-bg/75" : "text-ink-soft")}>{text}</p>}
    </div>
  );
}
