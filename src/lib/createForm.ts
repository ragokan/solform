import { createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { getValueTransformer } from "./modules/transformers/getValueTransformer";
import { setValueTransformer } from "./modules/transformers/setValueTransformer";
import { validateForm } from "./modules/validateForm";
import { watchValue } from "./modules/watchValue";
import { SolFormElement, SolFormError, SolFormOptions } from "./types";

const _setManuallyEvent = new CustomEvent("set-manually");

export const createForm = <Values extends object>(options: SolFormOptions<Values> = {}) => {
  const refs: { [key in keyof Values]?: SolFormElement } = {};

  const [errors, setErrors] = createStore<SolFormError<Values>>({});
  const [loading, setLoading] = createSignal(false);

  const getAllValues = () => {
    const values: any = {};
    Object.entries(refs).forEach(([key, ref]) => (values[key] = getValueTransformer(ref as SolFormElement)));
    return values as Values;
  };

  const register = (key: keyof Values) => ({
    ref: (ref: SolFormElement) => (refs[key] = ref),
    name: key,
  });

  const watch = <Key extends keyof Values, Value extends Values[Key]>(key: Key, onChange: (value: Value) => void, opts = { callImmediately: true }) =>
    onMount(() => {
      watchValue(refs[key]!, onChange, opts.callImmediately);
    });

  const _validate = (formValues: Values) => validateForm(formValues, options.validators, setErrors);

  const getValue = <Key extends keyof Values, Value extends Values[Key]>(key: Key): Value => getValueTransformer(refs[key]!);

  const setValue = <Key extends keyof Values, Value extends Values[Key]>(key: Key, value: Value) => setValueTransformer(refs[key]!, value, _setManuallyEvent);

  const submit = async (event?: Event | undefined) => {
    event?.preventDefault();
    const _values = getAllValues();
    if (_validate(_values) && options.onSubmit) {
      setLoading(true);
      await options.onSubmit(_values);
      setLoading(false);
    }
  };

  return { register, submit, errors, getValue, setValue, loading, watch, getAllValues };
};
