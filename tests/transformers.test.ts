import { describe, it, expect } from "vitest";
import { getValueTransformer } from "../src/lib/modules/transformers/getValueTransformer";
import { setValueTransformer } from "../src/lib/modules/transformers/setValueTransformer";

describe("transformers", () => {
  it("reads number input as number and empty as undefined", () => {
    const input = document.createElement("input");
    input.type = "number";
    input.value = "42";
    expect(getValueTransformer(input)).toBe(42);
    input.value = "";
    expect(getValueTransformer(input)).toBeUndefined();
  });

  it("reads checkbox checked state", () => {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = true;
    expect(getValueTransformer(input)).toBe(true);
    input.checked = false;
    expect(getValueTransformer(input)).toBe(false);
  });

  it("sets text value and dispatches set-manually", async () => {
    const input = document.createElement("input");
    input.type = "text";
    let called = false;
    input.addEventListener("set-manually", () => (called = true));
    setValueTransformer(input, "abc");
    expect(input.value).toBe("abc");
    expect(called).toBe(true);
  });

  it("sets checkbox checked and dispatches set-manually", () => {
    const input = document.createElement("input");
    input.type = "checkbox";
    let called = false;
    input.addEventListener("set-manually", () => (called = true));
    setValueTransformer(input, true);
    expect(input.checked).toBe(true);
    expect(called).toBe(true);
  });
});