import { describe, it, expect, vi } from "vitest";
import { createForm } from "../src";
import { requiredValidator, minLengthValidator } from "../src";
import { createRoot } from "solid-js";

function createInput(type: string, name: string) {
  const input = document.createElement("input");
  input.type = type;
  input.name = name;
  return input;
}

describe("createForm", () => {
  it("registers elements and gets/sets values", () => {
    type Values = { a: string; b: boolean; n: number | undefined };
    const { register, getValue, setValue, getAllValues } = createForm<Values>();

    const a = createInput("text", "a");
    const b = createInput("checkbox", "b");
    const n = createInput("number", "n");

    register("a").ref(a);
    register("b").ref(b as any);
    register("n").ref(n);

    setValue("a", "hello");
    setValue("b", true as any);
    setValue("n", 10 as any);

    expect(getValue("a")).toBe("hello");
    expect(getValue("b")).toBe(true);
    expect(getValue("n")).toBe(10);

    expect(getAllValues()).toEqual({ a: "hello", b: true, n: 10 });
  });

  it("applies initialValues including falsy values", () => {
    type V = { a: string; b: boolean; c: number | undefined };
    const { register, getAllValues } = createForm<V>({ initialValues: { a: "", b: false, c: 0 } });

    const a = createInput("text", "a");
    const b = createInput("checkbox", "b");
    const c = createInput("number", "c");

    register("a").ref(a);
    register("b").ref(b as any);
    register("c").ref(c);

    expect(getAllValues()).toEqual({ a: "", b: false, c: 0 });
  });

  it("watches value changes (input and set-manually)", async () => {
    type V = { a: string };
    const { register, watch, setValue } = createForm<V>();
    const a = createInput("text", "a");

    register("a").ref(a);

    const handler = vi.fn();

    let dispose: () => void = () => {};
    createRoot((d) => {
      dispose = d;
      watch("a", handler);
    });

    // Allow onMount to register listeners
    await Promise.resolve();

    a.value = "x";
    a.dispatchEvent(new Event("input"));
    expect(handler).toHaveBeenCalledWith("x");

    setValue("a", "y");
    expect(handler).toHaveBeenCalledWith("y");

    dispose();
  });

  it("validates and sets errors on submit failure", async () => {
    type V = { name: string };
    const validators = { name: [requiredValidator("required"), minLengthValidator(3, "min3")] } as const;
    const { register, submit, errors } = createForm<V>({ validators });
    const name = createInput("text", "name");
    register("name").ref(name);

    // empty -> required
    await submit();
    expect(errors.name).toBe("required");

    // too short -> min3
    name.value = "ab";
    await submit();
    expect(errors.name).toBe("min3");

    // pass
    name.value = "abcd";
    await submit();
    expect(errors.name).toBeUndefined();
  });

  it("calls onSubmit with values and toggles loading", async () => {
    type V = { x: string };
    const onSubmit = vi.fn();
    const { register, submit, setValue, loading } = createForm<V>({ onSubmit });
    const x = createInput("text", "x");
    register("x").ref(x);
    setValue("x", "ok");

    const evt = new Event("submit");
    await submit(evt);

    expect(onSubmit).toHaveBeenCalledWith({ x: "ok" });
    expect(loading()).toBe(false);
  });
});