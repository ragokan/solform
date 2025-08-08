import { SolFormElement } from "../../types";

/** @internal */
export const setValueTransformer = (ref: SolFormElement, value: any) => {
  if (ref.type === "checkbox") {
    (ref as HTMLInputElement).checked = value as any;
  } else {
    ref.value = value as any;
  }
  ref.dispatchEvent(new CustomEvent("set-manually"));
};
