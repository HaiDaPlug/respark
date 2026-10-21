import { ankare } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";

/**
 * Vart "Kom igång"-knapparna i menyn, heron och avslutningen leder:
 * registreringen när den finns, annars prisdelen.
 */
export function komIgangHref() {
  return sajt.lankar.komIgang ?? `/#${ankare.pris}`;
}
