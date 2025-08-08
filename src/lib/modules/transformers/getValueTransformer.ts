import { SolFormElement } from "../../types";

/** @internal */
export const getValueTransformer = (ref: SolFormElement) => {
  let value: any;
  if (ref.type === "number") {
    const raw = ref.value;
    value = raw === "" ? undefined : Number(raw);
  } else if (ref.type === "checkbox") {
    value = (ref as HTMLInputElement).checked;
  } else {
    value = ref.value;
  }
  return value;
};
