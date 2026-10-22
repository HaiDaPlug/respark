import { ArrowDown, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { texter } from "@/innehall/texter";
import { klass } from "@/lib/klass";
import { EfterScen, ForeScen } from "@/komponenter/illustrationer/ForeEfter";
import { Avsloja } from "@/komponenter/ui/Avsloja";
import { Behallare } from "@/komponenter/ui/Behallare";
import { Sektionsrubrik } from "@/komponenter/ui/Sektionsrubrik";

/**
 * Problemet besökaren känner igen, som före/efter i två levande scener:
 * en krokig väg med hinder där påminnelsen aldrig når fram, bredvid en rak
 * väg där den gör det. Bilden bär budskapet – texten är bara korta
 * etiketter. Lugn ton – ingen skuld, inget drama. (Raden med tre fördelar
 * togs bort 2026-10-20: den upprepade heron och stegen.)
 */
export function Problem() {
  const t = texter.problem;
  return (
    <section aria-labelledby="problem-rubrik" className="py-16 sm:py-20">
      <Behallare>
        <Sektionsrubrik id="problem-rubrik" rubrik={t.rubrik} text={t.text} />

        <div className="mt-10 grid gap-3 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-4">
          <Avsloja className="h-full">
            <Jamforelsekort etikett={t.fore.etikett} titel={t.fore.titel} sammanfattning={t.fore.sammanfattning}>
              <ForeScen />
            </Jamforelsekort>
          </Avsloja>
          <div aria-hidden className="flex items-center justify-center">
            <span className="grid size-11 place-items-center rounded-full bg-surface text-accent-strong shadow-kort ring-1 ring-line">
              <ArrowDown className="size-5 lg:hidden" strokeWidth={2.2} />
              <ArrowRight className="hidden size-5 lg:block" strokeWidth={2.2} />
            </span>
          </div>
          <Avsloja fordrojning={0.12} className="h-full">
            <Jamforelsekort
              etikett={t.efter.etikett}
              titel={t.efter.titel}
              sammanfattning={t.efter.sammanfattning}
              framhavd
            >
              <EfterScen />
            </Jamforelsekort>
          </Avsloja>
        </div>
      </Behallare>
    </section>
  );
}

/**
 * Ett av korten: etikett ("Före"/"Efter") och rubrik, scenen och en rad som
 * sammanfattar. "Före" är beige och dämpat, "efter" vitt och lyft.
 */
function Jamforelsekort({
  etikett,
  titel,
  sammanfattning,
  framhavd = false,
  children,
}: {
  etikett: string;
  titel: string;
  sammanfattning: string;
  framhavd?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={klass(
        "flex h-full flex-col rounded-3xl p-5 sm:p-6",
        framhavd ? "bg-surface shadow-djup ring-1 ring-accent/30" : "bg-sand/70 ring-1 ring-line",
      )}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p
          className={klass(
            "rounded-full px-3 py-1 text-[0.8rem] font-semibold",
            framhavd ? "bg-accent-strong text-white" : "bg-surface text-ink-soft ring-1 ring-line",
          )}
        >
          {etikett}
        </p>
        <h3 className={klass("text-h3 font-bold", framhavd ? "text-ink" : "text-ink-soft")}>{titel}</h3>
      </div>

      <div
        className={klass(
          "mt-4 flex flex-1 items-center rounded-2xl px-4 py-6 ring-1 sm:px-6",
          framhavd ? "bg-accent-wash ring-accent/15" : "prickmonster bg-surface/50 ring-line",
        )}
      >
        <div className="mx-auto w-full max-w-[28rem]">{children}</div>
      </div>

      <p className={klass("mt-4 font-display text-[1.05rem] font-bold", framhavd ? "text-ink" : "text-ink-soft")}>
        {sammanfattning}
      </p>
    </div>
  );
}
