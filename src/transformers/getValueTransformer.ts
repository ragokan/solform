export const getValueTransformer = (ref: HTMLInputElement) => {
  let value: any;
  if (ref.type === "number") {
    value = Number(ref.value);
  } else if (ref.type === "checkbox") {
    value = ref.checked;
  } else {
    value = ref.value;
  }
  return value;
};
