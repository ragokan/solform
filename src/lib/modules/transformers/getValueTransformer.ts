import { SolFormElement } from "../../types";

/** @internal */
export const getValueTransformer = (ref: SolFormElement) => {
  let value: any;
  if (ref.type === "number") {
    value = Number(ref.value);
  } else if (ref.type === "checkbox") {
    value = (ref as HTMLInputElement).checked;
  } else {
    value = ref.value;
  }
  return value;
};
