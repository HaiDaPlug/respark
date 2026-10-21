import { describe, expect, it } from "vitest";
import { kronor, medlemspris } from "./pris";

describe("medlemspris", () => {
  it("1 000 kr med 20 % rabatt blir 800 kr", () => {
    expect(medlemspris(1000, 20)).toBe(800);
  });

  it("avrundar till hela kronor", () => {
    expect(medlemspris(699, 15)).toBe(594);
  });
});

describe("kronor", () => {
  it("skriver belopp med hårt mellanslag före kr", () => {
    expect(kronor(600)).toBe("600 kr");
  });

  it("använder svensk tusentalsavgränsning och decimalkomma", () => {
    expect(kronor(1500).replace(/\s/g, " ")).toBe("1 500 kr");
    expect(kronor(0.5)).toBe("0,50 kr");
  });
});
