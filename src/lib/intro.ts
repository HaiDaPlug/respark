/**
 * INTRO PÅ STARTSIDAN
 *
 * När någon kommer till startsidan visas först bara visualiseringen (telefonen
 * som en påminnelse plingar in i), sedan kommer rubriken in, och sist menyn
 * och resten. Tillståndet står i <html data-intro="…">, och CSS:en i
 * globals.css (avsnittet INTRO) döljer och visar delarna:
 *
 *   vantar         skriptet nedan har bestämt att introt ska spelas; allt i
 *                  heron och menyn är dolt tills telefonen har centrerats
 *   visualisering  bara telefonen syns, mitt på skärmen
 *   text           telefonen glider till sin plats och rubriken kommer in
 *   klar           menyn och resten tonas in
 *
 * Utan attributet (introt hoppas över) syns allt direkt. Det styrs av
 * HeroScen.tsx, som sätter tillstånden i takt med animationen.
 */
export type Introsteg = "vantar" | "visualisering" | "text" | "klar";

/** Byter introts tillstånd, men aldrig bakåt (t.ex. om besökaren redan har scrollat förbi). */
export function satIntro(steg: Introsteg) {
  const html = document.documentElement;
  const ordning: Introsteg[] = ["vantar", "visualisering", "text", "klar"];
  const nu = html.dataset.intro as Introsteg | undefined;
  if (!nu || ordning.indexOf(steg) <= ordning.indexOf(nu)) return;
  html.dataset.intro = steg;
}

/**
 * Körs i <head> innan sidan ritas, så att menyn och rubriken aldrig blinkar
 * till innan introt. Introt hoppas över:
 * - på andra sidor än startsidan och när länken pekar på en sektion (#pris …)
 * - vid reducerad rörelse
 * - när besökaren kommer från en annan sida på sajten (men inte vid omladdning)
 * Som skydd sätts "klar" efter 6 sekunder, om JavaScript inte hinner ladda.
 */
export const INTRO_SKRIPT = `(function(){try{
var d=document.documentElement,l=location;
if(l.pathname!=="/"||l.hash||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
var n=performance.getEntriesByType("navigation")[0];
if(document.referrer&&new URL(document.referrer).origin===l.origin&&!(n&&n.type==="reload"))return;
d.dataset.intro="vantar";
setTimeout(function(){d.dataset.intro="klar"},6000);
}catch(e){}})();`;
