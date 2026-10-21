import type { ReactNode } from "react";
import { klass } from "@/lib/klass";

/** Liten överrubrik med accentpunkt, t.ex. "Så fungerar det". */
export function Etikett({ children, mork = false, className }: { children: ReactNode; mork?: boolean; className?: string }) {
  return (
    <p
      className={klass(
        "inline-flex items-center gap-2 text-[0.82rem] font-semibold tracking-[0.01em]",
        mork ? "text-accent-light" : "text-accent-strong",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-accent" />
      {children}
    </p>
  );
}

type Props = {
  etikett: string;
  rubrik: string;
  text?: string;
  /** id på rubriken, så att sektionen kan peka på den med aria-labelledby. */
  id: string;
  centrerad?: boolean;
  mork?: boolean;
  className?: string;
};

/** Sektionens överrubrik, rubrik (h2) och ingress. */
export function Sektionsrubrik({ etikett, rubrik, text, id, centrerad, mork, className }: Props) {
  return (
    <div className={klass("max-w-[44rem]", centrerad && "mx-auto text-center", className)}>
      <Etikett mork={mork}>{etikett}</Etikett>
      <h2 id={id} className={klass("mt-3 text-h2 font-bold", mork ? "text-bg" : "text-ink")}>
        {rubrik}
      </h2>
      {text && <p className={klass("mt-4 text-lead", mork ? "text-bg/75" : "text-ink-soft")}>{text}</p>}
    </div>
  );
}
