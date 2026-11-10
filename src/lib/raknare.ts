/**
 * RÄKNARE – logiken bakom tal som räknas upp från noll (kundcasets siffror,
 * se komponenter/ui/Raknare.tsx).
 */

/**
 * Delar upp ett resultat som "36", "358" eller "+1 200 kr" i texten före,
 * talet och texten efter, så att bara talet räknas upp. null om värdet inte
 * innehåller exakt ett heltal (t.ex. "3,2" eller "2–3") – då visas det som
 * det är, utan uppräkning.
 */
export function delaTal(varde: string): { fore: string; tal: number; efter: string } | null {
  const traff = varde.match(/^(\D*?)(\d{1,3}(?:[  ]\d{3})+|\d+)(\D*)$/);
  if (!traff) return null;
  const tal = Number(traff[2].replace(/[  ]/g, ""));
  if (!Number.isSafeInteger(tal)) return null;
  return { fore: traff[1], tal, efter: traff[3] };
}

/** Skapas en gång – formateraTal anropas för varje bildruta under uppräkningen. */
const SVENSKA_TAL = new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 });

/** Skriver ett heltal som på svenska, med mellanrum mellan tusental: 1 200. */
export function formateraTal(tal: number): string {
  return SVENSKA_TAL.format(tal);
}
