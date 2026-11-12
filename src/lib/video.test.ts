import { describe, expect, it } from "vitest";
import { inbaddning } from "./video";

describe("inbaddning", () => {
  it("gör om YouTube-länkar till youtube-nocookie", () => {
    const vantat = "https://www.youtube-nocookie.com/embed/abc123XYZ?rel=0";
    expect(inbaddning("https://www.youtube.com/watch?v=abc123XYZ")).toBe(vantat);
    expect(inbaddning("https://youtu.be/abc123XYZ")).toBe(vantat);
    expect(inbaddning("https://www.youtube.com/embed/abc123XYZ")).toBe(vantat);
  });

  it("gör om Vimeo-länkar och ber Vimeo att inte spåra", () => {
    expect(inbaddning("https://vimeo.com/123456789")).toBe("https://player.vimeo.com/video/123456789?dnt=1");
    expect(inbaddning("https://vimeo.com/video/123456789")).toBe("https://player.vimeo.com/video/123456789?dnt=1");
  });

  it("ger null för vanliga videofiler, som spelas direkt", () => {
    expect(inbaddning("/kundcase/video.mp4")).toBeNull();
    expect(inbaddning("https://exempel.se/film.mp4")).toBeNull();
  });
});
