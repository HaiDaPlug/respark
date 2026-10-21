import { describe, expect, it } from "vitest";
import type { Partner } from "@/konfig/sajt";
import { hittaPartner, partnerFranSokstrang } from "./partner";

const lista: Partner[] = [
  { slug: "forbundet", namn: "Förbundet", rabattProcent: 20, aktiv: true },
  { slug: "pausat", namn: "Pausat förbund", rabattProcent: 20, aktiv: false },
  { slug: "demo", namn: "Exempelförbundet", rabattProcent: 20, aktiv: true, endastUtveckling: true },
];

describe("hittaPartner", () => {
  it("hittar ett aktivt förbund oavsett skiftläge och mellanslag", () => {
    expect(hittaPartner(" Forbundet ", lista, "production")?.namn).toBe("Förbundet");
  });

  it("visar aldrig inaktiva eller okända förbund", () => {
    expect(hittaPartner("pausat", lista, "production")).toBeNull();
    expect(hittaPartner("okant", lista, "production")).toBeNull();
    expect(hittaPartner("", lista, "production")).toBeNull();
    expect(hittaPartner(null, lista, "production")).toBeNull();
  });

  it("utvecklingsförbund fungerar lokalt men aldrig på den publicerade sidan", () => {
    expect(hittaPartner("demo", lista, "development")?.slug).toBe("demo");
    expect(hittaPartner("demo", lista, "production")).toBeNull();
  });

  it("läser ?partner= ur en query-sträng", () => {
    expect(partnerFranSokstrang("?utm_source=fb&partner=forbundet", lista, "production")?.slug).toBe("forbundet");
    expect(partnerFranSokstrang("", lista, "production")).toBeNull();
  });
});
