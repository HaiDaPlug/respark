import { describe, expect, it } from "vitest";
import { bokningsUrl } from "./bokning";

const farger = { bakgrund: "#FAF8F5", text: "#292522", accentMork: "#86603F" };

describe("bokningsUrl", () => {
  it("lägger till färgerna utan # och döljer Calendlys cookie-ruta", () => {
    const u = new URL(bokningsUrl("https://calendly.com/exempel/30min", farger));
    expect(u.origin + u.pathname).toBe("https://calendly.com/exempel/30min");
    expect(u.searchParams.get("hide_gdpr_banner")).toBe("1");
    expect(u.searchParams.get("background_color")).toBe("faf8f5");
    expect(u.searchParams.get("text_color")).toBe("292522");
    expect(u.searchParams.get("primary_color")).toBe("86603f");
  });

  it("behåller parametrar som redan finns i länken", () => {
    const u = new URL(bokningsUrl("https://calendly.com/exempel/30min?month=2026-12", farger));
    expect(u.searchParams.get("month")).toBe("2026-12");
    expect(u.searchParams.get("primary_color")).toBe("86603f");
  });

  it("lämnar en ogiltig länk som den är", () => {
    expect(bokningsUrl("inte en länk", farger)).toBe("inte en länk");
  });
});
