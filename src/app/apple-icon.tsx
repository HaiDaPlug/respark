import { ImageResponse } from "next/og";
import { sajt } from "@/konfig/sajt";
import { gnistaSvgText, somDataUrl } from "@/komponenter/ui/loggaSvg";

/**
 * Ikonen när någon lägger sidan på hemskärmen i iOS: gnistan på sidans
 * ljusa bakgrund. iOS rundar själv av hörnen.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function HemskarmsIkon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: sajt.farger.bakgrund,
        }}
      >
        <img src={somDataUrl(gnistaSvgText())} alt="" width={118} height={118} />
      </div>
    ),
    size,
  );
}
