import { SolFormElement } from "../../types";

/** @internal */
export const setValueTransformer = (ref: SolFormElement, value: any, event: Event) => {
  if (ref.type === "checkbox") {
    (ref as HTMLInputElement).checked = value as any;
  } else {
    ref.value = value as any;
  }
  ref.dispatchEvent(event);
};
