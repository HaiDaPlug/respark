import { describe, expect, it } from "vitest";
import { delaTal, formateraTal } from "./raknare";

describe("delaTal", () => {
  it("delar upp ett rent heltal", () => {
    expect(delaTal("36")).toEqual({ fore: "", tal: 36, efter: "" });
    expect(delaTal("358")).toEqual({ fore: "", tal: 358, efter: "" });
  });

  it("behåller text före och efter talet", () => {
    expect(delaTal("+40 %")).toEqual({ fore: "+", tal: 40, efter: " %" });
    expect(delaTal("ca 120 st")).toEqual({ fore: "ca ", tal: 120, efter: " st" });
  });

  it("läser tusental med mellanslag eller hårt mellanslag", () => {
    expect(delaTal("1 200 kr")).toEqual({ fore: "", tal: 1200, efter: " kr" });
    expect(delaTal("12 500")).toEqual({ fore: "", tal: 12500, efter: "" });
  });

  it("räknar inte decimaltal, intervall eller text utan tal", () => {
    expect(delaTal("3,2")).toBeNull();
    expect(delaTal("2–3")).toBeNull();
    expect(delaTal("Många")).toBeNull();
    expect(delaTal("")).toBeNull();
  });

  it("räknar inte tal som är för stora för att räknas exakt", () => {
    expect(delaTal("99999999999999999999")).toBeNull();
  });
});

describe("formateraTal", () => {
  it("skriver tal som på svenska", () => {
    expect(formateraTal(0)).toBe("0");
    expect(formateraTal(358)).toBe("358");
    expect(formateraTal(1200).replace(/\s/g, " ")).toBe("1 200");
  });
});
