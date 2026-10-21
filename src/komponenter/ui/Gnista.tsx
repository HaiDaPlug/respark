import { useId } from "react";
import { klass } from "@/lib/klass";
import { BLAD, GNISTA_VIEWBOX } from "./gnistaData";

/**
 * Respark-märket (gnistan) som vektor. Används ensamt i produktbildernas
 * fönster och tillsammans med ordet i Logga.tsx.
 *
 * Bladens färgövergångar behöver id:n. useId gör dem unika, eftersom
 * märket finns flera gånger på samma sida.
 */

/** Gör useId-värdet användbart i url(#…) – bara bokstäver, siffror och understreck. */
export function useOvergangsId(namn: string) {
  return `${namn}-${useId().replace(/[^\w-]/g, "")}`;
}

/** Bladen med sina färgövergångar, att lägga i en <svg> med samma koordinatsystem. */
export function GnistaBlad({ prefix }: { prefix: string }) {
  return (
    <>
      <defs>
        {BLAD.map((blad, i) => (
          <linearGradient
            key={blad.d.slice(0, 24)}
            id={`${prefix}-${i}`}
            gradientUnits="userSpaceOnUse"
            x1={blad.fran[0]}
            y1={blad.fran[1]}
            x2={blad.till[0]}
            y2={blad.till[1]}
          >
            {blad.stopp.map(([offset, farg]) => (
              <stop key={offset} offset={offset} stopColor={farg} />
            ))}
          </linearGradient>
        ))}
      </defs>
      {BLAD.map((blad, i) => (
        <path key={blad.d.slice(0, 24)} d={blad.d} fill={`url(#${prefix}-${i})`} fillRule="evenodd" />
      ))}
    </>
  );
}

export function Gnista({ className }: { className?: string }) {
  const prefix = useOvergangsId("gnista");
  return (
    <svg viewBox={GNISTA_VIEWBOX} aria-hidden className={klass("shrink-0", className)}>
      <GnistaBlad prefix={prefix} />
    </svg>
  );
}
