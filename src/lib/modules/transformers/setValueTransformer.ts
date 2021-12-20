/** @internal */
export const setValueTransformer = (ref: HTMLInputElement, value: any, event: Event) => {
  if (ref.type === "checkbox") {
    ref.checked = value as any;
  } else {
    ref.value = value as any;
  }
  ref.dispatchEvent(event);
};
