import { onCleanup, onMount } from "solid-js";
import { getValueTransformer } from "./transformers/getValueTransformer";

/** @internal */
export const watchValue = <Values, Key extends keyof Values, Value extends Values[Key]>(
  ref: HTMLInputElement,
  onChange: (value: Value) => void,
  callImmediately: boolean
) =>
  onMount(() => {
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
  });
