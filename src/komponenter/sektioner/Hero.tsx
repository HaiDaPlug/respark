import { Check } from "lucide-react";
import { ankare, texter } from "@/innehall/texter";
import { komIgangHref } from "@/lib/lankar";
import { HeroIllustration } from "@/komponenter/illustrationer/HeroIllustration";
import { Behallare } from "@/komponenter/ui/Behallare";
import { KnappLank } from "@/komponenter/ui/Knapp";
import { HeroEtikett } from "./HeroEtikett";

/**
 * Första skärmen. Rubrik, ingress och knappar till vänster, produkten till
 * höger (under texten på mobil).
 *
 * Rubriken och ingressen syns direkt utan intoning – de är sidans största
 * text (LCP) och ska målas så tidigt som möjligt. Övrigt tonas in med CSS,
 * utan att vänta på JavaScript.
 */
export function Hero() {
  const t = texter.hero;
  return (
    <section aria-labelledby="hero-rubrik" className="relative overflow-hidden pt-24 pb-14 sm:pt-28 lg:pt-32 lg:pb-20">
      {/* Mjukt varmt ljus bakom illustrationen */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 right-[-18rem] size-[54rem] rounded-full bg-[radial-gradient(closest-side,var(--color-accent-soft),transparent)] opacity-80"
      />

      <Behallare className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:gap-14">
        <div className="max-w-[36rem]">
          <div className="animate-intro">
            <HeroEtikett />
          </div>

          <h1
            id="hero-rubrik"
            className="text-display font-extrabold text-ink"
          >
            {t.rubrik.fore}{" "}
            <span className="relative inline-block text-accent-strong">
              {t.rubrik.markerad}
              <svg
                aria-hidden
                viewBox="0 0 200 14"
                preserveAspectRatio="none"
                className="absolute -bottom-[0.1em] left-0 h-[0.26em] w-full overflow-visible"
              >
                <path
                  d="M3 9.5C46 4.2 112 2.6 197 6.4"
                  fill="none"
                  stroke="var(--farg-accent)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  pathLength={1}
                  strokeDasharray="1"
                  className="animate-rita"
                />
              </svg>
            </span>{" "}
            {t.rubrik.efter}
          </h1>

          <p className="mt-5 max-w-[32rem] text-lead text-ink-soft">
            {t.ingress}
          </p>

          <div className="mt-8 flex flex-col gap-3 animate-intro [animation-delay:240ms] sm:flex-row">
            <KnappLank href={komIgangHref()} storlek="lg" pil>
              {t.primar}
            </KnappLank>
            <KnappLank href={`/#${ankare.saFungerarDet}`} variant="sekundar" storlek="lg">
              {t.sekundar}
            </KnappLank>
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5 text-[0.9rem] text-ink-soft animate-intro [animation-delay:320ms]">
            {t.punkter.map((punkt) => (
              <li key={punkt} className="flex items-center gap-2">
                <Check aria-hidden className="size-4 text-accent-strong" strokeWidth={2.5} />
                {punkt}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-intro [animation-delay:200ms]">
          <div className="yta-beige relative overflow-hidden rounded-[2rem] p-4 shadow-djup ring-1 ring-line sm:p-6">
            <div aria-hidden className="korn absolute inset-0 opacity-[0.06] mix-blend-multiply" />
            <div className="relative">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </Behallare>
    </section>
  );
}
