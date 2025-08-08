import { describe, it, expect } from "vitest";
import { validateForm } from "../src/lib/modules/validateForm";
import { createStore } from "solid-js/store";

describe("validateForm", () => {
  it("populates only failing fields and clears passing ones", () => {
    type V = { a: string | undefined; b: string | undefined };
    const [errors, setErrors] = createStore<{ a?: string; b?: string }>({ a: "old", b: "old" });

    const validators = {
      a: (v: any) => (v ? undefined : "missing"),
      b: (v: any) => (v && v.length > 2 ? undefined : "short"),
    } as const;

    const ok = validateForm<V>({ a: undefined, b: "abc" } as any, validators as any, setErrors as any);

    expect(ok).toBe(false);
    expect(errors).toEqual({ a: "missing" });
  });
});