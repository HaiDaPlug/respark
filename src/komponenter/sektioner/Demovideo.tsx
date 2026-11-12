import { texter } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";
import { Behallare } from "@/komponenter/ui/Behallare";
import { Sektionsrubrik } from "@/komponenter/ui/Sektionsrubrik";
import { Videospelare } from "@/komponenter/ui/Videospelare";

/**
 * Förklaringsvideon. Visas bara när sajt.video.url är ifylld – vi låtsas
 * aldrig att en video finns. (Platshållaren med manus togs bort 2026-10-20:
 * manuset upprepade stegen och gjorde sidan längre.)
 */
export function Demovideo() {
  const t = texter.video;
  const url = sajt.video.url;
  if (!url) return null;

  return (
    <section aria-labelledby="video-rubrik" className="pt-16 sm:pt-20">
      <Behallare>
        <Sektionsrubrik id="video-rubrik" rubrik={t.rubrik} text={t.text} centrerad />

        <Videospelare url={url} titel={t.rubrik} className="mx-auto mt-10 max-w-4xl" />
      </Behallare>
    </section>
  );
}
