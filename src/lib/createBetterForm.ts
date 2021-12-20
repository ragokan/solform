import { createSignal, onCleanup, onMount } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import { getValueTransformer } from "../transformers/getValueTransformer";
import { setValueTransformer } from "../transformers/setValueTransformer";
import { BetterFormError, BetterFormOptions, BetterFormValidator } from "./types";

export const createBetterForm = <Values extends object>(
  options: BetterFormOptions<Values> = {}
) => {
  const refs: { [key in keyof Values]?: HTMLInputElement } = {};

  const [errors, setErrors] = createStore<BetterFormError<Values>>({});
  const [loading, setLoading] = createSignal(false);

  const _setManuallyEvent = new CustomEvent("set-manually");

  const getAllValues = () => {
    const values: any = {};
    Object.entries(refs).forEach(
      ([key, ref]) => (values[key] = getValueTransformer(ref as HTMLInputElement))
    );
    return values as Values;
  };

  const register = (key: keyof Values) => ({
    ref: (ref: HTMLInputElement) => (refs[key] = ref),
    name: key,
  });

  const watch = <Key extends keyof Values, Value extends Values[Key]>(
    key: Key,
    onChange: (value: Value) => void,
    opts = { callImmediately: true }
  ) =>
    onMount(() => {
      const ref = refs[key];

      if (!ref) {
        return console.error("The given key is not found:", key);
      }

      const listener = () => onChange(getValueTransformer(ref));

      if (opts.callImmediately) {
        listener();
      }

      ref.addEventListener("input", listener);
      ref.addEventListener("set-manually", listener);
      onCleanup(() => {
        ref.removeEventListener("input", listener);
        ref.removeEventListener("set-manually", listener);
      });
    });

  const _validate = (formValues: Values) => {
    const validationErrors: any = {};
    if (!options.validators) {
      return true;
    }
    Object.entries(options.validators || {}).forEach(([key, validate]: [string, any]) => {
      if (Array.isArray(validate)) {
        for (let index = 0; index < validate.length; index++) {
          const _validator = validate[index];
          const result = _validator(formValues[key] ?? null);
          if (result) {
            validationErrors[key] = result;
            return;
          }
        }
      } else {
        const result = validate(formValues[key] ?? null);
        if (result) {
          validationErrors[key] = result;
        }
      }
    });
    setErrors(reconcile(validationErrors));
    return Object.keys(validationErrors).length === 0;
  };

  const getValue = <Key extends keyof Values, Value extends Values[Key]>(key: Key): Value =>
    getValueTransformer(refs[key]!);

  const setValue = <Key extends keyof Values, Value extends Values[Key]>(key: Key, value: Value) =>
    setValueTransformer(refs[key]!, value, _setManuallyEvent);

  const submit = async () => {
    const _values = getAllValues();
    if (_validate(_values) && options.onSubmit) {
      setLoading(true);
      await options.onSubmit(_values);
      setLoading(false);
    }
  };

  return { register, submit, errors, getValue, setValue, loading, watch, getAllValues };
};
