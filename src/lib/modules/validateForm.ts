import { reconcile, SetStoreFunction } from "solid-js/store";
import {
  SolFormError,
  SolFormValidatorsOption,
  SolFormElement,
} from "../types";

/** @internal */
export const validateForm = <Values>(
  formValues: Values,
  validators: SolFormValidatorsOption<Values> | undefined,
  setErrors: SetStoreFunction<SolFormError<Values>>,
  refs: { [key in keyof Values]?: SolFormElement }
) => {
  const validationErrors: any = {};
  if (!validators) {
    return true;
  }
  let firstErrorKey: string | undefined;
  Object.entries(validators || {}).forEach(([key, validate]: [string, any]) => {
    if (Array.isArray(validate)) {
      for (let index = 0; index < validate.length; index++) {
        const _validator = validate[index];
        const result = _validator(formValues[key] ?? null);
        if (result) {
          if (!firstErrorKey) firstErrorKey = key;
          validationErrors[key] = result;
          return;
        }
      }
    } else {
      const result = validate(formValues[key] ?? null);
      if (result) {
        if (!firstErrorKey) firstErrorKey = key;
        validationErrors[key] = result;
      }
    }
  });

  if (firstErrorKey) refs[firstErrorKey].focus();

  setErrors(reconcile(validationErrors));
  return Object.keys(validationErrors).length === 0;
};
