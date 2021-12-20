import { onCleanup } from "solid-js";
import { BetterFormElement } from "../types";
import { getValueTransformer } from "./transformers/getValueTransformer";

/** @internal */
export const watchValue = <Values, Key extends keyof Values, Value extends Values[Key]>(
  ref: BetterFormElement,
  onChange: (value: Value) => void,
  callImmediately: boolean
) => {
  const listener = () => onChange(getValueTransformer(ref));

  if (callImmediately) {
    listener();
  }

  ref.addEventListener("input", listener);
  ref.addEventListener("set-manually", listener);
  onCleanup(() => {
    ref.removeEventListener("input", listener);
    ref.removeEventListener("set-manually", listener);
  });
};
