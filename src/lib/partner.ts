import { sajt, type Partner } from "@/konfig/sajt";

/**
 * Hittar förbundet som hör till en partnerlänk (?partner=slug).
 *
 * Returnerar null för okända, inaktiva och – på den publicerade sidan –
 * utvecklingsförbund. Då ser besökaren den vanliga sidan, så en felstavad
 * eller gammal länk aldrig visar ett obekräftat samarbete.
 */
export function hittaPartner(
  slug: string | null | undefined,
  lista: Partner[] = sajt.partners,
  miljo: string | undefined = process.env.NODE_ENV,
): Partner | null {
  if (!slug) return null;
  const sokt = slug.trim().toLowerCase();
  const partner = lista.find((p) => p.slug === sokt);
  if (!partner || !partner.aktiv) return null;
  if (partner.endastUtveckling && miljo === "production") return null;
  return partner;
}

/** Läser ?partner= ur en query-sträng, t.ex. window.location.search. */
export function partnerFranSokstrang(sok: string, lista?: Partner[], miljo?: string) {
  return hittaPartner(new URLSearchParams(sok).get("partner"), lista, miljo);
}
