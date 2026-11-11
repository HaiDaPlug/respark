/**
 * BOKNING – länken till kalendern för uppstartsmötet (Calendly).
 * Används av komponenter/Bokning.tsx.
 */

/**
 * Lägger till Calendlys inställningar för inbäddning: sidans färger (utan #)
 * och ingen egen cookie-ruta inne i panelen. Färgerna fungerar bara på
 * Calendlys betalda planer – annars ignoreras de, och länken fungerar ändå.
 * Ogiltiga länkar lämnas som de är.
 */
export function bokningsUrl(
  url: string,
  farger: { bakgrund: string; text: string; accentMork: string },
): string {
  try {
    const u = new URL(url);
    const utanHash = (farg: string) => farg.replace(/^#/, "").toLowerCase();
    u.searchParams.set("hide_gdpr_banner", "1");
    u.searchParams.set("background_color", utanHash(farger.bakgrund));
    u.searchParams.set("text_color", utanHash(farger.text));
    u.searchParams.set("primary_color", utanHash(farger.accentMork));
    return u.toString();
  } catch {
    return url;
  }
}
