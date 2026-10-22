import { klass } from "@/lib/klass";

type Props = {
  rubrik: string;
  text?: string;
  /** id på rubriken, så att sektionen kan peka på den med aria-labelledby. */
  id: string;
  centrerad?: boolean;
  mork?: boolean;
  className?: string;
};

/**
 * Sektionens rubrik (h2) och ingress. Inga överrubriker ("Så fungerar det",
 * "Kundcase" …) – de togs bort 2026-10-21, rubriken räcker.
 */
export function Sektionsrubrik({ rubrik, text, id, centrerad, mork, className }: Props) {
  return (
    <div className={klass("max-w-[44rem]", centrerad && "mx-auto text-center", className)}>
      <h2 id={id} className={klass("text-h2 font-bold", mork ? "text-bg" : "text-ink")}>
        {rubrik}
      </h2>
      {text && <p className={klass("mt-4 text-lead", mork ? "text-bg/75" : "text-ink-soft")}>{text}</p>}
    </div>
  );
}
