import { reconcile, SetStoreFunction } from "solid-js/store";
import { SolFormError, SolFormValidatorsOption } from "../types";

/** @internal */
export const validateForm = <Values>(
  formValues: Values,
  validators: SolFormValidatorsOption<Values> | undefined,
  setErrors: SetStoreFunction<SolFormError<Values>>
) => {
  const validationErrors: any = {};
  if (!validators) {
    return true;
  }
  Object.entries(validators || {}).forEach(([key, validate]: [string, any]) => {
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
