import { inbaddning } from "@/lib/video";
import { klass } from "@/lib/klass";

/**
 * En video i 16:9 med rundade hörn: YouTube och Vimeo bäddas in (utan
 * spårning), annat spelas som en videofil. Används av förklaringsvideon och
 * av kundvideor i kundcasen. Sätter inte bredd eller marginal själv – det
 * gör den som använder den (className).
 *
 * staende: för video filmad på höjden (t.ex. en selfie med mobilen), 9:16 i
 * stället för 16:9, så att den inte får svarta kanter.
 */
export function Videospelare({
  url,
  titel,
  staende = false,
  className,
}: {
  url: string;
  titel: string;
  staende?: boolean;
  className?: string;
}) {
  const inbaddad = inbaddning(url);
  const format = staende ? "aspect-[9/16] w-full" : "aspect-video w-full";
  return (
    <div className={klass("overflow-hidden rounded-3xl bg-ink ring-1 ring-line", className)}>
      {inbaddad ? (
        <iframe
          src={inbaddad}
          title={titel}
          className={format}
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <video src={url} title={titel} controls preload="metadata" playsInline className={format} />
      )}
    </div>
  );
}
