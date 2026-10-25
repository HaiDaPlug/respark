import { ankare, texter } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";

/**
 * Vart "Kom igång"-knapparna i menyn, heron och avslutningen leder:
 * registreringen när den finns, annars prisdelen.
 */
export function komIgangHref() {
  return sajt.lankar.komIgang ?? `/#${ankare.pris}`;
}

/** Texten på "Kom igång"-knapparna: "Testa gratis i N dagar" när det finns en provperiod. */
export function komIgangEtikett() {
  const dagar = sajt.pris.provperiodDagar;
  return dagar ? texter.pris.ctaProvperiod(dagar) : texter.meny.cta;
}

/**
 * Numret som "Ring oss" använder: sajt.kontaktTelefon, annars det första
 * numret i teamet. null = ingen ring-knapp visas.
 */
export function kontaktTelefon() {
  return sajt.kontaktTelefon ?? sajt.team.find((m) => m.telefon)?.telefon ?? null;
}

/**
 * Ett svenskt nummer som det skrivs ("070-123 45 67") som ring-länk
 * ("tel:+46701234567"). Fungerar även om numret redan börjar med +46.
 */
export function telefonHref(nummer: string) {
  const siffror = nummer.replace(/[^\d+]/g, "");
  const internationellt = siffror.startsWith("+") ? siffror : siffror.replace(/^0/, "+46");
  return `tel:${internationellt}`;
}

/**
 * Om sektionen "Vi som står bakom" visas: när någon i teamet har bild,
 * telefon eller mejl, eller när platshållare är på. Annars döljs den, och
 * länkarna dit ("Kontakt") döljs också.
 */
export function visaKontakt() {
  const harUppgifter = sajt.team.some((m) => m.bild || m.telefon || m.epost) || Boolean(sajt.kontaktEpost);
  return harUppgifter || sajt.visaPlatshallare;
}
