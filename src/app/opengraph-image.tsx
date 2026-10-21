import { ImageResponse } from "next/og";
import { texter } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";
import { LOGGA_FORHALLANDE, loggaSvgText, somDataUrl } from "@/komponenter/ui/loggaSvg";

/**
 * Delningsbilden (Open Graph) – byggs från konfigurationen, så den följer
 * med när namnet eller rubriken ändras. Visas när sidan delas på t.ex.
 * Facebook, LinkedIn eller i ett SMS.
 */
export const alt = texter.meta.titel;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgBild() {
  const f = sajt.farger;
  const logga = somDataUrl(loggaSvgText());
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: f.bakgrund,
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 640 }}>
          {/* Den riktiga loggan, som SVG i en data-URL */}
          <img src={logga} alt="" width={Math.round(52 * LOGGA_FORHALLANDE)} height={52} />
          <div style={{ fontSize: 66, fontWeight: 800, color: f.text, lineHeight: 1.05, letterSpacing: -2.5 }}>
            {`${texter.hero.rubrik.fore} ${texter.hero.rubrik.markerad} ${texter.hero.rubrik.efter}`}
          </div>
          <div style={{ fontSize: 26, color: f.textSekundar, lineHeight: 1.4 }}>
            {`${texter.hero.etikett}.`}
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "flex-end" }}>
          <div
            style={{
              width: 330,
              height: 470,
              borderRadius: 54,
              background: f.text,
              padding: 10,
              display: "flex",
            }}
          >
            <div
              style={{
                flex: 1,
                borderRadius: 46,
                background: f.yta,
                display: "flex",
                flexDirection: "column",
                padding: "56px 22px 22px",
                gap: 16,
              }}
            >
              <div style={{ fontSize: 18, color: f.textSekundar, textAlign: "center", display: "flex", justifyContent: "center" }}>
                Idag 10:02
              </div>
              <div
                style={{
                  background: f.sand,
                  borderRadius: 26,
                  borderBottomLeftRadius: 8,
                  padding: "16px 20px",
                  fontSize: 22,
                  lineHeight: 1.4,
                  color: f.text,
                  display: "flex",
                }}
              >
                {texter.exempel.sms}
              </div>
              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: f.yta,
                  border: `2px solid ${f.sand}`,
                  borderRadius: 20,
                  padding: "14px 16px",
                }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 10, background: f.accent, display: "flex" }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: f.text }}>Ny bokning</div>
                  <div style={{ fontSize: 16, color: f.textSekundar }}>Anna · tis 10:30</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
