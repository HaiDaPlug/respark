/**
 * BOKNING – länken till kalendern för uppstartsmötet (Calendly).
 * Används av komponenter/Bokning.tsx.
 */

/**
 * Lägger till Calendlys inställningar för inbäddning: sidans färger (utan #)
 * och ingen egen cookie-ruta inne i panelen. Färgerna fungerar bara på
 * Calendlys betalda planer – annars ignoreras de, och länken fungerar ändå.
 * Det som redan står i länken vinner (t.ex. primary_color från Calendlys
 * inbäddningskod), så sidans färger fyller bara i det som saknas.
 * Ogiltiga länkar lämnas som de är.
 */
export function bokningsUrl(
  url: string,
  farger: { bakgrund: string; text: string; accentMork: string },
): string {
  try {
    const u = new URL(url);
    const utanHash = (farg: string) => farg.replace(/^#/, "").toLowerCase();
    // Sätt bara värden som länken inte redan har.
    const omSaknas = (namn: string, varde: string) => {
      if (!u.searchParams.has(namn)) u.searchParams.set(namn, varde);
    };
    omSaknas("hide_gdpr_banner", "1");
    omSaknas("background_color", utanHash(farger.bakgrund));
    omSaknas("text_color", utanHash(farger.text));
    omSaknas("primary_color", utanHash(farger.accentMork));
    return u.toString();
  } catch {
    return url;
  }
}
