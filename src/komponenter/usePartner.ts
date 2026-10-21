"use client";

import { useSyncExternalStore } from "react";
import { partnerFranSokstrang } from "@/lib/partner";

// Adressraden ändras inte medan sidan visas, så det finns inget att lyssna på.
const ingenPrenumeration = () => () => {};

/**
 * Förbundet besökaren kom via (?partner=slug), eller null.
 *
 * Sidan förrenderas utan partner (servern ser ingen adress), och direkt när
 * sidan blivit interaktiv läses adressraden. useSyncExternalStore gör bytet
 * utan hydreringsfel.
 */
export function usePartner() {
  const sok = useSyncExternalStore(
    ingenPrenumeration,
    () => window.location.search,
    () => "",
  );
  return partnerFranSokstrang(sok);
}
