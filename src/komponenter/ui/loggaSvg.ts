import { BLAD, GNISTA_VIEWBOX } from "./gnistaData";
import { LOGGA_VIEWBOX, ORD, ORD_FARG } from "./loggaOrdData";

/*
 * Loggan som fristående SVG-text, för ställen som inte kan rendera React
 * (delningsbilden och hemskärmsikonen, där den läggs in som data-URL).
 * Samma konturer och färger som Logga.tsx och Gnista.tsx.
 */

/** Gnistans blad med färgövergångar, som SVG-text. */
function bladSvg() {
  const overgangar = BLAD.map(
    (blad, i) =>
      `<linearGradient id="g${i}" gradientUnits="userSpaceOnUse" x1="${blad.fran[0]}" y1="${blad.fran[1]}" x2="${blad.till[0]}" y2="${blad.till[1]}">` +
      blad.stopp.map(([offset, farg]) => `<stop offset="${offset}" stop-color="${farg}"/>`).join("") +
      `</linearGradient>`,
  ).join("");
  const bladen = BLAD.map((blad, i) => `<path fill="url(#g${i})" fill-rule="evenodd" d="${blad.d}"/>`).join("");
  return `<defs>${overgangar}</defs>${bladen}`;
}

/** Hela loggan: gnistan och ordet. */
export function loggaSvgText() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGGA_VIEWBOX}">${bladSvg()}<path fill="${ORD_FARG}" fill-rule="evenodd" d="${ORD}"/></svg>`;
}

/** Bara gnistan, t.ex. till hemskärmsikonen. */
export function gnistaSvgText() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${GNISTA_VIEWBOX}">${bladSvg()}</svg>`;
}

/** SVG-text som data-URL, för <img> i ImageResponse. */
export function somDataUrl(svg: string) {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** Loggans bredd delat med höjd, ur viewBox. */
export const LOGGA_FORHALLANDE = (() => {
  const [, , bredd, hojd] = LOGGA_VIEWBOX.split(" ").map(Number);
  return bredd / hojd;
})();
