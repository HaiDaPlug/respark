"use client";

/**
 * Fast meny överst. Genomskinlig högst upp på sidan, får bakgrund och kant så
 * fort besökaren scrollar. Under lg blir länkarna en meny bakom en knapp.
 */
import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import { texter } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";
import { klass } from "@/lib/klass";
import { komIgangHref } from "@/lib/lankar";
import { Behallare } from "@/komponenter/ui/Behallare";
import { KnappLank } from "@/komponenter/ui/Knapp";

function lyssnaPaScroll(andrad: () => void) {
  window.addEventListener("scroll", andrad, { passive: true });
  return () => window.removeEventListener("scroll", andrad);
}

/**
 * `logga` skickas in från en serverkomponent (sidan), så att loggans
 * konturer inte hamnar i menyns JavaScript.
 */
export function Navigering({ logga }: { logga: ReactNode }) {
  const t = texter.meny;
  const [oppen, setOppen] = useState(false);
  const menyknapp = useRef<HTMLButtonElement>(null);
  const scrollad = useSyncExternalStore(
    lyssnaPaScroll,
    () => window.scrollY > 8,
    () => false,
  );

  // Medan mobilmenyn är öppen: Escape stänger, sidan bakom scrollar inte och
  // menyn stängs om fönstret blir så brett att den vanliga menyn syns.
  useEffect(() => {
    if (!oppen) return;
    const tangent = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOppen(false);
        menyknapp.current?.focus();
      }
    };
    const bred = window.matchMedia("(min-width: 64rem)");
    const narBred = () => bred.matches && setOppen(false);
    document.addEventListener("keydown", tangent);
    bred.addEventListener("change", narBred);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", tangent);
      bred.removeEventListener("change", narBred);
      document.documentElement.style.overflow = "";
    };
  }, [oppen]);

  const stang = () => setOppen(false);

  /**
   * Länkar i mobilmenyn. Medan menyn är öppen är sidan scrollspärrad, så ett
   * vanligt ankarhopp skulle stanna där det är. Därför: stäng menyn, släpp
   * spärren och scrolla sedan själv. scrollIntoView följer CSS:ens
   * scroll-behavior, alltså mjukt – eller direkt vid reducerad rörelse.
   */
  const ga = (e: MouseEvent<HTMLAnchorElement>) => {
    const hash = e.currentTarget.hash.slice(1);
    const mal = hash ? document.getElementById(hash) : null;
    setOppen(false);
    if (!mal || e.currentTarget.pathname !== window.location.pathname) return;
    e.preventDefault();
    document.documentElement.style.overflow = "";
    requestAnimationFrame(() => {
      mal.scrollIntoView();
      history.pushState(null, "", `#${hash}`);
    });
  };

  return (
    <header
      className={klass(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300",
        scrollad || oppen
          ? "bg-bg/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md backdrop-saturate-150"
          : "bg-transparent",
      )}
    >
      <Behallare className="grid h-16 grid-cols-[1fr_auto] items-center lg:h-[4.5rem] lg:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="-my-2 justify-self-start rounded-lg py-2" onClick={stang}>
          {logga}
          <span className="sr-only"> – till startsidan</span>
        </Link>

        <nav aria-label="Huvudmeny" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {t.lankar.map((lank) => (
              <li key={lank.href}>
                <a
                  href={lank.href}
                  className="rounded-full px-3.5 py-2 text-[0.94rem] font-medium text-ink-soft transition-colors hover:bg-surface/80 hover:text-ink"
                >
                  {lank.etikett}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-self-end gap-2">
          {sajt.lankar.loggaIn && (
            <a
              href={sajt.lankar.loggaIn}
              className="hidden rounded-full px-3.5 py-2 text-[0.94rem] font-medium text-ink-soft transition-colors hover:text-ink lg:inline-flex"
            >
              {t.loggaIn}
            </a>
          )}
          {/* Omslutande div: knappens egen display-klass skulle annars slå ut "hidden". */}
          <div className="hidden lg:block">
            <KnappLank href={komIgangHref()}>{t.cta}</KnappLank>
          </div>

          <button
            ref={menyknapp}
            type="button"
            aria-expanded={oppen}
            aria-controls="mobilmeny"
            onClick={() => setOppen((o) => !o)}
            className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-surface/80 lg:hidden"
          >
            {oppen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            <span className="sr-only">{oppen ? t.stang : t.oppna}</span>
          </button>
        </div>
      </Behallare>

      <AnimatePresence>
        {oppen && (
          <>
            <m.div
              aria-hidden
              className="fixed inset-x-0 top-16 bottom-0 bg-ink/25 lg:hidden"
              onClick={stang}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <m.div
              id="mobilmeny"
              className="absolute inset-x-0 top-full lg:hidden"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <Behallare className="pt-2">
                <div className="rounded-3xl bg-surface p-3 shadow-lyft ring-1 ring-line">
                  <nav aria-label="Mobilmeny">
                    <ul>
                      {t.lankar.map((lank) => (
                        <li key={lank.href}>
                          <a
                            href={lank.href}
                            onClick={ga}
                            className="flex items-center rounded-2xl px-4 py-3.5 font-display text-[1.08rem] font-semibold text-ink transition-colors hover:bg-bg"
                          >
                            {lank.etikett}
                          </a>
                        </li>
                      ))}
                      {sajt.lankar.loggaIn && (
                        <li>
                          <a
                            href={sajt.lankar.loggaIn}
                            className="flex items-center rounded-2xl px-4 py-3.5 font-display text-[1.08rem] font-semibold text-ink-soft hover:bg-bg"
                          >
                            {t.loggaIn}
                          </a>
                        </li>
                      )}
                    </ul>
                  </nav>
                  <KnappLank href={komIgangHref()} storlek="lg" pil className="mt-2 w-full" onClick={ga}>
                    {t.cta}
                  </KnappLank>
                </div>
              </Behallare>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
