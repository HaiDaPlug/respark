"use client";

/**
 * Knappraden längst ner på mobil och surfplatta: "Kom igång" och, när det
 * finns ett nummer, "Ring oss". Den syns när heron har scrollats förbi och
 * försvinner när avslutningen "Kom igång" kommer fram, så att den aldrig står
 * i vägen för samma knapp. Från lg finns knappen redan i menyn.
 *
 * Läget räknas från scrollen (två getBoundingClientRect per scroll) med
 * useSyncExternalStore, som menyn. Dold rad är inert, så att den inte nås
 * med tabb.
 */
import { Phone } from "lucide-react";
import { useSyncExternalStore } from "react";
import { ankare, texter } from "@/innehall/texter";
import { klass } from "@/lib/klass";
import { komIgangEtikett, komIgangHref, kontaktTelefon, telefonHref } from "@/lib/lankar";
import { KnappLank, knappKlasser } from "@/komponenter/ui/Knapp";

function lyssna(andrad: () => void) {
  window.addEventListener("scroll", andrad, { passive: true });
  window.addEventListener("resize", andrad);
  return () => {
    window.removeEventListener("scroll", andrad);
    window.removeEventListener("resize", andrad);
  };
}

/** true när heron är förbi och avslutningen ännu inte syns. */
function borSynas() {
  const hero = document.getElementById("hero-rubrik")?.closest("section");
  const slut = document.getElementById(ankare.komIgang);
  if (!hero || !slut) return false;
  return hero.getBoundingClientRect().bottom < 0 && slut.getBoundingClientRect().top > window.innerHeight;
}

export function MobilKnappar() {
  const t = texter.mobilKnappar;
  const synlig = useSyncExternalStore(lyssna, borSynas, () => false);
  const telefon = kontaktTelefon();

  return (
    <div
      inert={!synlig}
      className={klass(
        "fixed inset-x-0 bottom-0 z-40 px-4 pb-4 transition-[opacity,translate] duration-300 ease-out lg:hidden",
        synlig ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <div className="mx-auto flex max-w-md gap-2 rounded-full bg-bg/90 p-1.5 shadow-lyft ring-1 ring-line backdrop-blur-md">
        {telefon && (
          <a href={telefonHref(telefon)} className={knappKlasser("sekundar", "md", "flex-1")}>
            <Phone aria-hidden className="size-4" />
            {t.ring}
          </a>
        )}
        <KnappLank href={komIgangHref()} pil className="flex-1">
          {telefon ? t.komIgang : komIgangEtikett()}
        </KnappLank>
      </div>
    </div>
  );
}
