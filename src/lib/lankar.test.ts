import { describe, expect, it } from "vitest";
import { telefonHref } from "./lankar";

describe("telefonHref", () => {
  it("gör ett svenskt mobilnummer till en internationell ring-länk", () => {
    expect(telefonHref("070-123 45 67")).toBe("tel:+46701234567");
  });

  it("behåller ett nummer som redan börjar med +46", () => {
    expect(telefonHref("+46 70 123 45 67")).toBe("tel:+46701234567");
  });

  it("klarar riktnummer med parentes och snedstreck", () => {
    expect(telefonHref("(033) 12 34 56")).toBe("tel:+4633123456");
    expect(telefonHref("033/12 34 56")).toBe("tel:+4633123456");
  });
});
