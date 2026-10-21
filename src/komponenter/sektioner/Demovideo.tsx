import { texter } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";
import { Behallare } from "@/komponenter/ui/Behallare";
import { Sektionsrubrik } from "@/komponenter/ui/Sektionsrubrik";

/** Gör om en YouTube- eller Vimeo-länk till en inbäddningsadress. null om det inte går. */
function inbaddning(url: string) {
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}?rel=0`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?dnt=1`;
  return null;
}

/**
 * Förklaringsvideon. Visas bara när sajt.video.url är ifylld – vi låtsas
 * aldrig att en video finns. (Platshållaren med manus togs bort 2026-10-20:
 * manuset upprepade stegen och gjorde sidan längre.)
 */
export function Demovideo() {
  const t = texter.video;
  const url = sajt.video.url;
  if (!url) return null;

  const inbaddad = inbaddning(url);

  return (
    <section aria-labelledby="video-rubrik" className="pt-16 sm:pt-20">
      <Behallare>
        <Sektionsrubrik id="video-rubrik" etikett={t.etikett} rubrik={t.rubrik} text={t.text} centrerad />

        <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl bg-ink ring-1 ring-line">
          {inbaddad ? (
            <iframe
              src={inbaddad}
              title={t.rubrik}
              className="aspect-video w-full"
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <video src={url} controls preload="metadata" playsInline className="aspect-video w-full" />
          )}
        </div>
      </Behallare>
    </section>
  );
}
